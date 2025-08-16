
"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NotesGrid from "../components/NotesGrid";

const readAll = () => JSON.parse(localStorage.getItem("notes") || "[]");
const writeAll = (arr) => localStorage.setItem("notes", JSON.stringify(arr));

export default function PinnedPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const all = readAll();
    setNotes(all.filter((n) => n.status === "pinned"));
  }, []);

  const refreshPinned = () => {
    const all = readAll();
    setNotes(all.filter((n) => n.status === "pinned"));
  };

  const unpinNote = (id) => {
    const updated = readAll().map((n) => (n.id === id ? { ...n, status: "active" } : n));
    writeAll(updated);
    refreshPinned();
  };

  const moveToTrash = (id) => {
    const updated = readAll().map((n) => (n.id === id ? { ...n, status: "trash" } : n));
    writeAll(updated);
    refreshPinned();
  };

  const editNote = (id, data) => {
    const updated = readAll().map((n) => (n.id === id ? { ...n, ...data } : n));
    writeAll(updated);
    refreshPinned();
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Pinned Notes</h1>
        <NotesGrid notes={notes} onUnpin={unpinNote} onTrash={moveToTrash} onEdit={editNote} />
      </div>
    </div>
  );
}
