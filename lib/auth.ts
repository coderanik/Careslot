/**
 * JWT role-based session auth.
 * Cookie stores a signed JWT after password login/register. Roles: patient | doctor.
 * Uses Web Crypto-compatible jose for Edge-safe verification in proxy.ts.
 */
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const SESSION_COOKIE = "careslot_session";

export type UserRole = "patient" | "doctor";

export type SessionUser = {
  role: UserRole;
  /** Patient id (P001) or doctor id (DR01) */
  userId: string;
  name: string;
};

export type SessionClaims = JWTPayload & SessionUser;

function getJwtSecret(): Uint8Array {
  const secret = process.env.APP_JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("Missing APP_JWT_SECRET for signing sessions.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({
    role: user.role,
    userId: user.userId,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.userId)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getJwtSecret());
}

export async function verifySession(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const role = payload.role;
    const userId = typeof payload.userId === "string" ? payload.userId : payload.sub;
    const name = typeof payload.name === "string" ? payload.name : "";
    if ((role !== "patient" && role !== "doctor") || !userId) return null;
    return { role, userId, name };
  } catch {
    return null;
  }
}

/** @deprecated use verifySession — kept name for older call sites during migration */
export async function isValidSession(cookieValue: string | undefined): Promise<boolean> {
  return (await verifySession(cookieValue)) !== null;
}

export const DEMO_USERS = {
  patient: {
    role: "patient" as const,
    userId: "P001",
    name: "Arjun Mehta",
    label: "Patient · Arjun Mehta (P001)",
  },
  doctor: {
    role: "doctor" as const,
    userId: "DR01",
    name: "Dr. Kavitha Subramanian",
    label: "Doctor · Dr. Kavitha Subramanian (DR01)",
  },
} as const;
