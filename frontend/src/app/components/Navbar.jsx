"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-64 bg-gray-100 p-4 min-h-screen shadow-md">
      <h2 className="text-xl font-bold mb-6">Quick Notes</h2>
      <ul className="space-y-4">
        <li>
          <Link href="/" className="hover:text-blue-500">
            Home
          </Link>
        </li>
        <li>
          <Link href="/pinned" className="hover:text-blue-500">
            Pinned Notes
          </Link>
        </li>
        <li>
          <Link href="/trash" className="hover:text-blue-500">
            Trash
          </Link>
        </li>
      </ul>
    </div>
  );
}
