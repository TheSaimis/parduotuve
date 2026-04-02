import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  decodeAdminSession,
  encodeAdminSession,
  getSessionSecret,
} from "@/lib/admin-session-core";

export const ADMIN_SESSION_COOKIE = "vitrina_admin";

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

export function adminSessionCookieOptions(maxAgeSec: number = MAX_AGE_SEC) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}

export async function getVerifiedAdminUser() {
  const secret = getSessionSecret();
  if (!secret) return null;

  const raw = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!raw) return null;

  const payload = decodeAdminSession(raw, secret);
  if (!payload) return null;

  const user = await prisma.user.findFirst({
    where: { id: payload.uid, role: "ADMIN" },
    select: { id: true, email: true, name: true },
  });

  return user;
}

export function createAdminSessionToken(userId: number): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  return encodeAdminSession({ uid: userId, exp }, secret);
}
