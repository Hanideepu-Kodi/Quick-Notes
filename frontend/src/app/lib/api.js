// src/app/lib/api.js
const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function j(method, path, body) {
  const res = await fetch(`${BASE}${path}` , {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include", // send/receive cookies
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const message = data?.detail || data?.message || `${res.status}`;
    throw new Error(message);
  }
  return data;
}

// Auth
export const auth = {
  me: () => j("GET", "/auth/me"),
  login: (email, password) => j("POST", "/auth/login", { email, password }),
  register: (email, password) => j("POST", "/auth/register", { email, password }),
  logout: () => j("POST", "/auth/logout"),
};

// Notes (server model uses title/body/status)
export const notesApi = {
  list: (status, userId) => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (userId) params.append("user_id", userId);
  return j("GET", `/notes?${params.toString()}`);
},
  create: (payload) => j("POST", "/notes", payload),
  update: (id, payload) => j("PATCH", `/notes/${id}`, payload),
  delete: (id) => j("DELETE", `/notes/${id}`),
  deleteForever: (id) => j("DELETE", `/notes/${id}?permanent=true`),
};