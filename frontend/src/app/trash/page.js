"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NotesGrid from "../components/NotesGrid";
import { notesApi, auth } from "../lib/api";

export default function TrashPage() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    (async () => {
      const me = await auth.me();
      setNotes(await notesApi.list("trash", me.id));
    })();
  }, []);

  const refresh = async () => setNotes(await notesApi.list("trash"));
  const recover = async (id) => { await notesApi.update(id, { status: "active" }); await refresh(); };
  const del = async (id) => { await notesApi.delete(id); await refresh(); };

  return (
    <div className="flex">
      <Navbar />
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="bg-gradient-to-br from-cyan-300 to-indigo-400 bg-clip-text text-3xl font-extrabold text-transparent">Trash</h1>
          <p className="mt-1 text-sm text-slate-400">Recover or permanently delete notes.</p>
        </header>
        <NotesGrid notes={notes.map(n => ({ id: n.id, title: n.title, content: n.body }))} onRecover={recover} onDelete={del} />
      </main>
    </div>
  );
}