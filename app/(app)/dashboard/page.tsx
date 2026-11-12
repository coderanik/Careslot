"use client";

import Link from "next/link";
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

const quickActions = [
  {
    href: "/booking",
    title: "Book with AI",
    desc: "Ask in plain English — Gemini picks the tools.",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
  },
  {
    href: "/doctors",
    title: "Find a doctor",
    desc: "Filter by department, language and fee.",
    tone: "bg-[var(--sky-soft)] text-[var(--sky)]",
  },
  {
    href: "/appointments",
    title: "Manage visits",
    desc: "See booked and cancelled appointments.",
    tone: "bg-[var(--teal-soft)] text-[var(--teal)]",
  },
  {
    href: "/knowledge",
    title: "Knowledge Center",
    desc: "Guides, booking protocols and visit FAQs.",
    tone: "bg-[var(--warning-soft)] text-[var(--warning)]",
  },
];

export default function DashboardPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/appointments?status=booked").then((r) => r.json()),
      fetch("/api/doctors").then((r) => r.json()),
    ])
      .then(([apps, docs]) => {
        if (apps.error) throw new Error(apps.error);
        if (docs.error) throw new Error(docs.error);
        setItems(apps.appointments ?? []);
        setDoctorCount((docs.doctors ?? []).length);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, []);

  const next = items[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Upcoming visits", value: String(items.length), hint: "Booked for you" },
          { label: "Doctors online", value: String(doctorCount), hint: "In directory" },
          { label: "Next visit", value: next?.start_time ?? "—", hint: next?.date ?? "None booked" },
          { label: "Agent tools", value: "6", hint: "3 write to Supabase" },
        ].map((card) => (
          <div key={card.label} className="surface p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--ink)] md:text-4xl">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">{card.hint}</p>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Quick actions</h2>
            <p className="text-sm text-[var(--muted)]">Jump into the flows judges will demo.</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((a) => (
            <Link key={a.href} href={a.href} className="surface surface-hover p-5">
              <div className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${a.tone}`}>
                Open
              </div>
              <h3 className="text-base font-semibold tracking-tight">{a.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{a.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="surface p-5 lg:col-span-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold tracking-tight">Upcoming appointments</h2>
            <Link href="/appointments" className="text-sm font-semibold text-[var(--accent)]">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {items.length === 0 && (
              <p className="rounded-2xl bg-[var(--bg)] px-4 py-6 text-sm text-[var(--muted)]">
                No booked visits yet. Open Booking and ask the agent to schedule one.
              </p>
            )}
            {items.slice(0, 4).map((a) => (
              <article
                key={a.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3"
              >
                <div>
                  <p className="font-semibold tracking-tight">{a.doctor_name ?? "Doctor"}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {a.date} · {a.start_time}
                    {a.room ? ` · Room ${a.room}` : ""}
                  </p>
                  {a.reason && <p className="mt-2 text-sm text-[var(--muted)]">{a.reason}</p>}
                </div>
                <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
                  #{a.id}
                </span>
              </article>
            ))}
          </div>
        </div>

        <div className="surface overflow-hidden lg:col-span-2">
          <div className="bg-gradient-to-br from-[#ff7a3d] via-[#ff5a1f] to-[#e84812] px-5 py-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Demo tip</p>
            <h3 className="mt-2 text-xl font-bold tracking-tight">Show the agent loop</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/90">
              Try a booking prompt, then the medical-advice refusal. Tool names appear under each
              reply.
            </p>
          </div>
          <div className="space-y-2 p-4">
            {[
              "I have a skin rash, book me Friday morning.",
              "Which Tamil-speaking doctors are free tomorrow?",
              "What medicine should I take for this rash?",
            ].map((prompt) => (
              <Link
                key={prompt}
                href="/booking"
                className="block rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--ink)] transition hover:border-[var(--accent)] hover:bg-white"
              >
                {prompt}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
