"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  id: number;
  patient_name?: string;
  patient_phone?: string;
  patient_age?: number;
  reason?: string;
  date?: string;
  start_time?: string | null;
};

function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export default function DoctorSchedulePage() {
  const [date, setDate] = useState(todayISO());
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    fetch(`/api/appointments?date=${date}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Failed");
        setRole(data.role ?? "");
        setRows(data.appointments ?? []);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, [date]);

  const title = useMemo(() => {
    try {
      return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    } catch {
      return date;
    }
  }, [date]);

  return (
    <div className="space-y-5">
      <div className="surface flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between">
        <p className="text-sm text-[var(--muted)]">
          Stretch view · signed-in doctor’s booked appointments for {title}.
        </p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
        />
      </div>

      {role && role !== "doctor" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          You are signed in as a patient. Sign out, then choose the doctor role on the login screen
          to see this schedule.
        </div>
      )}

      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="surface p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Patients today
          </p>
          <p className="mt-2 text-3xl font-bold text-[var(--accent)]">{rows.length}</p>
        </div>
        <div className="surface p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            First slot
          </p>
          <p className="mt-2 text-3xl font-bold text-[var(--ink)]">{rows[0]?.start_time ?? "—"}</p>
        </div>
        <div className="surface p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Last slot
          </p>
          <p className="mt-2 text-3xl font-bold text-[var(--ink)]">
            {rows[rows.length - 1]?.start_time ?? "—"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {rows.length === 0 && !error && (
          <div className="surface p-8 text-sm text-[var(--muted)]">
            No booked appointments on this day.
          </div>
        )}
        {rows.map((r) => (
          <article
            key={r.id}
            className="surface grid gap-3 p-5 md:grid-cols-[100px_1fr_auto] md:items-center"
          >
            <div className="text-2xl font-bold tracking-tight text-[var(--accent)]">{r.start_time}</div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">{r.patient_name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {r.patient_age ? `${r.patient_age} yrs` : ""}
                {r.patient_phone ? ` · ${r.patient_phone}` : ""}
              </p>
              {r.reason && <p className="mt-2 text-sm">{r.reason}</p>}
            </div>
            <span className="w-fit rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold text-[var(--accent)]">
              #{r.id}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
