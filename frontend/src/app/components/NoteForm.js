"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function NoteForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    onAdd({ title, content });
    setTitle("");
    setContent("");
  };

  return (
    <form
      onSubmit={submit}
      className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-sm"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="col-span-1 rounded-xl bg-white/10 px-3 py-2 text-sm placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-400/40"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note…"
          rows={2}
          className="col-span-2 resize-none rounded-xl bg-white/10 px-3 py-2 text-sm placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-400/40"
        />
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-md transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          title="Add note"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
    </form>
  );
}