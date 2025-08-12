"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

export default function PinnedPage() {
  const [notes, setNotes] = useState([]);

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Pinned Notes</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notes.map((note, idx) => (
            <div key={idx} className="p-4 rounded shadow bg-yellow-100">
              {note.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
