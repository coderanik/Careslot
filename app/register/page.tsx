"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteFooter from "@/components/SiteFooter";

type Role = "patient" | "doctor";
type Department = { id: string; name: string };

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("patient");
  const [passcode, setPasscode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("29");
  const [city, setCity] = useState("Chennai");
  const [departmentId, setDepartmentId] = useState("");
  const [qualification, setQualification] = useState("MBBS");
  const [experience, setExperience] = useState("5");
  const [fee, setFee] = useState("500");
  const [languages, setLanguages] = useState("English, Tamil");
  const [room, setRoom] = useState("G-10");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/departments")
      .then((r) => r.json())
      .then((d) => {
        const list = d.departments ?? [];
        setDepartments(list);
        if (list[0]) setDepartmentId(list[0].id);
      })
      .catch(() => setDepartments([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body =
      role === "patient"
        ? { role, passcode, name, phone, age: Number(age), city }
        : {
            role,
            passcode,
            name,
            department_id: departmentId,
            qualification,
            experience_years: Number(experience),
            consultation_fee: Number(fee),
            languages,
            room,
          };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      window.location.href = data.user?.role === "doctor" ? "/doctor" : "/dashboard";
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Registration failed");
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
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-[var(--muted)] sm:inline">Already have an id?</span>
            <Link href="/login" className="font-semibold text-[var(--accent)] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1fr_1.1fr] md:px-6 md:py-14">
        <div className="fade-up">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
            Create account
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Sign up for CareSlot</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
            Register a new <strong>patient</strong> or <strong>doctor</strong>. We create your id in
            Supabase, sign a JWT, and drop you into the console.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
            <li className="flex gap-2">
              <span className="text-[var(--accent)]">✓</span> Patients get a P-series id for booking
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent)]">✓</span> Doctors get a DR-series id + free slots
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent)]">✓</span> Team passcode protects Gemini quota
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="surface fade-up-delay p-6 md:p-7">
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-1">
            {(
              [
                { id: "patient", label: "Patient", hint: "Book visits" },
                { id: "doctor", label: "Doctor", hint: "Day schedule" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRole(opt.id)}
                className={`rounded-lg px-3 py-3 text-left transition ${
                  role === opt.id
                    ? "bg-[var(--accent)] text-white shadow-[0_8px_18px_rgba(99,102,241,0.25)]"
                    : "text-[var(--muted)] hover:bg-white"
                }`}
              >
                <div className="text-sm font-semibold">{opt.label}</div>
                <div className={`text-[11px] ${role === opt.id ? "text-white/75" : ""}`}>{opt.hint}</div>
              </button>
            ))}
          </div>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-[var(--muted)]">Full name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
              placeholder={role === "doctor" ? "Kavitha Subramanian" : "Your name"}
            />
          </label>

          {role === "patient" ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="font-medium text-[var(--muted)]">Phone</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                  placeholder="98400 12345"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[var(--muted)]">Age</span>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--accent)]"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[var(--muted)]">City</span>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--accent)]"
                />
              </label>
            </div>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="font-medium text-[var(--muted)]">Department</span>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--accent)]"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[var(--muted)]">Qualification</span>
                <input
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--accent)]"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[var(--muted)]">Room</span>
                <input
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--accent)]"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[var(--muted)]">Experience (yrs)</span>
                <input
                  type="number"
                  min={0}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--accent)]"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[var(--muted)]">Fee (₹)</span>
                <input
                  type="number"
                  min={0}
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--accent)]"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="font-medium text-[var(--muted)]">Languages</span>
                <input
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--accent)]"
                  placeholder="English, Tamil, Hindi"
                />
              </label>
            </div>
          )}

          <label className="mt-3 block text-sm">
            <span className="font-medium text-[var(--muted)]">Team passcode</span>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
              placeholder="Passcode"
            />
          </label>

          {error && <p className="mt-3 text-sm text-[var(--danger)]">{error}</p>}

          <button
            type="submit"
            disabled={loading || !passcode || !name}
            className="mt-5 w-full rounded-xl bg-[var(--accent)] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-40"
          >
            {loading ? "Creating account…" : `Create ${role} account`}
          </button>

          <p className="mt-4 text-center text-xs text-[var(--muted)]">
            Prefer the demo?{" "}
            <Link href="/login" className="font-semibold text-[var(--accent)]">
              Sign in as P001
            </Link>
          </p>
        </form>
      </main>

      <SiteFooter />
    </div>
  );
}
