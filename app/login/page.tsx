"use client";

import Link from "next/link";
import { useState } from "react";
import SiteFooter from "@/components/SiteFooter";

type Role = "patient" | "doctor";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("patient");
  const [userId, setUserId] = useState("P001");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function switchRole(next: Role) {
    setRole(next);
    setUserId(next === "patient" ? "P001" : "DR01");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        role,
        userId,
      }),
    });
    setLoading(false);
    if (res.ok) {
      window.location.href = role === "doctor" ? "/doctor" : "/dashboard";
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed");
    }
  }

  return (
    <div className="landing min-h-screen">
      <header className="landing-nav scrolled">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="text-[15px] font-extrabold tracking-[0.04em] text-[#111]">
            CARESLOT<span className="text-[#ff5a1f]">.</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/register"
              className="rounded-full bg-[#171513] px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="relative flex justify-center px-4 py-12 md:py-16">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-rose-200/35 blur-3xl" />

        <form onSubmit={handleSubmit} className="landing-card relative w-full max-w-md overflow-hidden p-7 fade-up">
          <span className="inline-flex rounded-full bg-[#ffe8de] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff5a1f]">
            Welcome back
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[#111]">Sign in</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
            Use your patient or doctor id and password. New here?{" "}
            <Link href="/register" className="font-semibold text-[#ff5a1f]">
              Create an account
            </Link>
            .
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-full border border-black/8 bg-[#f6f4f1] p-1">
            {(
              [
                { id: "patient", label: "Patient", hint: "e.g. P001" },
                { id: "doctor", label: "Doctor", hint: "e.g. DR01" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => switchRole(opt.id)}
                className={`rounded-full px-3 py-3 text-left transition ${
                  role === opt.id
                    ? "bg-[#171513] text-white shadow-[0_8px_18px_rgba(17,17,17,0.2)]"
                    : "text-[#6b6b6b] hover:bg-white"
                }`}
              >
                <div className="text-sm font-semibold">{opt.label}</div>
                <div className={`text-[11px] ${role === opt.id ? "text-white/70" : ""}`}>{opt.hint}</div>
              </button>
            ))}
          </div>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-[#6b6b6b]">
              {role === "patient" ? "Patient id" : "Doctor id"}
            </span>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value.toUpperCase())}
              className="mt-1.5 w-full rounded-full border border-black/8 bg-[#faf8f5] px-4 py-3 outline-none transition focus:border-[#ff5a1f] focus:ring-4 focus:ring-[rgba(255,90,31,0.12)]"
              placeholder={role === "patient" ? "P001" : "DR01"}
              required
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-[#6b6b6b]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-full border border-black/8 bg-[#faf8f5] px-4 py-3 outline-none transition focus:border-[#ff5a1f] focus:ring-4 focus:ring-[rgba(255,90,31,0.12)]"
              placeholder="Enter password"
              autoFocus
              required
              minLength={6}
            />
          </label>

          {error && <p className="mt-3 text-sm text-[#dc2626]">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password || !userId}
            className="landing-btn-dark mt-5 w-full justify-center disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Continue"}
            <span className="arrow">→</span>
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-[#6b6b6b]">
            Demo: <strong>P001</strong> / <strong>DR01</strong> · password <strong>demo1234</strong>
          </p>
        </form>
      </main>

      <SiteFooter />
    </div>
  );
}
