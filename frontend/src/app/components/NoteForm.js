"use client";
import React, { useState } from "react";

export default function NoteForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title && !content) return;
    onAdd({ id: Date.now(), title, content, pinned: false });
    setTitle("");
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-4 mb-4 w-full max-w-lg mx-auto"
    >
      <input
        type="text"
        placeholder="Title"
        className="w-full border-none outline-none text-lg mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Take a note..."
        className="w-full border-none outline-none resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
}
