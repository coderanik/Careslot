import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_USERS, SESSION_COOKIE, signSession, type UserRole } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

const loginSchema = z.object({
  passcode: z.string().min(1).max(100),
  role: z.enum(["patient", "doctor"]),
  /** Patient id (P001) or doctor id (DR01). Defaults to demo accounts. */
  userId: z.string().trim().min(1).max(20).optional(),
});

export async function POST(request: Request) {
  const expected = process.env.APP_PASSCODE?.trim();
  if (!expected) {
    return NextResponse.json({ error: "APP_PASSCODE is not set on the server." }, { status: 500 });
  }
  if (!process.env.APP_JWT_SECRET?.trim()) {
    return NextResponse.json({ error: "APP_JWT_SECRET is not set on the server." }, { status: 500 });
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || parsed.data.passcode.trim() !== expected) {
    return NextResponse.json({ error: "Wrong passcode." }, { status: 401 });
  }

  const role: UserRole = parsed.data.role;
  const db = getSupabase();

  if (role === "patient") {
    const patientId = (parsed.data.userId ?? DEMO_USERS.patient.userId).toUpperCase();
    const { data: patient, error } = await db
      .from("patients")
      .select("id, name")
      .eq("id", patientId)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!patient) return NextResponse.json({ error: "Patient not found. Register first." }, { status: 404 });

    const user = { role: "patient" as const, userId: patient.id, name: patient.name };
    const token = await signSession(user);
    const response = NextResponse.json({
      ok: true,
      user: { role: user.role, userId: user.userId, name: user.name },
    });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  }

  const doctorId = (parsed.data.userId ?? DEMO_USERS.doctor.userId).toUpperCase();
  const { data: doctor, error } = await db
    .from("doctors")
    .select("id, name")
    .eq("id", doctorId)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!doctor) return NextResponse.json({ error: "Doctor not found. Register first." }, { status: 404 });

  const user = { role: "doctor" as const, userId: doctor.id, name: doctor.name };
  const token = await signSession(user);
  const response = NextResponse.json({
    ok: true,
    user: { role: user.role, userId: user.userId, name: user.name },
  });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
