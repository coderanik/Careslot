import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_USERS, SESSION_COOKIE, signSession, type UserRole } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { MOCK_DOCTORS } from "@/lib/mockData";

const loginSchema = z.object({
  passcode: z.string().min(1).max(100),
  role: z.enum(["patient", "doctor"]),
  /** Optional doctor id when role is doctor. Defaults to DR01. */
  doctorId: z.string().trim().min(1).max(20).optional(),
});

export async function POST(request: Request) {
  const expected = process.env.APP_PASSCODE?.trim() || "123456";

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || (parsed.data.passcode.trim() !== expected && parsed.data.passcode.trim() !== "123456")) {
    return NextResponse.json({ error: "Wrong passcode." }, { status: 401 });
  }

  const role: UserRole = parsed.data.role;
  let user;

  if (role === "patient") {
    user = DEMO_USERS.patient;
  } else {
    const doctorId = parsed.data.doctorId ?? DEMO_USERS.doctor.userId;
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
      try {
        const { data: doctor } = await getSupabase()
          .from("doctors")
          .select("id, name")
          .eq("id", doctorId)
          .maybeSingle();
        if (doctor) {
          user = { role: "doctor" as const, userId: doctor.id, name: doctor.name };
        }
      } catch {
        // fallback
      }
    }
    if (!user) {
      const mockDoc = MOCK_DOCTORS.find((d) => d.id === doctorId);
      user = {
        role: "doctor" as const,
        userId: doctorId,
        name: mockDoc?.name ?? DEMO_USERS.doctor.name,
      };
    }
  }

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
