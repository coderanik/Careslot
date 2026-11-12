"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Tab = "all" | "guidelines" | "protocols" | "faqs";

type Resource = {
  id: string;
  title: string;
  description: string;
  kind: "Guideline" | "Protocol" | "FAQ" | "Emergency";
  tab: Tab;
  tone: string;
  icon: string;
  href?: string;
};

const featured: Resource[] = [
  {
    id: "f1",
    title: "How CareSlot booking works",
    description: "Gemini picks tools, Zod checks args, writes land in Supabase once.",
    kind: "Guideline",
    tab: "guidelines",
    tone: "from-indigo-500 to-violet-600",
    icon: "♥",
    href: "/booking",
  },
  {
    id: "f2",
    title: "Reschedule & cancel protocol",
    description: "Free the old slot, book the new one, keep the Upcoming panel in sync.",
    kind: "Protocol",
    tab: "protocols",
    tone: "from-emerald-500 to-teal-600",
    icon: "◎",
    href: "/booking",
  },
  {
    id: "f3",
    title: "When the agent must refuse",
    description: "No diagnosis, medicines, tests or treatments — booking logistics only.",
    kind: "Emergency",
    tab: "protocols",
    tone: "from-orange-500 to-rose-500",
    icon: "!",
    href: "/booking",
  },
];

const categories = [
  {
    title: "Clinic guidelines",
    desc: "Departments, languages, and who to book",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
    href: "/doctors",
  },
  {
    title: "Visit prep",
    desc: "What to bring, arrival window, rooms",
    tone: "bg-[var(--sky-soft)] text-[var(--sky)]",
    href: "/appointments",
  },
  {
    title: "Safety rules",
    desc: "Booking-only scope and refuse reasons",
    tone: "bg-[var(--teal-soft)] text-[var(--teal)]",
    href: "/booking",
  },
  {
    title: "Departments",
    desc: "Dermatology, ENT, Ortho, Dental…",
    tone: "bg-[var(--danger-soft)] text-[var(--danger)]",
    href: "/doctors",
  },
  {
    title: "Patient care desk",
    desc: "Password login and JWT roles",
    tone: "bg-[var(--accent-soft)] text-[var(--accent)]",
    href: "/reports",
  },
  {
    title: "System & docs",
    desc: "Tools table, schema, demo prompts",
    tone: "bg-[var(--warning-soft)] text-[var(--warning)]",
    href: "/reports",
  },
];

const faqs = [
  {
    q: "Can the agent prescribe medicine?",
    a: "No. CareSlot refuses medical advice and offers to book the right department instead.",
  },
  {
    q: "Who gets booked?",
    a: "Demo patient P001 Arjun Mehta. Write tools always use the JWT patient id.",
  },
  {
    q: "What if a slot is already taken?",
    a: "The write tool fails clearly; the agent apologises and offers another free slot.",
  },
  {
    q: "Where do I see tool calls?",
    a: "Under each assistant reply in Booking — tool name, args, and write badge.",
  },
];

export default function KnowledgePage() {
  const [tab, setTab] = useState<Tab>("all");
  const [category, setCategory] = useState("all");

  const visibleFeatured = useMemo(() => {
    if (tab === "all") return featured;
    if (tab === "faqs") return [];
    return featured.filter((f) => f.tab === tab || (tab === "guidelines" && f.kind === "Guideline"));
  }, [tab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All resources"],
              ["guidelines", "Guidelines"],
              ["protocols", "Protocols"],
              ["faqs", "FAQs"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                tab === id
                  ? "bg-[var(--accent)] text-white shadow-[0_8px_18px_rgba(99,102,241,0.25)]"
                  : "border border-[var(--line)] bg-white text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            <option value="all">All categories</option>
            <option value="clinic">Clinic</option>
            <option value="safety">Safety</option>
            <option value="system">System</option>
          </select>
          <select className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]">
            <option>Last 30 days</option>
            <option>This week</option>
            <option>All time</option>
          </select>
        </div>
      </div>

      {tab !== "faqs" && (
        <section>
          <h2 className="mb-3 text-lg font-bold tracking-tight">Featured resources</h2>
          <div className="grid gap-3 lg:grid-cols-3">
            {visibleFeatured.map((r) => (
              <Link
                key={r.id}
                href={r.href ?? "/booking"}
                className={`surface-hover relative overflow-hidden rounded-[20px] bg-gradient-to-br ${r.tone} p-5 text-white shadow-[var(--shadow)]`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">
                    {r.kind}
                  </span>
                  <span className="text-lg opacity-80">{r.icon}</span>
                </div>
                <h3 className="mt-8 text-lg font-bold tracking-tight">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{r.description}</p>
                <span className="mt-5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {tab !== "faqs" && (
        <section>
          <h2 className="mb-3 text-lg font-bold tracking-tight">Browse by category</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {categories
              .filter((c) => {
                if (category === "all") return true;
                if (category === "clinic") return /clinic|department|visit|patient/i.test(c.title + c.desc);
                if (category === "safety") return /safety|rule/i.test(c.title + c.desc);
                if (category === "system") return /system|doc/i.test(c.title + c.desc);
                return true;
              })
              .map((c) => (
                <Link key={c.title} href={c.href} className="surface surface-hover flex items-center gap-4 p-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${c.tone}`}>
                    {c.title.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold tracking-tight">{c.title}</h3>
                    <p className="mt-0.5 text-sm text-[var(--muted)]">{c.desc}</p>
                  </div>
                  <span className="text-[var(--muted)]">›</span>
                </Link>
              ))}
          </div>
        </section>
      )}

      {(tab === "all" || tab === "faqs") && (
        <section className="surface p-5">
          <h2 className="text-lg font-bold tracking-tight">FAQs</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Operational answers — not medical advice.</p>
          <div className="mt-4 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 open:bg-white"
              >
                <summary className="cursor-pointer list-none font-semibold tracking-tight">{f.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
