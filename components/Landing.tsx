"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SiteFooter from "@/components/SiteFooter";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const nodes = root.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

const platform = [
  {
    title: "Smart scheduling",
    desc: "Plain-English booking, free slots, and automatic writes that cut front-desk back-and-forth.",
    tone: "bg-orange-100 text-orange-600",
    icon: "📅",
  },
  {
    title: "Bookings in minutes",
    desc: "Gemini picks searchDoctors → getAvailableSlots → bookAppointment. You watch every tool.",
    tone: "bg-sky-100 text-sky-700",
    icon: "📋",
  },
  {
    title: "6 agent tools",
    desc: "Read and write tools with Zod-checked arguments — three of them update Supabase.",
    tone: "bg-violet-100 text-violet-700",
    icon: "✦",
  },
  {
    title: "Progress you can see",
    desc: "Upcoming panel refreshes the moment a write succeeds. Appointments stay honest.",
    tone: "bg-emerald-100 text-emerald-700",
    icon: "♡",
  },
  {
    title: "Safe refusals",
    desc: "Medical advice is refused with a clear reason. CareSlot is booking logistics only.",
    tone: "bg-amber-100 text-amber-700",
    icon: "💬",
  },
  {
    title: "Clinic analytics",
    desc: "Reports for appointment counts and doctors-by-department — live from your data.",
    tone: "bg-rose-100 text-rose-700",
    icon: "📊",
  },
];

const roles = [
  {
    title: "Patients",
    tone: "bg-emerald-100 text-emerald-700",
    items: ["Plain-English booking chat", "Live upcoming visits", "Register your own patient id"],
  },
  {
    title: "Front desk",
    tone: "bg-sky-100 text-sky-700",
    items: ["Today’s queue at a glance", "Book in under 30 seconds", "Tools visible for every ask"],
  },
  {
    title: "Clinic owners",
    tone: "bg-violet-100 text-violet-700",
    items: ["Reports & utilization", "Doctor directory coverage", "Knowledge Center guides"],
  },
  {
    title: "Doctors",
    tone: "bg-orange-100 text-orange-700",
    items: ["Day schedule view", "Register a clinician account", "Slots seeded for two weeks"],
  },
];

const prompts = [
  { icon: "🎙", text: "Book me with dermatology Friday morning" },
  { icon: "📈", text: "Which Tamil-speaking doctors are free tomorrow?" },
  { icon: "📄", text: "Move my appointment to the next free slot" },
  { icon: "✕", text: "What medicine should I take for this rash?" },
];

