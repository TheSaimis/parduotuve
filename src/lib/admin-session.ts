import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const ADMIN_SESSION_COOKIE = "vitrina_admin";

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

/** Tik lokaliai: jei SESSION_SECRET nenurodytas, sesija vis tiek veikia. Produkcijoje būtina nustatyti SESSION_SECRET. */
const DEV_FALLBACK_SECRET =
  "vitrina-dev-session-secret-never-use-in-production";

export function getSessionSecret(): string | null {
  const s = process.env.SESSION_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV !== "production") {
    return DEV_FALLBACK_SECRET;
  }
  return null;
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export type AdminSessionPayload = { uid: number; exp: number };

export function encodeAdminSession(
  payload: AdminSessionPayload,
  secret: string,
): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = sign(body, secret);
  return `${body}.${sig}`;
}

export function decodeAdminSession(
  token: string,
  secret: string,
): AdminSessionPayload | null {
  const i = token.lastIndexOf(".");
  if (i <= 0) return null;
  const body = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = sign(body, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as AdminSessionPayload;
    if (typeof payload.uid !== "number" || typeof payload.exp !== "number") {
      return null;
    }
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

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
