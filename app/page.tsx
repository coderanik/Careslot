import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const features = [
  {
    title: "AI booking chat",
    desc: "Patients ask in plain English. Gemini picks the tools — you see every call.",
  },
  {
    title: "Patient & doctor accounts",
    desc: "Register a new patient or clinician, then sign in with your id and team passcode.",
  },
  {
    title: "Live Supabase writes",
    desc: "Book, reschedule, and cancel update slots and appointments instantly on screen.",
  },
  {
    title: "Knowledge + reports",
    desc: "Clinic guides, safety FAQs, and live counts in a clean clinical console.",
  },
];

const steps = [
  { n: "01", title: "Create an account", desc: "Sign up as a patient or doctor — we mint your CareSlot id." },
  { n: "02", title: "Sign in securely", desc: "Team passcode + JWT session with role and userId claims." },
  { n: "03", title: "Book with the agent", desc: "Ask for a slot. Tools write to Supabase. Upcoming updates live." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-[0_8px_20px_rgba(99,102,241,0.35)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight">CareSlot</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--muted)] md:flex">
            <a href="#features" className="hover:text-[var(--ink)]">
              Features
            </a>
            <a href="#how" className="hover:text-[var(--ink)]">
              How it works
            </a>
            <a href="#cta" className="hover:text-[var(--ink)]">
              Get started
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-xl px-3.5 py-2 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--bg)]"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(99,102,241,0.28)] hover:bg-[var(--accent-strong)]"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-300/35 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 top-24 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 md:grid-cols-2 md:items-center md:px-6 md:pb-24 md:pt-20">
            <div className="fade-up">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
                Clinic booking agent
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--ink)] md:text-5xl md:leading-[1.08]">
                Book care in plain English.
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--muted)] md:text-lg">
                CareSlot is the multi-speciality front desk that never sleeps — Gemini chooses the
                tools, Zod checks the args, and appointments land in Supabase.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(99,102,241,0.3)] hover:bg-[var(--accent-strong)]"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
                >
                  Sign in
                </Link>
              </div>
              <p className="mt-4 text-xs text-[var(--muted)]">
                New here? Register as a <strong>patient</strong> or <strong>doctor</strong>. Demo
                accounts still work — try patient <code>P001</code>.
              </p>
            </div>

            <div className="fade-up-delay surface relative overflow-hidden p-5 md:p-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-400" />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                Live agent preview
              </p>
              <div className="mt-4 space-y-3">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[var(--accent)] px-4 py-2.5 text-sm text-white">
                  I have a skin rash — book me Friday morning.
                </div>
                <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm">
                  <p className="text-[11px] font-semibold text-[var(--success)]">
                    Done · searchDoctors · getAvailableSlots · bookAppointment
                  </p>
                  <p className="mt-1.5 text-[var(--ink)]">
                    Booked Dr. Nisha Menon (Dermatology) Friday 10:00 · Room 1-03.
                  </p>
                </div>
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[var(--accent)] px-4 py-2.5 text-sm text-white">
                  What medicine should I take?
                </div>
                <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-[var(--line)] bg-white px-4 py-2.5 text-sm">
                  <p className="text-[11px] font-semibold text-[var(--danger)]">
                    Failed · refuseRequest
                  </p>
                  <p className="mt-1.5 text-[var(--ink)]">
                    I can’t suggest medicine — that breaks CareSlot’s booking-only rule. Want to book
                    dermatology instead?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-[var(--line)] bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
                Features
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Everything a modern clinic desk needs.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {features.map((f) => (
                <article key={f.title} className="surface surface-hover p-5">
                  <h3 className="text-lg font-bold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
                How it works
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Three steps from landing to booked slot.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((s) => (
                <article key={s.n} className="surface p-5">
                  <p className="text-sm font-bold text-[var(--accent)]">{s.n}</p>
                  <h3 className="mt-3 text-lg font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="pb-16 md:pb-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="overflow-hidden rounded-[24px] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-8 text-white shadow-[var(--shadow)] md:p-12">
              <h2 className="max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
                Ready to open the clinic console?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
                Create a patient or doctor account, or sign in with an existing id. Team passcode
                protects Gemini quota for everyone.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  Sign up free
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