export default function Landing() {
  const rootRef = useReveal();
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={rootRef} className="landing min-h-screen">
      <header className={`landing-nav ${navScrolled ? "scrolled" : ""}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link href="/" className="text-[15px] font-extrabold tracking-[0.04em] text-[#111]">
            CARESLOT<span className="text-[#ff5a1f]">.</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-[#6b6b6b] md:flex">
            <a href="#platform" className="hover:text-[#111]">
              Platform
            </a>
            <a href="#ai" className="hover:text-[#111]">
              AI
            </a>
            <a href="#roles" className="hover:text-[#111]">
              Roles
            </a>
            <a href="#pricing" className="hover:text-[#111]">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-[#111] hover:bg-black/5"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#111] px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative px-4 pb-8 pt-12 md:px-6 md:pb-10 md:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="reveal flex justify-center">
            <div className="landing-badge">
              <strong>
                <span className="pulse-dot">✦</span> New
              </strong>
              Meet CareSlot AI — run your clinic by text →
            </div>
          </div>
          <h1 className="reveal mt-7 text-4xl font-bold tracking-[-0.04em] text-[#111] md:text-6xl md:leading-[1.05]">
            The calm, AI-powered home for multi-speciality clinics
          </h1>
          <p className="reveal mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#6b6b6b] md:text-lg">
            Schedule smarter, book in plain English, and keep every appointment honest in Supabase —
            all in one beautifully simple platform.
          </p>
          <div className="reveal mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className="landing-btn-dark">
              Create free account
              <span className="arrow">→</span>
            </Link>
            <Link href="/login" className="landing-btn-ghost">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs">
                ▶
              </span>
              Sign in to console
            </Link>
          </div>
          <div className="reveal mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[#6b6b6b]">
            {["Team passcode protected", "No credit card", "JWT roles & encrypted sessions"].map(
              (t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <span className="text-emerald-600">✓</span> {t}
                </span>
              )
            )}
          </div>
        </div>

        {/* Product preview */}
        <div className="reveal relative mx-auto mt-12 max-w-6xl float-y">
          <div className="overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_40px_100px_rgba(17,17,17,0.12)]">
            <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto flex w-full max-w-md items-center gap-2 rounded-full bg-[#f4f2ef] px-3 py-1.5 text-xs text-[#6b6b6b]">
                <span>⌕</span>
                Ask CareSlot AI or search anything…
              </div>
              <div className="hidden h-7 w-7 rounded-full bg-[#111] text-[10px] font-bold text-white sm:flex sm:items-center sm:justify-center">
                AD
              </div>
            </div>

            <div className="grid gap-3 bg-[#f7f5f2] p-3 md:grid-cols-[0.9fr_1.3fr_1fr] md:p-4">
              <div className="space-y-3">
                <div className="landing-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b6b6b]">
                    Today’s plan
                  </p>
                  <div className="mt-3 space-y-2 text-sm">
                    {[
                      ["Appointments", "5 of 8"],
                      ["Patients", "12 online"],
                      ["Agent tools", "6 ready"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <span className="text-[#6b6b6b]">{k}</span>
                        <span className="font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="landing-card overflow-hidden">
                  <div className="relative h-28 bg-gradient-to-br from-orange-200 via-rose-100 to-amber-100">
                    <div className="absolute inset-0 flex items-end p-3">
                      <p className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold">
                        Booking chat live
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 p-3 text-xs text-[#6b6b6b]">
                    <p>01 Search doctors</p>
                    <p>02 Free slots</p>
                    <p>03 Write to Supabase</p>
                  </div>
                </div>
              </div>

              <div className="landing-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b6b6b]">
                  Patient booking journey
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Sign in", "Ask agent", "Booked"].map((s, i) => (
                    <span
                      key={s}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        i === 2 ? "bg-[#111] text-white" : "bg-[#f4f2ef] text-[#6b6b6b]"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gradient-to-br from-[#1b1a19] to-[#3a2a22] p-4 text-white">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">Next visit</p>
                    <p className="mt-2 text-lg font-bold">Fri 10:00</p>
                    <p className="mt-1 text-sm text-white/70">Dr. Nisha · Dermatology</p>
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-[#faf8f5] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b6b6b]">
                      Tools used
                    </p>
                    <p className="mt-2 font-mono text-xs text-emerald-700">searchDoctors</p>
                    <p className="font-mono text-xs text-emerald-700">getAvailableSlots</p>
                    <p className="font-mono text-xs text-[#ff5a1f]">bookAppointment · writes</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="landing-card p-4">
                  <p className="text-sm font-semibold">Upcoming</p>
                  <div className="mt-3 space-y-2.5">
                    {[
                      ["Arjun Mehta", "11:00", "Skin rash"],
                      ["Revathi S.", "11:30", "Follow-up"],
                      ["Imran Khan", "12:00", "Fever"],
                    ].map(([n, t, r]) => (
                      <div key={n} className="flex items-center justify-between gap-2 text-sm">
                        <div>
                          <p className="font-medium">{n}</p>
                          <p className="text-xs text-[#6b6b6b]">{r}</p>
                        </div>
                        <span className="rounded-full bg-[#f4f2ef] px-2 py-0.5 text-xs font-semibold">
                          {t}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="landing-card p-4">
                  <p className="text-sm font-semibold">Recent patients</p>
                  <div className="mt-3 space-y-2">
                    {[
                      ["P001", "92%"],
                      ["P002", "78%"],
                      ["P004", "64%"],
                    ].map(([id, pct]) => (
                      <div key={id} className="flex items-center justify-between text-sm">
                        <span className="text-[#6b6b6b]">{id}</span>
                        <span className="font-semibold text-emerald-600">{pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-black/5 bg-white/80 px-4 py-3">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
                aria-label="Play"
              >
                ▶
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
                aria-label="Mute"
              >
                🕪
              </button>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/5">
                <div className="progress-run h-full rounded-full bg-[#ff4d6d]" style={{ width: "42%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL + STATS */}
      <section className="px-4 py-14 md:px-6 md:py-20">
        <p className="reveal text-center text-sm text-[#6b6b6b] md:text-base">
          Trusted by multi-speciality clinic teams demoing agentic booking across campuses
        </p>
        <div className="stagger mx-auto mt-8 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["6", "agent tools with Zod"],
            ["3", "Supabase write tools"],
            ["0", "hard-coded tool ifs"],
            ["12h", "JWT session window"],
          ].map(([v, l]) => (
            <div key={l} className="reveal landing-card px-5 py-7 text-center">
              <p className="text-4xl font-bold tracking-tight md:text-5xl">{v}</p>
              <p className="mt-2 text-sm text-[#6b6b6b]">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM */}
      <section id="platform" className="px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="reveal text-center">
            <span className="inline-flex rounded-full bg-[#ffe8de] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff5a1f]">
              Platform
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] md:text-5xl">
              Everything your clinic needs. Nothing it doesn’t.
            </h2>
          </div>
          <div className="stagger mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {platform.map((f) => (
              <article
                key={f.title}
                className="reveal landing-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(17,17,17,0.1)]"
              >
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-lg ${f.tone}`}
                >
                  {f.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AI DARK SECTION */}
      <section id="ai" className="px-4 py-16 md:px-6 md:py-24">
        <div className="reveal mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-gradient-to-br from-[#1a1614] via-[#241c18] to-[#3a2418] px-6 py-10 text-white shadow-[0_40px_100px_rgba(17,17,17,0.25)] md:px-10 md:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#ffb089]">
                <span className="text-[#ff5a1f]">✦</span> CareSlot AI
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-[-0.03em] md:text-5xl md:leading-[1.05]">
                Just ask. CareSlot does the rest.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65 md:text-base">
                Type in plain English. Gemini understands departments, calendars and slots — and
                always shows the tools before it writes.
              </p>
              <div className="mt-7 space-y-2.5">
                {prompts.map((p) => (
                  <div
                    key={p.text}
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 transition hover:bg-white/10"
                  >
                    <span>{p.icon}</span>
                    <span>{p.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/95 p-5 text-[#111] shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff5a1f] text-sm font-bold text-white">
                    CS
                  </div>
                  <div>
                    <p className="text-sm font-bold">CareSlot agent</p>
                    <p className="text-xs text-[#6b6b6b]">Online · Booking logistics</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs text-[#6b6b6b]">
                  <span className="rounded-full bg-[#f4f2ef] px-2 py-1">Call</span>
                  <span className="rounded-full bg-[#f4f2ef] px-2 py-1">Video</span>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-[#f4f2ef] px-4 py-3 text-sm">
                  Good morning! Book me with a dermatologist Friday morning.
                </div>
                <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-md bg-[#111] px-4 py-3 text-sm text-white">
                  Done · searchDoctors · getAvailableSlots · bookAppointment
                  <p className="mt-1 text-white/75">
                    Booked Dr. Nisha Menon · Friday 10:00 · Room 1-03.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2">
                <span className="text-[#6b6b6b]">📎</span>
                <input
                  readOnly
                  value="Write a message…"
                  className="flex-1 bg-transparent text-sm text-[#6b6b6b] outline-none"
                />
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff5a1f] text-white">
                  ↑
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="reveal text-center">
            <span className="inline-flex rounded-full bg-[#ffe8de] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff5a1f]">
              Built for every role
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] md:text-5xl">
              One platform, four happy teams.
            </h2>
          </div>
          <div className="stagger mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {roles.map((r) => (
              <article
                key={r.title}
                className="reveal landing-card p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(17,17,17,0.1)]"
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${r.tone}`}>
                  ●
                </div>
                <h3 className="mt-4 text-lg font-bold">{r.title}</h3>
                <ul className="mt-3 space-y-2.5 text-sm text-[#6b6b6b]">
                  {r.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-0.5 text-emerald-600">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="reveal text-center">
            <span className="inline-flex rounded-full bg-[#ffe8de] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff5a1f]">
              Pricing
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] md:text-5xl">
              Simple plans that grow with you.
            </h2>
          </div>
          <div className="stagger mt-10 grid gap-4 lg:grid-cols-3">
            <article className="reveal landing-card flex flex-col p-6">
              <h3 className="text-lg font-semibold">Starter</h3>
              <p className="mt-4 text-4xl font-bold tracking-tight">
                Free<span className="text-base font-medium text-[#6b6b6b]"> / hackathon</span>
              </p>
              <p className="mt-1 text-sm text-[#6b6b6b]">For solo demos</p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-[#6b6b6b]">
                {["1 patient demo id", "Booking agent chat", "Knowledge Center", "Email / team support"].map(
                  (i) => (
                    <li key={i} className="flex gap-2">
                      <span>✓</span>
                      {i}
                    </li>
                  )
                )}
              </ul>
              <Link
                href="/register"
                className="mt-8 inline-flex justify-center rounded-full bg-[#111] px-5 py-3 text-sm font-semibold text-white hover:bg-black"
              >
                Start free trial
              </Link>
            </article>

            <article className="reveal relative flex flex-col overflow-hidden rounded-[28px] bg-[#171513] p-6 text-white shadow-[0_30px_80px_rgba(17,17,17,0.25)]">
              <span className="absolute right-4 top-4 rounded-full bg-[#ff5a1f] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
                Most popular
              </span>
              <h3 className="text-lg font-semibold">Clinic</h3>
              <p className="mt-4 text-4xl font-bold tracking-tight">
                Live<span className="text-base font-medium text-white/55"> / Vercel</span>
              </p>
              <p className="mt-1 text-sm text-white/55">For growing clinics</p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-white/80">
                {[
                  "Patients & doctors register",
                  "Unlimited demo bookings",
                  "CareSlot AI assistant",
                  "Reports & doctor day view",
                ].map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#ff5a1f]">✓</span>
                    {i}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 inline-flex justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#111] hover:bg-orange-50"
              >
                Start free trial
              </Link>
            </article>

            <article className="reveal landing-card flex flex-col p-6">
              <h3 className="text-lg font-semibold">Enterprise</h3>
              <p className="mt-4 text-4xl font-bold tracking-tight">Custom</p>
              <p className="mt-1 text-sm text-[#6b6b6b]">For hospitals & chains</p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-[#6b6b6b]">
                {["Unlimited branches", "SSO & audit logs", "Dedicated success", "Custom integrations"].map(
                  (i) => (
                    <li key={i} className="flex gap-2">
                      <span>✓</span>
                      {i}
                    </li>
                  )
                )}
              </ul>
              <Link
                href="/login"
                className="mt-8 inline-flex justify-center rounded-full bg-[#111] px-5 py-3 text-sm font-semibold text-white hover:bg-black"
              >
                Talk to sales
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 pb-16 pt-6 md:px-6 md:pb-24">
        <div className="reveal mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-gradient-to-br from-[#ff7a3d] via-[#ff5a1f] to-[#e84812] px-6 py-14 text-center text-white shadow-[0_30px_80px_rgba(255,90,31,0.35)] md:px-10 md:py-20">
          <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-[-0.03em] md:text-5xl md:leading-[1.08]">
            Give your patients a better way to book care.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#111] hover:bg-orange-50"
            >
              Sign up free
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
