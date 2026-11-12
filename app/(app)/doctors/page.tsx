"use client";

import { useEffect, useMemo, useState } from "react";

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
      <div className="glass panel p-5">
        <h2
          className="text-2xl font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Doctors
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Browse specialties, languages and fees before you ask the agent to book.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or qualification"
            className="rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          />
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
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
            className="rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
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

      <div className="grid gap-3 sm:grid-cols-2">
        {doctors.map((d) => (
          <article
            key={d.id}
            className="glass panel p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  {deptName(d) ?? d.department_id}
                </p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">{d.name}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{d.qualification}</p>
              </div>
              <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs text-[var(--muted)]">
                {d.id}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
              <span className="rounded-full bg-white/70 px-2.5 py-1">{d.experience_years} yrs</span>
              <span className="rounded-full bg-white/70 px-2.5 py-1">₹{d.consultation_fee}</span>
              <span className="rounded-full bg-white/70 px-2.5 py-1">Room {d.room}</span>
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">{d.languages?.join(" · ")}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
