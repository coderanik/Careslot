"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Doctor = {
  id: string;
  name: string;
  department_id: string;
  qualification: string;
  experience_years: number;
  consultation_fee: number;
  languages: string[];
  room: string;
  departments?: { id: string; name: string } | { id: string; name: string }[] | null;
};

type Department = { id: string; name: string; common_issues: string };

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [language, setLanguage] = useState("");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (departmentId) params.set("department_id", departmentId);
    if (language) params.set("language", language);
    if (q) params.set("q", q);
    fetch(`/api/doctors?${params}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Failed");
        setDoctors(data.doctors ?? []);
        setDepartments(data.departments ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, [departmentId, language, q]);

  const languages = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach((d) => d.languages?.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [doctors]);

  function deptName(d: Doctor) {
    if (Array.isArray(d.departments)) return d.departments[0]?.name;
    return d.departments?.name;
  }

  return (
    <div className="space-y-5">
      <div className="surface p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-[var(--muted)]">
              Browse specialties, languages and fees before you ask the agent to book.
            </p>
          </div>
          <Link
            href="/booking"
            className="inline-flex rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          >
            Book with AI
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or qualification"
            className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
          />
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          >
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          >
            <option value="">Any language</option>
            {["Tamil", "Hindi", "English", "Malayalam", "Telugu", "Kannada", "Marathi", "Urdu"].map(
              (l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              )
            )}
            {languages
              .filter(
                (l) =>
                  !["Tamil", "Hindi", "English", "Malayalam", "Telugu", "Kannada", "Marathi", "Urdu"].includes(
                    l
                  )
              )
              .map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {doctors.map((d) => (
          <article key={d.id} className="surface surface-hover p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
                  {deptName(d) ?? d.department_id}
                </p>
                <h3 className="mt-1 text-lg font-bold tracking-tight">{d.name}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{d.qualification}</p>
              </div>
              <span className="rounded-full bg-[var(--bg)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">
                {d.id}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 font-medium text-[var(--accent)]">
                {d.experience_years} yrs
              </span>
              <span className="rounded-full bg-[var(--teal-soft)] px-2.5 py-1 font-medium text-[var(--teal)]">
                ₹{d.consultation_fee}
              </span>
              <span className="rounded-full bg-[var(--sky-soft)] px-2.5 py-1 font-medium text-[var(--sky)]">
                Room {d.room}
              </span>
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">{d.languages?.join(" · ")}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
