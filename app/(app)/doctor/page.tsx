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
    let cancelled = false;

    function loadSchedule() {
      fetch(`/api/appointments?date=${date}`)
        .then(async (r) => {
          const data = await r.json();
          if (!r.ok) throw new Error(data.error ?? "Failed");
          if (!cancelled) {
            setRole(data.role ?? "");
            setRows(data.appointments ?? []);
            setError("");
          }
        })
        .catch((err) => {
          if (!cancelled) setError(err instanceof Error ? err.message : "Failed");
        });
    }

    loadSchedule();

    function onVisibilityOrFocus() {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        loadSchedule();
      }
    }

    function onStorage(e: StorageEvent) {
      if (e.key === "careslot_appointments_updated") {
        loadSchedule();
      }
    }

    window.addEventListener("appointments-changed", loadSchedule);
    window.addEventListener("visibilitychange", onVisibilityOrFocus);
    window.addEventListener("focus", onVisibilityOrFocus);
    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      window.removeEventListener("appointments-changed", loadSchedule);
      window.removeEventListener("visibilitychange", onVisibilityOrFocus);
      window.removeEventListener("focus", onVisibilityOrFocus);
      window.removeEventListener("storage", onStorage);
    };
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
      <div className="glass panel flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2
            className="text-2xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Doctor’s day
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Stretch view · signed-in doctor’s booked appointments for {title}.
          </p>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
        />
      </div>

      {role && role !== "doctor" && (
        <div className="glass panel border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900">
          You are signed in as a patient. Open Sign out, then choose the doctor role on the login
          screen to see this schedule.
        </div>
      )}

      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

      <div className="space-y-3">
        {rows.length === 0 && !error && (
          <div className="glass panel p-8 text-sm text-[var(--muted)]">
            No booked appointments on this day.
          </div>
        )}
        {rows.map((r) => (
          <article
            key={r.id}
            className="glass panel grid gap-3 p-5 md:grid-cols-[100px_1fr_auto] md:items-center"
          >
            <div className="text-2xl font-semibold tracking-tight text-[var(--accent)]">
              {r.start_time}
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">{r.patient_name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {r.patient_age ? `${r.patient_age} yrs` : ""}
                {r.patient_phone ? ` · ${r.patient_phone}` : ""}
              </p>
              {r.reason && <p className="mt-2 text-sm">{r.reason}</p>}
            </div>
            <span className="w-fit rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
              #{r.id}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
