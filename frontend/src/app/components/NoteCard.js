"use client";
import { useState } from "react";
import { Pin, Pencil, Trash2, Undo2, X } from "lucide-react";

export default function NoteCard({ note, onPin, onUnpin, onTrash, onDelete, onRecover, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const save = () => {
    onEdit?.(note.id, { title, content });
    setEditing(false);
  };

  return (
    <div className={`${!editing?'group':''} relative rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm transition-all hover:border-white/20 hover:bg-white/7 backdrop-blur-md`}>
      {/* Hover toolbar */}
      <div className="pointer-events-none absolute right-2 top-2 flex translate-y-1 gap-1 opacity-0 transition-all group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
        {onPin && (
          <button
            onClick={() => onPin(note.id)}
            className="rounded-lg bg-white/10 p-2 text-slate-200 hover:bg-white/20"
            title="Pin"
          >
            <Pin className="h-4 w-4" />
          </button>
        )}
        {onUnpin && (
          <button
            onClick={() => onUnpin(note.id)}
            className="rounded-lg bg-white/10 p-2 text-slate-200 hover:bg-white/20"
            title="Unpin"
          >
            <Pin className="h-4 w-4 rotate-45" />
          </button>
        )}
        {onTrash && (
          <button
            onClick={() => onTrash(note.id)}
            className="rounded-lg bg-white/10 p-2 text-slate-200 hover:bg-white/20"
            title="Move to Trash"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        {onRecover && (
          <button
            onClick={() => onRecover(note.id)}
            className="rounded-lg bg-white/10 p-2 text-slate-200 hover:bg-white/20"
            title="Recover"
          >
            <Undo2 className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(note.id)}
            className="rounded-lg bg-white/10 p-2 text-slate-200 hover:bg-white/20"
            title="Delete permanently"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => (editing ? save() : setEditing(true))}
            className="rounded-lg bg-white/10 p-2 text-slate-200 hover:bg-white/20"
            title={editing ? "Save" : "Edit"}
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      {editing ? (
        <div className="grid gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg bg-white/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none rounded-lg bg-white/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setEditing(false)}
              className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 px-3 py-1 text-sm font-semibold text-slate-900 shadow"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="mb-1 line-clamp-1 text-base font-semibold">{note.title || "Untitled"}</h3>
          <p className="line-clamp-5 whitespace-pre-wrap text-sm text-slate-300">{note.content}</p>
        </>
      )}
    </div>
  );
}