"use client";

import { useEffect, useMemo, useState } from "react";

type Appointment = {
  id: number;
  doctor_name?: string;
  status: string;
  date?: string;
  reason?: string;
};

type Doctor = {
  id: string;
  name: string;
  department_id: string;
  departments?: { id: string; name: string } | { id: string; name: string }[] | null;
};

export default function ReportsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/appointments?status=all").then((r) => r.json()),
      fetch("/api/doctors").then((r) => r.json()),
    ])
      .then(([apps, docs]) => {
        if (apps.error) throw new Error(apps.error);
        if (docs.error) throw new Error(docs.error);
        setAppointments(apps.appointments ?? []);
        setDoctors(docs.doctors ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, []);

  const booked = appointments.filter((a) => a.status === "booked").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

  const byDept = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of doctors) {
      const name = Array.isArray(d.departments)
        ? d.departments[0]?.name
        : d.departments?.name;
      const key = name ?? d.department_id;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [doctors]);

  const maxDept = Math.max(1, ...byDept.map(([, n]) => n));

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total appointments", value: appointments.length, tone: "text-[var(--accent)]" },
          { label: "Booked", value: booked, tone: "text-[var(--success)]" },
          { label: "Cancelled", value: cancelled, tone: "text-[var(--danger)]" },
          { label: "Doctors listed", value: doctors.length, tone: "text-[var(--sky)]" },
        ].map((c) => (
          <div key={c.label} className="surface p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {c.label}
            </p>
            <p className={`mt-2 text-3xl font-bold tracking-tight ${c.tone}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="text-lg font-bold tracking-tight">Doctors by department</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Directory coverage across specialties.</p>
          <div className="mt-5 space-y-3">
            {byDept.map(([name, count]) => (
              <div key={name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{name}</span>
                  <span className="text-[var(--muted)]">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--bg)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${(count / maxDept) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {byDept.length === 0 && (
              <p className="text-sm text-[var(--muted)]">No doctor data yet.</p>
            )}
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="text-lg font-bold tracking-tight">Recent appointment activity</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Latest rows from Supabase.</p>
          <div className="mt-4 space-y-2">
            {appointments.slice(0, 8).map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{a.doctor_name ?? "Doctor"}</p>
                  <p className="text-xs text-[var(--muted)]">
                    #{a.id} · {a.date ?? "—"} · {a.reason ?? "visit"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    a.status === "booked"
                      ? "bg-[var(--success-soft)] text-[var(--success)]"
                      : a.status === "cancelled"
                        ? "bg-[var(--danger-soft)] text-[var(--danger)]"
                        : "bg-[var(--accent-soft)] text-[var(--accent)]"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
            {appointments.length === 0 && (
              <p className="text-sm text-[var(--muted)]">No appointments to chart yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
