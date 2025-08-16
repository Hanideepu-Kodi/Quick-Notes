"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }
    // Fake auth – keep logic minimal and local only
    try {
      setLoading(true);
      // optionally validate shape
      localStorage.setItem("auth", JSON.stringify({ email, ts: Date.now() }));
      router.push("/home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-lg">
        {/* Heading */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500" />
          <h1 className="bg-gradient-to-br from-cyan-300 to-indigo-400 bg-clip-text text-2xl font-extrabold text-transparent">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to continue to Quick Notes</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="grid gap-4">
          <label className="grid gap-1 text-sm">
            <span className="text-slate-300">Email</span>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-400/40">
              <Mail className="h-4 w-4 text-slate-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm placeholder:text-slate-400 outline-none"
                autoComplete="email"
              />
            </div>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-slate-300">Password</span>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-400/40">
              <Lock className="h-4 w-4 text-slate-300" />
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm placeholder:text-slate-400 outline-none"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="rounded-lg p-1 text-slate-300 hover:bg-white/10"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-md transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <p className="text-center text-xs text-slate-400">This demo stores a simple auth flag in your browser.</p>
        </form>
      </div>
    </div>
  );
}