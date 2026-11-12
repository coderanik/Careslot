"use client";

import { useEffect, useState } from "react";

type Appointment = {
  id: number;
  doctor_name?: string;
  room?: string;
  date?: string;
  start_time?: string | null;
  reason?: string;
  status: string;
};

export default function UpcomingPanel({ refreshKey }: { refreshKey: number }) {
  const [items, setItems] = useState<Appointment[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    function loadAppointments() {
      fetch("/api/appointments?status=booked")
        .then(async (r) => {
          const data = await r.json();
          if (!r.ok) throw new Error(data.error ?? "Failed to load");
          if (!cancelled) setItems(data.appointments ?? []);
        })
        .catch((err) => {
          if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
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
  }, [refreshKey]);

  return (
    <aside className="surface flex h-[min(74vh,720px)] flex-col overflow-hidden">
      <div className="border-b border-[var(--line)] px-5 py-4">
        <h2 className="text-base font-bold tracking-tight">Upcoming</h2>
        <p className="mt-0.5 text-xs text-[var(--muted)]">Live from Supabase · your account</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-[var(--bg)]/40 p-4">
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        {!error && items.length === 0 && (
          <p className="rounded-xl border border-dashed border-[var(--line)] bg-white px-4 py-6 text-sm text-[var(--muted)]">
            No booked visits yet. Ask the agent to schedule one.
          </p>
        )}
        {items.map((a) => (
          <article
            key={a.id}
            className="rounded-xl border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold tracking-tight">{a.doctor_name ?? "Doctor"}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {a.date} · {a.start_time}
                  {a.room ? ` · Room ${a.room}` : ""}
                </p>
              </div>
              <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
                #{a.id}
              </span>
            </div>
            {a.reason && <p className="mt-3 text-sm text-[var(--muted)]">{a.reason}</p>}
          </article>
        ))}
      </div>
    </aside>
  );
}
