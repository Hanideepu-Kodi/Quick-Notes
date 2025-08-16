"use client";
import NoteCard from "./NoteCard";
import { FilePlus2 } from "lucide-react";

export default function NotesGrid(props) {
  const { notes = [] } = props;

  if (!notes.length) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
        <FilePlus2 className="h-8 w-8" />
        <p className="text-sm">No notes yet.</p>
        <p className="text-xs text-slate-400">Add one above to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {notes.map((n) => (
        <NoteCard key={n.id} note={n} {...props} />
      ))}
    </div>
  );
}