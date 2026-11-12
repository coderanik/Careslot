import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-[#f6f4f1]">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="text-xl font-extrabold tracking-tight text-[#111]">
              CARESLOT<span className="text-[#ff5a1f]">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#6b6b6b]">
              The calm, AI-powered booking home for multi-speciality clinics — Gemini tools,
              Supabase appointments, and a front desk that never sleeps.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#111]">Product</p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#6b6b6b]">
              <li>
                <Link href="/#platform" className="transition hover:text-[#111]">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#ai" className="transition hover:text-[#111]">
                  AI assistant
                </Link>
              </li>
              <li>
                <Link href="/booking" className="transition hover:text-[#111]">
                  Booking chat
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="transition hover:text-[#111]">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#111]">Company</p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#6b6b6b]">
              <li>
                <a
                  href="https://github.com/coderanik/careslot-agent"
                  className="transition hover:text-[#111]"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-[#111]">
                  Create account
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-[#111]">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/knowledge" className="transition hover:text-[#111]">
                  Knowledge
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#111]">Legal</p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#6b6b6b]">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Security</li>
              <li>Booking-only policy</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-black/5 pt-5 text-xs text-[#6b6b6b] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} CareSlot. Built for the SRM Agentic AI Hackathon.</p>
          <p>Never diagnoses. Never suggests medicine. Booking logistics only.</p>
        </div>
      </div>
    </footer>
  );
}
