
"use client";
import React from "react";

export default function NoteCard({
  note,
  onPin,
  onUnpin,
  onDelete,
  onRecover,
  onMoveToTrash
}) {
  return (
    <div className="note-card" style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "10px",
      backgroundColor: "#fff",
      color: "#000", // black text
      maxHeight: "200px",
      overflowY: "auto"
    }}>
      <h3>{note.title}</h3>
      <p>{note.content}</p>

      <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {onPin && <button onClick={() => onPin(note.id)}>📌 Pin</button>}
        {onUnpin && <button onClick={() => onUnpin(note.id)}>📍 Unpin</button>}
        {onMoveToTrash && <button onClick={() => onMoveToTrash(note.id)}>🗑️ Move to Trash</button>}
        {onDelete && <button onClick={() => onDelete(note.id)}>❌ Delete Permanently</button>}
        {onRecover && <button onClick={() => onRecover(note.id)}>♻️ Recover</button>}
      </div>
    </div>
  );
}
