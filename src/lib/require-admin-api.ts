import { NextResponse } from "next/server";
import { getVerifiedAdminUser } from "@/lib/admin-session";

/** Grąžina 401 atsakymą, jei nėra galiojančios admin sesijos. */
export async function unauthorizedIfNotAdmin(): Promise<NextResponse | null> {
  const user = await getVerifiedAdminUser();
  if (!user) {
    return NextResponse.json(
      { error: "Reikalingas administratoriaus prisijungimas." },
      { status: 401 },
    );
  }
  return null;
}
