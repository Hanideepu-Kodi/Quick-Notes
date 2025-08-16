"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import NotesGrid from "../components/NotesGrid";
import NoteForm from "../components/NoteForm";
import { notesApi, auth } from "../lib/api";

const USER_ID_KEY = "qn_user_id"; // store user id after login/me

export default function HomePage() {
  const router = useRouter();
  const search = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [notes, setNotes] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await auth.me();
        setUserId(me.id);
        const data = await notesApi.list("active");
        setNotes(data);
      } catch {
        // If middleware didn't catch it (e.g., cookie expired mid-session),
        // bounce to login and preserve where the user wanted to go.
        const next = "/home";
        router.replace(`/`);
        return;
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const refresh = async () => {
    const data = await notesApi.list("active");
    setNotes(data);
  };

  const addNote = async (note) => {
    await notesApi.create({ user_id: userId, title: note.title || "", body: note.content || "", status: "active" });
    await refresh();
  };

  const pinNote = async (id) => { await notesApi.update(id, { status: "pinned" }); await refresh(); };
  const trashNote = async (id) => { await notesApi.update(id, { status: "trash" }); await refresh(); };
  const editNote = async (id, data) => { await notesApi.update(id, { title: data.title, body: data.content }); await refresh(); };

  return (
    <div className="flex">
      <Navbar />
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="bg-gradient-to-br from-cyan-300 to-indigo-400 bg-clip-text text-3xl font-extrabold text-transparent">All Notes</h1>
          <p className="mt-1 text-sm text-slate-400">Create, pin, and organize your notes.</p>
        </header>
        <NoteForm onAdd={addNote} />
        <NotesGrid notes={notes.map(n => ({ id: n.id, title: n.title, content: n.body }))} onPin={pinNote} onTrash={trashNote} onEdit={editNote} />
      </main>
    </div>
  );
}