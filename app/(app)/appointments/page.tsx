"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Appointment = {
  id: number;
  doctor_id: string;
  doctor_name?: string;
  room?: string;
  reason?: string;
  status: string;
  date?: string;
  start_time?: string | null;
};

export default function AppointmentsPage() {
  const [status, setStatus] = useState("booked");
  const [items, setItems] = useState<Appointment[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    function loadAppointments() {
      fetch(`/api/appointments?status=${status}`)
        .then(async (r) => {
          const data = await r.json();
          if (!r.ok) throw new Error(data.error ?? "Failed");
          if (!cancelled) {
            setItems(data.appointments ?? []);
            setError("");
          }
        })
        .catch((err) => {
          if (!cancelled) setError(err instanceof Error ? err.message : "Failed");
        });
    }

    loadAppointments();

    function onVisibilityOrFocus() {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        loadAppointments();
      }
    }

    function onStorage(e: StorageEvent) {
      if (e.key === "careslot_appointments_updated") {
        loadAppointments();
      }
    }

    window.addEventListener("appointments-changed", loadAppointments);
    window.addEventListener("visibilitychange", onVisibilityOrFocus);
    window.addEventListener("focus", onVisibilityOrFocus);
    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      window.removeEventListener("appointments-changed", loadAppointments);
      window.removeEventListener("visibilitychange", onVisibilityOrFocus);
      window.removeEventListener("focus", onVisibilityOrFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, [status]);

  return (
    <div className="space-y-5">
      <div className="glass panel flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2
            className="text-2xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            My Appointments
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Everything booked for Arjun Mehta. Reschedule or cancel from the{" "}
            <Link href="/" className="font-medium text-[var(--accent)] underline hover:opacity-80">
              booking chat
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-1 rounded-2xl border border-[var(--line)] bg-white/60 p-1">
          {["booked", "cancelled", "all"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-xl px-3 py-2 text-sm capitalize transition ${
                status === s
                  ? "bg-[var(--ink)] text-white"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

      <div className="space-y-3">
        {items.length === 0 && !error && (
          <div className="glass panel p-8 text-sm text-[var(--muted)]">No appointments in this view.</div>
        )}
        {items.map((a) => (
          <article key={a.id} className="glass panel flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Appointment #{a.id}
              </p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight">{a.doctor_name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {a.date} · {a.start_time}
                {a.room ? ` · Room ${a.room}` : ""}
              </p>
              {a.reason && <p className="mt-2 text-sm">{a.reason}</p>}
            </div>
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                a.status === "booked"
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : a.status === "cancelled"
                    ? "bg-red-50 text-[var(--danger)]"
                    : "bg-white text-[var(--muted)]"
              }`}
            >
              {a.status}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
