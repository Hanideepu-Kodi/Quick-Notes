"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StickyNote, Pin, Trash2, LogOutIcon } from "lucide-react";
import { auth } from "../lib/api"

const NavItem = ({ icon: Icon, label, onClick, href }) => {
  const Element = href ? Link : "button";
  const props = href ? { href } : { onClick };
  return (
    <Element
      {...props}
      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 text-slate-300 hover:text-white hover:bg-white/5"
    >
      <Icon className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
      <span className="text-sm font-medium">{label}</span>
    </Element>
  );
};

export default function Navbar() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (err) {
      console.error(err);
    } finally {
      router.push("/");
    }
  };
  return (
    <aside className="sticky top-0 h-dvh w-[250px] shrink-0 border-r border-white/10 bg-white/5 backdrop-blur-md">
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="flex items-center gap-2 p-4">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500" />
          <div>
            <p className="text-sm text-slate-300">Quick</p>
            <p className="text-base font-semibold">Notes</p>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex flex-col gap-1 p-2">
          <NavItem href="/home" icon={StickyNote} label="All Notes" />
          <NavItem href="/pinned" icon={Pin} label="Pinned" />
          <NavItem href="/trash" icon={Trash2} label="Trash" />
        </nav>
        <div className="mt-auto p-3 text-xs text-slate-400/80">
           <NavItem onClick={handleLogout} icon={LogOutIcon} label="Logout" />
          <p className="leading-5">Local only • Stored in your browser</p>
        </div>
      </div>
    </aside>
  );
}