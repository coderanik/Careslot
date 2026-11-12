import { NextResponse } from "next/server";
import { z } from "zod";
import { SESSION_COOKIE, signSession, type UserRole } from "@/lib/auth";
import { verifyPassword, passwordSchema } from "@/lib/password";
import { getSupabase } from "@/lib/supabase";

const loginSchema = z.object({
  role: z.enum(["patient", "doctor"]),
  userId: z.string().trim().min(1).max(20),
  password: z.string().min(passwordSchema.min).max(passwordSchema.max),
});

export async function POST(request: Request) {
  if (!process.env.APP_JWT_SECRET?.trim()) {
    return NextResponse.json({ error: "APP_JWT_SECRET is not set on the server." }, { status: 500 });
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your id and password." }, { status: 400 });
  }

  const role: UserRole = parsed.data.role;
  const userId = parsed.data.userId.toUpperCase();
  const db = getSupabase();

  const { data: account, error: accountError } = await db
    .from("accounts")
    .select("user_id, role, password_hash")
    .eq("user_id", userId)
    .eq("role", role)
    .maybeSingle();

  if (accountError) {
    const missing = /relation .*accounts.* does not exist|Could not find the table/i.test(
      accountError.message
    );
    return NextResponse.json(
      {
        error: missing
          ? "Auth table missing. Run seed/accounts_auth.sql in Supabase SQL Editor."
          : accountError.message,
      },
      { status: missing ? 503 : 500 }
    );
  }

  if (!account || !verifyPassword(parsed.data.password, account.password_hash)) {
    return NextResponse.json({ error: "Wrong id or password." }, { status: 401 });
  }

  if (role === "patient") {
    const { data: patient, error } = await db
      .from("patients")
      .select("id, name")
      .eq("id", userId)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!patient) return NextResponse.json({ error: "Patient not found." }, { status: 404 });

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

  const { data: doctor, error } = await db
    .from("doctors")
    .select("id, name")
    .eq("id", userId)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!doctor) return NextResponse.json({ error: "Doctor not found." }, { status: 404 });

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
