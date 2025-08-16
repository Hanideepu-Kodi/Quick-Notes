
"use client";
import React, { useState } from "react";

export default function NotesGrid({
  notes,
  onPin,
  onUnpin,
  onTrash,
  onRecover,
  onDelete,
  onEdit,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title || "");
    setEditContent(note.content || "");
  };
  const saveEdit = () => {
    if (onEdit && editingId) onEdit(editingId, { title: editTitle, content: editContent });
    setEditingId(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {notes.map((note) => {
        const isEditing = editingId === note.id;
        return (
          <div key={note.id} className="bg-white border rounded-lg shadow p-3 text-black">
            {isEditing ? (
              <>
                <input
                  className="w-full border rounded px-2 py-1 mb-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                />
                <textarea
                  className="w-full border rounded px-2 py-1 mb-2 h-24"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Write your note…"
                />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="px-3 py-1 rounded bg-green-600 text-white">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1 rounded bg-gray-500 text-white">Cancel</button>
                </div>
              </>
            ) : (
              <>
                {note.title ? <h3 className="font-semibold">{note.title}</h3> : null}
                <div className="mt-1 text-sm whitespace-pre-wrap max-h-52 overflow-y-auto">
                  {note.content}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {onPin && <button onClick={() => onPin(note.id)} className="px-3 py-1 rounded bg-yellow-500 text-white">Pin</button>}
                  {onUnpin && <button onClick={() => onUnpin(note.id)} className="px-3 py-1 rounded bg-blue-600 text-white">Unpin</button>}
                  {onTrash && <button onClick={() => onTrash(note.id)} className="px-3 py-1 rounded bg-red-500 text-white">Trash</button>}
                  {onRecover && <button onClick={() => onRecover(note.id)} className="px-3 py-1 rounded bg-indigo-600 text-white">Recover</button>}
                  {onDelete && <button onClick={() => onDelete(note.id)} className="px-3 py-1 rounded bg-red-700 text-white">Delete</button>}
                  {onEdit && <button onClick={() => startEdit(note)} className="px-3 py-1 rounded bg-green-700 text-white">Edit</button>}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
