"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NotesGrid from "../components/NotesGrid";
import NoteForm from "../components/NoteForm";

const readAll = () => JSON.parse(localStorage.getItem("notes") || "[]");
const writeAll = (arr) => localStorage.setItem("notes", JSON.stringify(arr));

export default function HomePage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const all = readAll();
    setNotes(all.filter((n) => (n.status ?? "active") === "active"));
  }, []);

  const refreshActive = () => {
    const all = readAll();
    setNotes(all.filter((n) => n.status === "active"));
  };

  const addNote = (note) => {
    const newNote = {
      id: Date.now(),
      title: note.title || "",
      content: note.content || "",
      status: "active",
    };
    const updated = [newNote, ...readAll()];
    writeAll(updated);
    refreshActive();
  };

  const pinNote = (id) => {
    const updated = readAll().map((n) => (n.id === id ? { ...n, status: "pinned" } : n));
    writeAll(updated);
    refreshActive();
  };

  const trashNote = (id) => {
    const updated = readAll().map((n) => (n.id === id ? { ...n, status: "trash" } : n));
    writeAll(updated);
    refreshActive();
  };

  const editNote = (id, data) => {
    const updated = readAll().map((n) => (n.id === id ? { ...n, ...data } : n));
    writeAll(updated);
    refreshActive();
  };

  return (
    <div className="flex">
      <Navbar />
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="bg-gradient-to-br from-cyan-300 to-indigo-400 bg-clip-text text-3xl font-extrabold text-transparent">
            All Notes
          </h1>
          <p className="mt-1 text-sm text-slate-400">Create, pin, and organize your notes locally.</p>
        </header>
        <NoteForm onAdd={addNote} />
        <NotesGrid notes={notes} onPin={pinNote} onTrash={trashNote} onEdit={editNote} />
      </main>
    </div>
  );
}