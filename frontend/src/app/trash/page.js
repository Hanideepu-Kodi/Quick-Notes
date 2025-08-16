
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
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Trash</h1>
        <NotesGrid notes={notes} onRecover={recoverNote} onDelete={deletePermanently} />
      </div>
    </div>
  );
}
