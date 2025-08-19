import os
from typing import Optional, Dict, Any, List

import pymysql
from fastapi import FastAPI, HTTPException, Query, Body, Request, Response, Depends
from dotenv import load_dotenv
from passlib.hash import bcrypt
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI,  HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta, timezone
import jwt

load_dotenv()

DB_HOST = os.environ["DB_HOST"]
DB_PORT = int(os.environ["DB_PORT"])
DB_NAME = os.environ["DB_NAME"]
DB_USER = os.environ["DB_USER"]
DB_PASS = os.environ["DB_PASS"]

app = FastAPI(
    title="Quick Notes API",
    description="FastAPI + MySQL with plain SQL",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    # Plain MySQL connection, returns dict rows
    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False,
    )

SECRET = os.environ.get("JWT_SECRET", "change-me")
JWT_EXP_MIN = 60 * 24     # 24h
COOKIE_NAME = "token"

#--------AUTHENTICATION----------
# --- User DB helpers -------------------------------------------------
def get_user_by_email(email: str):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, email, password_hash, created_at FROM users WHERE email=%s",
                (email,)
            )
            return cur.fetchone()  # or None
    finally:
        conn.close()

def insert_user(email: str, password_hash: str):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (email, password_hash) VALUES (%s, %s)",
                (email, password_hash)
            )
            user_id = cur.lastrowid
            cur.execute("SELECT id, email, created_at FROM users WHERE id=%s", (user_id,))
            row = cur.fetchone()
        conn.commit()
        return row
    except pymysql.err.IntegrityError:
        conn.rollback()
        # Unique key violation on email
        raise HTTPException(status_code=409, detail="Email already exists")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

class AuthIn(BaseModel):
    email: EmailStr
    password: str

def sign_jwt(sub: str):
    payload = {"sub": sub, "exp": datetime.now(timezone.utc) + timedelta(minutes=JWT_EXP_MIN)}
    return jwt.encode(payload, SECRET, algorithm="HS256")

def set_auth_cookie(resp: Response, token: str):
    # On localhost, SameSite='Lax' is OK. In production with cross-site, use SameSite=None and Secure=True.
    resp.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,     # True if HTTPS
        max_age=60*60*24, # 1 day
        path="/",
    )

#API to register
@app.post("/auth/register")
def register(body: AuthIn):
    email = body.email.lower().strip()
    if not body.password:
        raise HTTPException(status_code=400, detail="Password required")

    # Check if exists
    if get_user_by_email(email):
        raise HTTPException(status_code=409, detail="Email already exists")

    # Hash with passlib
    password_hash = bcrypt.hash(body.password)
    # Insert user
    _ = insert_user(email, password_hash)
    return {"message": "Registered"}

#API to login
@app.post("/auth/login")
def login(body: AuthIn, response: Response):
    email = body.email.lower().strip()
    user = get_user_by_email(email)
    if not user:
        # Keep your desired message/status
        raise HTTPException(status_code=404, detail="Email not registered. Please register.")

    if not bcrypt.verify(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = sign_jwt(email)
    set_auth_cookie(response, token)
    return {"message": "Logged in", "user": {"id": user["id"], "email": user["email"]}}

#API to logout
@app.post("/auth/logout")
def logout(response: Response):
    response.delete_cookie(COOKIE_NAME, path="/")
    return {"message": "Logged out"}

#API to get the current user
@app.get("/auth/me")
def me(request: Request):
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Unauthenticated")
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        email = payload["sub"]
        user = get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=401, detail="Unauthenticated")
        return {"email": user["email"], "id": user["id"]}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
# ---------------------------------------------------------------------


# API to create an User
@app.post("/users", status_code=201)
def create_user(payload: Dict[str, Any] = Body(
    ...,
    example={"email": "alice@example.com", "password": "S3cret!"}
)):
    email = (payload or {}).get("email")
    password = (payload or {}).get("password")
    if not email or not password:
        raise HTTPException(status_code=400, detail="email and password are required")

    password_hash = bcrypt.hash(password)

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Ensures unique emails
            sql = "INSERT INTO users (email, password_hash) VALUES (%s, %s)"
            cur.execute(sql, (email, password_hash))
            user_id = cur.lastrowid

            # fetch the created row
            cur.execute("SELECT id, email, created_at FROM users WHERE id=%s", (user_id,))
            row = cur.fetchone()
        conn.commit()
        return row
    except pymysql.err.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=409, detail="email already exists")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# API to list all users
