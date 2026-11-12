"use client";

import Link from "next/link";
import { useState } from "react";
import SiteFooter from "@/components/SiteFooter";

type Role = "patient" | "doctor";

export default function LoginPage() {
  const [passcode, setPasscode] = useState("");
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
        passcode,
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
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-bold tracking-tight">CareSlot</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/register"
              className="rounded-xl bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="relative flex justify-center px-4 py-12 md:py-16">
        <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-80 w-80 rounded-full bg-violet-300/25 blur-3xl" />

        <form onSubmit={handleSubmit} className="surface relative w-full max-w-md overflow-hidden p-7 fade-up">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            Use your patient or doctor id plus the team passcode. New here?{" "}
            <Link href="/register" className="font-semibold text-[var(--accent)]">
              Create an account
            </Link>
            .
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-1">
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
                className={`rounded-lg px-3 py-3 text-left transition ${
                  role === opt.id
                    ? "bg-[var(--accent)] text-white shadow-[0_8px_18px_rgba(99,102,241,0.25)]"
                    : "text-[var(--muted)] hover:bg-white"
                }`}
              >
                <div className="text-sm font-semibold">{opt.label}</div>
                <div className={`text-[11px] ${role === opt.id ? "text-white/70" : ""}`}>{opt.hint}</div>
              </button>
            ))}
          </div>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-[var(--muted)]">
              {role === "patient" ? "Patient id" : "Doctor id"}
            </span>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value.toUpperCase())}
              className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
              placeholder={role === "patient" ? "P001" : "DR01"}
              required
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-[var(--muted)]">Team passcode</span>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
              placeholder="Passcode"
              autoFocus
              required
            />
          </label>

          {error && <p className="mt-3 text-sm text-[var(--danger)]">{error}</p>}

          <button
            type="submit"
            disabled={loading || !passcode || !userId}
            className="mt-5 w-full rounded-xl bg-[var(--accent)] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Continue"}
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-[var(--muted)]">
            Demo patient <strong>P001</strong> · demo doctor <strong>DR01</strong>. JWT claims include{" "}
            <code>role</code> and <code>userId</code>.
          </p>
        </form>
      </main>

      <SiteFooter />
    </div>
  );
}
