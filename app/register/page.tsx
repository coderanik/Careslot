"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteFooter from "@/components/SiteFooter";

type Role = "patient" | "doctor";
type Department = { id: string; name: string };

const field =
  "mt-1.5 w-full rounded-2xl border border-black/8 bg-[#faf8f5] px-4 py-3 outline-none transition focus:border-[#ff5a1f] focus:ring-4 focus:ring-[rgba(255,90,31,0.12)]";

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("patient");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("29");
  const [city, setCity] = useState("Chennai");
  const [departmentId, setDepartmentId] = useState("");
  const [qualification, setQualification] = useState("MBBS");
  const [experience, setExperience] = useState("5");
  const [fee, setFee] = useState("500");
  const [languages, setLanguages] = useState("English, Tamil");
  const [room, setRoom] = useState("G-10");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/departments")
      .then((r) => r.json())
      .then((d) => {
        const list = d.departments ?? [];
        setDepartments(list);
        if (list[0]) setDepartmentId(list[0].id);
      })
      .catch(() => setDepartments([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }
    setLoading(true);
    setError("");

    const body =
      role === "patient"
        ? { role, password, confirmPassword, name, phone, age: Number(age), city }
        : {
            role,
            password,
            confirmPassword,
            name,
            department_id: departmentId,
            qualification,
            experience_years: Number(experience),
            consultation_fee: Number(fee),
            languages,
            room,
          };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      window.location.href = data.user?.role === "doctor" ? "/doctor" : "/dashboard";
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Registration failed");
    }
  }

  return (
    <div className="landing min-h-screen">
      <header className="landing-nav scrolled">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="text-[15px] font-extrabold tracking-[0.04em] text-[#111]">
            CARESLOT<span className="text-[#ff5a1f]">.</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-[#6b6b6b] sm:inline">Already have an id?</span>
            <Link
              href="/login"
              className="rounded-full bg-[#171513] px-4 py-2 font-semibold text-white hover:bg-black"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1fr_1.1fr] md:px-6 md:py-14">
        <div className="fade-up">
          <span className="inline-flex rounded-full bg-[#ffe8de] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff5a1f]">
            Create account
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[#111] md:text-5xl md:leading-[1.05]">
            Sign up for CareSlot
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#6b6b6b] md:text-base">
            Register a new <strong>patient</strong> or <strong>doctor</strong>. Choose a password,
            we mint your id in Supabase, and sign you in with a JWT.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-[#6b6b6b]">
            <li className="flex gap-2">
              <span className="text-[#ff5a1f]">✓</span> Patients get a P-series id for booking
            </li>
            <li className="flex gap-2">
              <span className="text-[#ff5a1f]">✓</span> Doctors get a DR-series id + free slots
            </li>
            <li className="flex gap-2">
              <span className="text-[#ff5a1f]">✓</span> Password + confirm password on every signup
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="landing-card fade-up-delay p-6 md:p-7">
          <div className="grid grid-cols-2 gap-2 rounded-full border border-black/8 bg-[#f6f4f1] p-1">
            {(
              [
                { id: "patient", label: "Patient", hint: "Book visits" },
                { id: "doctor", label: "Doctor", hint: "Day schedule" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRole(opt.id)}
                className={`rounded-full px-3 py-3 text-left transition ${
                  role === opt.id
                    ? "bg-[#171513] text-white shadow-[0_8px_18px_rgba(17,17,17,0.2)]"
                    : "text-[#6b6b6b] hover:bg-white"
                }`}
              >
                <div className="text-sm font-semibold">{opt.label}</div>
                <div className={`text-[11px] ${role === opt.id ? "text-white/75" : ""}`}>{opt.hint}</div>
              </button>
            ))}
          </div>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-[#6b6b6b]">Full name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={field}
              placeholder={role === "doctor" ? "Kavitha Subramanian" : "Your name"}
            />
          </label>

          {role === "patient" ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="font-medium text-[#6b6b6b]">Phone</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={field}
                  placeholder="98400 12345"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[#6b6b6b]">Age</span>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className={field}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[#6b6b6b]">City</span>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className={field}
                />
              </label>
            </div>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="font-medium text-[#6b6b6b]">Department</span>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                  className={field}
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[#6b6b6b]">Qualification</span>
                <input
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  required
                  className={field}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[#6b6b6b]">Room</span>
                <input value={room} onChange={(e) => setRoom(e.target.value)} required className={field} />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[#6b6b6b]">Experience (yrs)</span>
                <input
                  type="number"
                  min={0}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                  className={field}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[#6b6b6b]">Fee (₹)</span>
                <input
                  type="number"
                  min={0}
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  required
                  className={field}
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="font-medium text-[#6b6b6b]">Languages</span>
                <input
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  required
                  className={field}
                  placeholder="English, Tamil, Hindi"
                />
              </label>
            </div>
          )}

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-[#6b6b6b]">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={field}
                placeholder="At least 6 characters"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[#6b6b6b]">Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className={field}
                placeholder="Repeat password"
              />
            </label>
          </div>

          {error && <p className="mt-3 text-sm text-[#dc2626]">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password || !confirmPassword || !name}
            className="landing-btn-dark mt-5 w-full justify-center disabled:opacity-40"
          >
            {loading ? "Creating account…" : `Create ${role} account`}
            <span className="arrow">→</span>
          </button>

          <p className="mt-4 text-center text-xs text-[#6b6b6b]">
            Prefer the demo?{" "}
            <Link href="/login" className="font-semibold text-[#ff5a1f]">
              Sign in as P001 / demo1234
            </Link>
          </p>
        </form>
      </main>

      <SiteFooter />
    </div>
  );
}
