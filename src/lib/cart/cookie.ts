import { cookies } from "next/headers";
import { getSessionSecret } from "@/lib/admin-session";
import {
  decodeCartPayload,
  encodeCartPayload,
  type CartLine,
} from "@/lib/cart/core";
export {
  addToCartLines,
  clearCartLines,
  removeCartLine,
  setCartLineQty,
} from "@/lib/cart/core";
export type { CartLine } from "@/lib/cart/core";

export const CART_COOKIE = "vitrina_cart";

const MAX_AGE_SEC = 60 * 60 * 24 * 30;

export function cartCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}

export async function getCartLines(): Promise<CartLine[]> {
  const secret = getSessionSecret();
  if (!secret) return [];
  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return [];
  return decodeCartPayload(raw, secret);
}

export function applyCartCookie(
  res: { cookies: { set: (name: string, value: string, options: object) => void } },
  items: CartLine[],
): void {
  const secret = getSessionSecret();
  if (!secret) return;
  // encodeCartPayload apjungia + suvaliduoja items (sanitize)
  const sanitized = decodeCartPayload(encodeCartPayload(items, secret), secret);
  if (sanitized.length === 0) {
    res.cookies.set(CART_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return;
  }
  res.cookies.set(CART_COOKIE, encodeCartPayload(sanitized, secret), cartCookieOptions());
}
