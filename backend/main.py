import os
from typing import Optional, Dict, Any, List

import pymysql
from fastapi import FastAPI, HTTPException, Query, Body
from dotenv import load_dotenv
from passlib.hash import bcrypt
from fastapi.middleware.cors import CORSMiddleware

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
                "INSERT INTO notes (user_id, title, body) VALUES (%s, %s, %s)",
                (user_id, title, body),
            )
            note_id = cur.lastrowid

            cur.execute(
                "SELECT id, user_id, title, body, created_at, updated_at FROM notes WHERE id=%s",
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
def list_notes(user_id: Optional[int] = Query(default=None)) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            if user_id is None:
                cur.execute(
                    "SELECT id, user_id, title, body, created_at, updated_at "
                    "FROM notes ORDER BY created_at DESC"
                )
            else:
                cur.execute(
                    "SELECT id, user_id, title, body, created_at, updated_at "
                    "FROM notes WHERE user_id=%s ORDER BY created_at DESC",
                    (user_id,),
                )
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
                "SELECT id, user_id, title, body, created_at, updated_at FROM notes WHERE id=%s",
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

    if title is None and body is None:
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

            params.append(note_id)

            sql = f"UPDATE notes SET {', '.join(sets)} WHERE id=%s"
            cur.execute(sql, params)

            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Note not found")

            cur.execute(
                "SELECT id, user_id, title, body, created_at, updated_at FROM notes WHERE id=%s",
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
def delete_note(note_id: int):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM notes WHERE id=%s", (note_id,))
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
