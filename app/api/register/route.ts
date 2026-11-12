import { NextResponse } from "next/server";
import { z } from "zod";
import { SESSION_COOKIE, signSession } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

const patientSchema = z.object({
  role: z.literal("patient"),
  passcode: z.string().min(1).max(100),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  age: z.coerce.number().int().min(1).max(120),
  city: z.string().trim().min(2).max(60),
});

const doctorSchema = z.object({
  role: z.literal("doctor"),
  passcode: z.string().min(1).max(100),
  name: z.string().trim().min(2).max(80),
  department_id: z.string().trim().min(1).max(20),
  qualification: z.string().trim().min(2).max(80),
  experience_years: z.coerce.number().int().min(0).max(60),
  consultation_fee: z.coerce.number().int().min(0).max(10000),
  languages: z.string().trim().min(2).max(120),
  room: z.string().trim().min(1).max(20),
});

const registerSchema = z.discriminatedUnion("role", [patientSchema, doctorSchema]);

function nextId(prefix: "P" | "DR", existing: string[]) {
  let max = 0;
  for (const id of existing) {
    const m = id.match(prefix === "P" ? /^P(\d+)$/i : /^DR(\d+)$/i);
    if (m) max = Math.max(max, Number(m[1]));
  }
  const n = max + 1;
  return prefix === "P" ? `P${String(n).padStart(3, "0")}` : `DR${String(n).padStart(2, "0")}`;
}

function parseLanguages(raw: string) {
  return Array.from(
    new Set(
      raw
        .split(/[,/|]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s[0]!.toUpperCase() + s.slice(1))
    )
  ).slice(0, 8);
}

function dateInIndia(d: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d);
}

async function seedDoctorSlots(doctorId: string) {
  const db = getSupabase();
  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"];
  const rows: { doctor_id: string; slot_date: string; start_time: string }[] = [];
  const today = new Date();
  for (let d = 0; d < 14; d++) {
    const day = new Date(today);
    day.setDate(today.getDate() + d);
    // Skip Sundays (0)
    if (day.getDay() === 0) continue;
    const slotDate = dateInIndia(day);
    for (const start_time of times) {
      rows.push({ doctor_id: doctorId, slot_date: slotDate, start_time });
    }
  }
  if (rows.length === 0) return;
  const { error } = await db.from("slots").insert(rows);
  if (error) throw new Error(error.message);
}

export async function POST(request: Request) {
  const expected = process.env.APP_PASSCODE?.trim();
  if (!expected) {
    return NextResponse.json({ error: "APP_PASSCODE is not set on the server." }, { status: 500 });
  }
  if (!process.env.APP_JWT_SECRET?.trim()) {
    return NextResponse.json({ error: "APP_JWT_SECRET is not set on the server." }, { status: 500 });
  }

  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid registration details", details: parsed.error.issues },
      { status: 400 }
    );
  }
  if (parsed.data.passcode.trim() !== expected) {
    return NextResponse.json({ error: "Wrong team passcode." }, { status: 401 });
  }

  const db = getSupabase();

  try {
    if (parsed.data.role === "patient") {
      const { data: existing, error: listError } = await db.from("patients").select("id");
      if (listError) throw new Error(listError.message);
      const id = nextId(
        "P",
        (existing ?? []).map((r) => r.id)
      );

      const { data: patient, error } = await db
        .from("patients")
        .insert({
          id,
          name: parsed.data.name,
          phone: parsed.data.phone,
          age: parsed.data.age,
          city: parsed.data.city,
        })
        .select("id, name")
        .single();
      if (error) throw new Error(error.message);

      const user = { role: "patient" as const, userId: patient.id, name: patient.name };
      const token = await signSession(user);
      const response = NextResponse.json({ ok: true, user });
      response.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 12,
      });
      return response;
    }

    const { data: dept, error: deptError } = await db
      .from("departments")
      .select("id, name")
      .eq("id", parsed.data.department_id)
      .maybeSingle();
    if (deptError) throw new Error(deptError.message);
    if (!dept) return NextResponse.json({ error: "Unknown department." }, { status: 400 });

    const { data: existing, error: listError } = await db.from("doctors").select("id");
    if (listError) throw new Error(listError.message);
    const id = nextId(
      "DR",
      (existing ?? []).map((r) => r.id)
    );

    const languages = parseLanguages(parsed.data.languages);
    if (languages.length === 0) {
      return NextResponse.json({ error: "Add at least one language." }, { status: 400 });
    }

    const displayName = parsed.data.name.startsWith("Dr")
      ? parsed.data.name
      : `Dr. ${parsed.data.name}`;

    const { data: doctor, error } = await db
      .from("doctors")
      .insert({
        id,
        name: displayName,
        department_id: parsed.data.department_id,
        qualification: parsed.data.qualification,
        experience_years: parsed.data.experience_years,
        consultation_fee: parsed.data.consultation_fee,
        languages,
        room: parsed.data.room,
      })
      .select("id, name")
      .single();
    if (error) throw new Error(error.message);

    await seedDoctorSlots(doctor.id);

    const user = { role: "doctor" as const, userId: doctor.id, name: doctor.name };
    const token = await signSession(user);
    const response = NextResponse.json({ ok: true, user });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
