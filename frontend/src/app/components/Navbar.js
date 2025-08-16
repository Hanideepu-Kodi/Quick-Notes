"use client";
import React from "react";
import Link from "next/link";
import { FaHome, FaThumbtack, FaTrash, FaBars } from "react-icons/fa";

export default function Navbar({ expanded, toggle }) {
  return (
    <div
      className={`bg-white shadow-md h-screen p-4 transition-all duration-300 flex flex-col
        ${expanded ? "w-48" : "w-16"}`}
    >
      <button
        className="text-gray-700 text-xl mb-6 focus:outline-none"
        onClick={toggle}
      >
        <FaBars />
      </button>

      <nav className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-3 text-gray-700 hover:text-blue-500">
          <FaHome />
          {expanded && <span>Home</span>}
        </Link>
        <Link href="/pinned" className="flex items-center gap-3 text-gray-700 hover:text-blue-500">
          <FaThumbtack />
          {expanded && <span>Pinned</span>}
        </Link>
        <Link href="/trash" className="flex items-center gap-3 text-gray-700 hover:text-blue-500">
          <FaTrash />
          {expanded && <span>Trash</span>}
        </Link>
      </nav>
    </div>
  );
}
