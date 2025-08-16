"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NotesGrid from "../components/NotesGrid";

const readAll = () => JSON.parse(localStorage.getItem("notes") || "[]");
const writeAll = (arr) => localStorage.setItem("notes", JSON.stringify(arr));

export default function TrashPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const all = readAll();
    setNotes(all.filter((n) => n.status === "trash"));
  }, []);

  const refreshTrash = () => {
    const all = readAll();
    setNotes(all.filter((n) => n.status === "trash"));
  };

  const recoverNote = (id) => {
    const updated = readAll().map((n) => (n.id === id ? { ...n, status: "active" } : n));
    writeAll(updated);
    refreshTrash();
  };

  const deletePermanently = (id) => {
    const updated = readAll().filter((n) => n.id !== id);
    writeAll(updated);
    refreshTrash();
  };

  return (
    <div className="flex">
      <Navbar />
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="bg-gradient-to-br from-cyan-300 to-indigo-400 bg-clip-text text-3xl font-extrabold text-transparent">
            Trash
          </h1>
          <p className="mt-1 text-sm text-slate-400">Recover or permanently delete notes.</p>
        </header>
        <NotesGrid notes={notes} onRecover={recoverNote} onDelete={deletePermanently} />
      </main>
    </div>
  );
}