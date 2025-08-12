"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";

const DEFAULT_COLORS = [
  "bg-white",
  "bg-yellow-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-red-100",
  "bg-purple-100",
];

export default function HomePage() {
  const [notes, setNotes] = useState([]);

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Home</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notes.map((note, idx) => (
            <div
              key={idx}
              className={`p-4 rounded shadow ${note.color || "bg-white"}`}
            >
              {note.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
