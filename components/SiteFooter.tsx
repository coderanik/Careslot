import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">CareSlot</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
            The clinic booking agent for multi-speciality care. Plain English in, Gemini tools out,
            appointments on Supabase.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/register"
              className="rounded-xl bg-[var(--accent)] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[var(--accent-strong)]"
            >
              Start free
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-[var(--line)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Product</p>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
            <li>
              <Link href="/#features" className="hover:text-[var(--ink)]">
                Features
              </Link>
            </li>
            <li>
              <Link href="/#how" className="hover:text-[var(--ink)]">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/booking" className="hover:text-[var(--ink)]">
                Booking agent
              </Link>
            </li>
            <li>
              <Link href="/knowledge" className="hover:text-[var(--ink)]">
                Knowledge Center
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Company</p>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
            <li>
              <a href="https://github.com/coderanik/careslot-agent" className="hover:text-[var(--ink)]">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://careslot-agent.vercel.app" className="hover:text-[var(--ink)]">
                Live demo
              </a>
            </li>
            <li>
              <Link href="/register" className="hover:text-[var(--ink)]">
                Create account
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-[var(--ink)]">
                Clinician login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Stack</p>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
            <li>Next.js · Vercel</li>
            <li>Gemini function calling</li>
            <li>Supabase · Zod</li>
            <li>JWT role sessions</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-[var(--muted)] md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} CareSlot. Built for the SRM Agentic AI Hackathon.</p>
          <p>Booking logistics only — never medical advice.</p>
        </div>
      </div>
    </footer>
  );
}