@app.get("/users")
def list_users() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, email, created_at FROM users ORDER BY created_at DESC")
            rows = cur.fetchall()
        return rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

#API to create a note
@app.post("/notes", status_code=201)
def create_note(payload: Dict[str, Any] = Body(
    ...,
    example={"user_id": 1, "title": "First note", "body": "Hello Quick Notes!"}
)):
    user_id = (payload or {}).get("user_id")
    title = (payload or {}).get("title")
    body = (payload or {}).get("body", "")
    status = (payload or {}).get("status", "active")


    if not user_id or not title:
        raise HTTPException(status_code=400, detail="user_id and title are required")

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Check user exists
            cur.execute("SELECT id FROM users WHERE id=%s", (user_id,))
            if cur.fetchone() is None:
                raise HTTPException(status_code=404, detail="User not found")

            cur.execute(
                "INSERT INTO notes (user_id, title, body, status) VALUES (%s, %s, %s, %s)",
                (user_id, title, body, status),
            )
            note_id = cur.lastrowid

            cur.execute(
                "SELECT id, user_id, title, body, status, created_at, updated_at FROM notes WHERE id=%s",
                (note_id,),
            )
            row = cur.fetchone()
        conn.commit()
        return row
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

#API to list all notes/ all notes belonging to a specific user
@app.get("/notes")
def list_notes(user_id: Optional[int] = Query(default=None), status: Optional[str] = Query(default=None)) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            sql = "SELECT id, user_id, title, body, status, created_at, updated_at FROM notes"
            params = []
            conditions = []

            if user_id is not None:
                conditions.append("user_id=%s")
                params.append(user_id)
            
            if status is not None:
                conditions.append("status=%s")
                params.append(status)

            if conditions:
                sql += " WHERE " + " AND ".join(conditions)
            
            sql += " ORDER BY created_at DESC"
            
            cur.execute(sql, params)
            rows = cur.fetchall()
        return rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

#API to get note based on it's ID
@app.get("/notes/{note_id}")
def get_note(note_id: int):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, user_id, title, body, status, created_at, updated_at FROM notes WHERE id=%s",
                (note_id)
            )
            row = cur.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="Note not found")
        return row
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

#API to update a note based on it's ID
@app.patch("/notes/{note_id}")
def update_note(
    note_id: int,
    payload: Dict[str, Any] = Body(..., example={"title": "New title", "body": "Updated body"})
):
    title = (payload or {}).get("title")
    body = (payload or {}).get("body")
    status = (payload or {}).get("status")

    if title is None and body is None and status is None:
        raise HTTPException(status_code=400, detail="nothing to update")

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Build dynamic set clause safely
            sets, params = [], []
            if title is not None:
                sets.append("title=%s")
                params.append(title)
            if body is not None:
                sets.append("body=%s")
                params.append(body)
            if status is not None:
                sets.append("status=%s")
                params.append(status)

            params.append(note_id)

            sql = f"UPDATE notes SET {', '.join(sets)} WHERE id=%s"
            cur.execute(sql, params)

            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Note not found")

            cur.execute(
                "SELECT id, user_id, title, body, status, created_at, updated_at FROM notes WHERE id=%s",
                (note_id,),
            )
            row = cur.fetchone()
        conn.commit()
        return row
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

#API to delete a note based on it's ID
@app.delete("/notes/{note_id}", status_code=204)
def delete_note(note_id: int, permanent: bool = Query(default=False)):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            if permanent:
                cur.execute("DELETE FROM notes WHERE id=%s", (note_id,))
            else:
                cur.execute("UPDATE notes SET status='trash' WHERE id=%s", (note_id,))
            
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Note not found")
        conn.commit()
        return
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
