import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession, type SessionUser } from "./auth";

/** Read the signed JWT from the httpOnly cookie (server components + API routes). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

export async function requireSession(role?: SessionUser["role"]): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("Not logged in");
  if (role && user.role !== role) throw new Error(`This action needs the ${role} role`);
  return user;
}
