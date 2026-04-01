import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
  getSessionSecret,
} from "@/lib/admin-session";

export async function POST(req: Request) {
  const secret = getSessionSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "SESSION_SECRET nekonfigūruotas serveryje." },
      { status: 500 },
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neteisingas užklausos formatas." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Įveskite el. paštą ir slaptažodį." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Neteisingi prisijungimo duomenys arba paskyra nėra administratoriaus." },
      { status: 401 },
    );
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return NextResponse.json(
      { error: "Neteisingi prisijungimo duomenys arba paskyra nėra administratoriaus." },
      { status: 401 },
    );
  }

  const token = createAdminSessionToken(user.id);
  if (!token) {
    return NextResponse.json({ error: "Sesijos klaida." }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions());

  return res;
}
