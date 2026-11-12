"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Me = { role: "patient" | "doctor"; userId: string; name: string };

const patientNav = [
  { href: "/", label: "Booking" },
  { href: "/doctors", label: "Doctors" },
  { href: "/appointments", label: "My Appointments" },
];

const doctorNav = [{ href: "/doctor", label: "Today’s schedule" }];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const nav = user?.role === "doctor" ? doctorNav : patientNav;

  return (
    <div className="relative mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pt-8">
      <header className="fade-up mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Multi-speciality clinic
          </p>
          <Link href={user?.role === "doctor" ? "/doctor" : "/"} className="group mt-1 block">
            <h1
              className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              CareSlot
            </h1>
          </Link>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--muted)]">
            Say what you need. We find the department, free slots, and handle the booking.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <nav className="glass panel flex flex-wrap gap-1 p-1.5">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[16px] px-3.5 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[var(--ink)] text-[#ffffff] shadow-sm"
                      : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--ink)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 text-sm">
            {user && (
              <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-[var(--accent)]">
                <span className="font-medium">{user.name}</span>
                <span className="mx-1.5 opacity-40">·</span>
                <span className="uppercase tracking-wide opacity-80">{user.role}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="fade-up-delay">{children}</div>
    </div>
  );
}
