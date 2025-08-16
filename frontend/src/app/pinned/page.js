"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NotesGrid from "../components/NotesGrid";
import { notesApi, auth } from "../lib/api";

export default function PinnedPage() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    (async () => {
      const me = await auth.me();
      setNotes(await notesApi.list("pinned", me.id));
    })();
  }, []);

  const refresh = async () => setNotes(await notesApi.list("pinned", me.id));
  const unpin = async (id) => { await notesApi.update(id, { status: "active" }); await refresh(); };
  const trash = async (id) => { await notesApi.update(id, { status: "trash" }); await refresh(); };
  const edit = async (id, data) => { await notesApi.update(id, { title: data.title, body: data.content }); await refresh(); };

  return (
    <div className="flex">
      <Navbar />
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="bg-gradient-to-br from-cyan-300 to-indigo-400 bg-clip-text text-3xl font-extrabold text-transparent">Pinned Notes</h1>
        </header>
        <NotesGrid notes={notes.map(n => ({ id: n.id, title: n.title, content: n.body }))} onUnpin={unpin} onTrash={trash} onEdit={edit} />
      </main>
    </div>
  );
}