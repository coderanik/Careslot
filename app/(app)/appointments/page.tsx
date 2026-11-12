"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Link from "next/link";

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
      <div className="surface flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between">
        <p className="text-sm text-[var(--muted)]">
          Everything booked for your patient account. Reschedule or cancel from the booking chat.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-1">
            {["booked", "cancelled", "all"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-lg px-3 py-2 text-sm capitalize transition ${
                  status === s
                    ? "bg-[var(--accent)] font-semibold text-white"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Link
            href="/booking"
            className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          >
<<<<<<< HEAD
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
=======
            Change via AI
          </Link>
>>>>>>> 1c981e47484ad694291124653d6ef526d7475e3c
        </div>
      </div>

      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

      <div className="space-y-3">
        {items.length === 0 && !error && (
          <div className="surface p-8 text-sm text-[var(--muted)]">No appointments in this view.</div>
        )}
        {items.map((a) => (
          <article
            key={a.id}
            className="surface flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                Appointment #{a.id}
              </p>
              <h3 className="mt-1 text-lg font-bold tracking-tight">{a.doctor_name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {a.date} · {a.start_time}
                {a.room ? ` · Room ${a.room}` : ""}
              </p>
              {a.reason && <p className="mt-2 text-sm">{a.reason}</p>}
            </div>
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                a.status === "booked"
                  ? "bg-[var(--success-soft)] text-[var(--success)]"
                  : a.status === "cancelled"
                    ? "bg-[var(--danger-soft)] text-[var(--danger)]"
                    : "bg-[var(--accent-soft)] text-[var(--accent)]"
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
