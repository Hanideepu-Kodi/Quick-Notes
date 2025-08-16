"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { auth } from "./lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// Reusable gradient button (inline styles, animated)
function GradButton({ children, className = "", ...props }) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:opacity-60";
  return (
    <button
      {...props}
      className={`${base} ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(to right, #9110c4ff 0%, #661e11ff 51%, #2a15a1ff 100%)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "border-box",
        transition: "background-position 0.5s ease, transform 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = "right center")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = "left center")}
    >
      {children}
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      await auth.login(email, password);
      router.push("/home");
    } catch (err) {
      const msg = String(err.message || "Login failed");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      await auth.register(email, password);
      setInfo("Registration successful. You can log in now.");
    } catch (err) {
      const msg = String(err.message || "Registration failed");
      setError(msg);
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
            Welcome
          </h1>
          <p className="mt-1 text-sm text-slate-400">Sign in or create your account</p>
        </div>

        {/* Form */}
        <form className="grid gap-4">
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
          {info && (
            <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
              {info}
            </p>
          )}

          <div className="mt-1 grid grid-cols-2 gap-3">
            <GradButton onClick={onLogin} disabled={loading}>
              <LogIn className="h-4 w-4" /> Login
            </GradButton>
            <GradButton onClick={onRegister} disabled={loading}>
              <UserPlus className="h-4 w-4" /> Register
            </GradButton>
          </div>

          <p className="text-center text-xs text-slate-400">Uses secure cookie auth—no tokens in JS.</p>
        </form>
      </div>
    </div>
  );
}