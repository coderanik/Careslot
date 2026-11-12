"use client";

import Link from "next/link";
<<<<<<< HEAD
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useChat } from "@/components/ChatContext";
=======
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
>>>>>>> 1c981e47484ad694291124653d6ef526d7475e3c

type Me = { role: "patient" | "doctor"; userId: string; name: string };

type NavItem = { href: string; label: string; icon: string };

const patientNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/booking", label: "Booking", icon: "chat" },
  { href: "/doctors", label: "Doctors", icon: "users" },
  { href: "/appointments", label: "Appointments", icon: "calendar" },
  { href: "/knowledge", label: "Knowledge", icon: "book" },
  { href: "/reports", label: "Reports", icon: "chart" },
];

const doctorNav: NavItem[] = [
  { href: "/doctor", label: "Schedule", icon: "calendar" },
  { href: "/knowledge", label: "Knowledge", icon: "book" },
  { href: "/reports", label: "Reports", icon: "chart" },
];

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Your clinic overview, upcoming visits, and quick actions.",
  },
  "/booking": {
    title: "Booking assistant",
    subtitle: "Plain English in. Gemini picks the tools. You see every call.",
  },
  "/doctors": {
    title: "Doctors directory",
    subtitle: "Browse specialties, languages, rooms and fees.",
  },
  "/appointments": {
    title: "My appointments",
    subtitle: "Everything booked for your patient profile.",
  },
  "/knowledge": {
    title: "Knowledge Center",
    subtitle: "Clinic guides, booking protocols, and visit FAQs.",
  },
  "/reports": {
    title: "Reports",
    subtitle: "Live counts from your Supabase clinic data.",
  },
  "/doctor": {
    title: "Today’s schedule",
    subtitle: "Signed-in doctor’s booked appointments for the day.",
  },
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<Me | null>(null);
<<<<<<< HEAD
  const { messages } = useChat();
=======
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
>>>>>>> 1c981e47484ad694291124653d6ef526d7475e3c

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const nav = user?.role === "doctor" ? doctorNav : patientNav;
  const meta = pageMeta[pathname] ?? {
    title: "CareSlot",
    subtitle: "Clinic appointment booking agent",
  };

  const initials = useMemo(() => {
    if (!user?.name) return "CS";
    return user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");
  }, [user]);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    if (q.includes("book") || q.includes("chat") || q.includes("agent")) router.push("/booking");
    else if (q.includes("doctor") || q.includes("derm") || q.includes("ent")) router.push("/doctors");
    else if (q.includes("appoint") || q.includes("visit")) router.push("/appointments");
    else if (q.includes("faq") || q.includes("guide") || q.includes("knowledge") || q.includes("protocol"))
      router.push("/knowledge");
    else if (q.includes("report") || q.includes("stat")) router.push("/reports");
    else if (user?.role === "doctor") router.push("/doctor");
    else router.push("/booking");
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] lg:flex">
      {mobileOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-indigo-950/30 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

<<<<<<< HEAD
        <div className="flex flex-col items-start gap-3 md:items-end">
          <nav className="glass panel flex flex-wrap gap-1 p-1.5">
            {nav.map((item) => {
              const active = pathname === item.href;
              const isBooking = item.href === "/";
              const showBadge = isBooking && !active && messages.length > 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 rounded-[16px] px-3.5 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[var(--ink)] text-[#ffffff] shadow-sm"
                      : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--ink)]"
                  }`}
                >
                  <span>{item.label}</span>
                  {showBadge && (
                    <span
                      title={`${messages.length} saved message${messages.length > 1 ? "s" : ""}`}
                      className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white shadow-sm"
                    >
                      {messages.length}
                    </span>
                  )}
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
=======
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[var(--line)] bg-[var(--bg-sidebar)] transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-[0_8px_20px_rgba(99,102,241,0.35)]">
            <PlusIcon />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight text-[var(--ink)]">CareSlot</p>
            <p className="text-[11px] font-medium text-[var(--muted)]">Clinical booking</p>
>>>>>>> 1c981e47484ad694291124653d6ef526d7475e3c
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--accent)] text-white shadow-[0_8px_18px_rgba(99,102,241,0.28)]"
                    : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--ink)]"
                }`}
              >
                <NavIcon name={item.icon} active={active} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-2xl border border-[var(--line)] bg-white/80 p-4 shadow-[var(--shadow-sm)]">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <PlusIcon />
          </div>
          <p className="text-sm font-semibold text-[var(--ink)]">Need help?</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
            Ask the booking agent or browse Knowledge Center guides.
          </p>
          <Link
            href="/booking"
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            Open booking chat
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-white/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-white text-[var(--ink)] lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>

            <form onSubmit={onSearch} className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                <SearchIcon />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doctors, appointments, guides, or FAQs…"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] py-2.5 pl-10 pr-16 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-[var(--line)] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[var(--muted)] sm:inline">
                ⌘K
              </kbd>
            </form>

            <button
              type="button"
              className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-white text-[var(--muted)] sm:inline-flex"
              aria-label="Notifications"
            >
              <BellIcon />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            </button>

            <div className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-white py-1.5 pl-1.5 pr-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                {initials}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-semibold leading-tight">{user?.name ?? "…"}</p>
                <p className="text-[11px] capitalize text-[var(--muted)]">
                  {user?.role === "doctor" ? "Clinician" : "Patient"} · {user?.userId}
                </p>
              </div>
              <button
                onClick={logout}
                className="ml-1 text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)]"
              >
                Out
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 md:px-6 md:py-6">
          <div className="mb-5 fade-up">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <NavIcon name={nav.find((n) => n.href === pathname)?.icon ?? "grid"} active={false} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] md:text-[28px]">
                  {meta.title}
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">{meta.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="fade-up-delay">{children}</div>
        </main>
      </div>
    </div>
  );
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "currentColor" : "currentColor";
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 1.8 };
  switch (name) {
    case "chat":
      return (
        <svg {...common}>
          <path d="M21 12a8.5 8.5 0 0 1-8.5 8.5H5l-2 2V12A8.5 8.5 0 1 1 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" />
          <circle cx="9" cy="7" r="3" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a3 3 0 0 1 0 5.75" strokeLinecap="round" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 5a2 2 0 0 1 2-2h11v18H6a2 2 0 0 0-2 2V5Z" strokeLinejoin="round" />
          <path d="M17 3v18" strokeLinecap="round" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16" strokeLinecap="round" />
          <path d="M8 15v-4M12 15V8M16 15v-7" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
  }
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7" strokeLinecap="round" />
      <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}
