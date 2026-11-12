"use client";

import { useState } from "react";

type Role = "patient" | "doctor";

export default function LoginPage() {
  const [passcode, setPasscode] = useState("123456");
  const [role, setRole] = useState<Role>("patient");
  const [doctorId, setDoctorId] = useState("DR01");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        doctorId: role === "doctor" ? doctorId : undefined,
      }),
    });
    setLoading(false);
    if (res.ok) {
      window.location.href = role === "doctor" ? "/doctor" : "/";
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-[rgba(0,113,227,0.18)] blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-[rgba(140,180,220,0.25)] blur-3xl" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass panel relative w-full max-w-md overflow-hidden p-7 fade-up"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          CareSlot access
        </p>
        <h1
          className="mt-2 text-3xl font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sign in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Team passcode unlocks the app. A signed JWT then carries your role — patient or doctor.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-[var(--line)] bg-white/50 p-1">
          {(
            [
              { id: "patient", label: "Patient", hint: "Arjun Mehta" },
              { id: "doctor", label: "Doctor", hint: "Day view" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setRole(opt.id)}
              className={`rounded-xl px-3 py-3 text-left transition ${
                role === opt.id
                  ? "bg-[var(--ink)] text-white shadow-sm"
                  : "text-[var(--muted)] hover:bg-white/80"
              }`}
            >
              <div className="text-sm font-medium">{opt.label}</div>
              <div className={`text-[11px] ${role === opt.id ? "text-white/70" : ""}`}>{opt.hint}</div>
            </button>
          ))}
        </div>

        {role === "doctor" && (
          <label className="mt-4 block text-sm">
            <span className="text-[var(--muted)]">Doctor id</span>
            <input
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value.toUpperCase())}
              className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
              placeholder="DR01"
            />
          </label>
        )}

        <label className="mt-4 block text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted)]">Team passcode</span>
            <span className="text-xs text-[var(--muted)]">Demo: <code>123456</code></span>
          </div>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
            placeholder="123456"
            autoFocus
          />
        </label>

        {error && <p className="mt-3 text-sm text-[var(--danger)]">{error}</p>}

        <button
          type="submit"
          disabled={loading || !passcode}
          className="mt-5 w-full rounded-2xl bg-[var(--accent)] px-4 py-3.5 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-40"
        >
          {loading ? "Signing in…" : "Continue"}
        </button>

        <p className="mt-4 text-center text-xs leading-relaxed text-[var(--muted)]">
          Demo patient is always <strong>P001 Arjun Mehta</strong>. JWT claims include{" "}
          <code>role</code> and <code>userId</code>.
        </p>
      </form>
    </main>
  );
}
