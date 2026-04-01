import { CART_CHANGED_EVENT, SHOP_API } from "@/lib/cart/constants";
import type { CartSnapshot, CheckoutPayload } from "@/lib/cart/types";

export function emitCartChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CART_CHANGED_EVENT));
}

export type FetchCartResult = CartSnapshot & { ok: boolean; error?: string };

export async function fetchCartSnapshot(): Promise<FetchCartResult> {
  try {
    const res = await fetch(SHOP_API.cart, { cache: "no-store" });
    const data = (await res.json().catch(() => ({}))) as Partial<CartSnapshot> & {
      error?: string;
    };
    if (!res.ok) {
      return {
        ok: false,
        lines: [],
        itemCount: 0,
        subtotal: 0,
        error: data.error ?? "Nepavyko įkelti krepšelio.",
      };
    }
    return {
      ok: true,
      lines: data.lines ?? [],
      itemCount: data.itemCount ?? 0,
      subtotal: data.subtotal ?? 0,
    };
  } catch {
    return {
      ok: false,
      lines: [],
      itemCount: 0,
      subtotal: 0,
      error: "Ryšio klaida.",
    };
  }
}

export async function addCartItem(
  productId: number,
  quantity = 1,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(SHOP_API.cart, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      return { ok: false, error: data.error ?? "Nepavyko įdėti į krepšelį." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Ryšio klaida." };
  }
}

export async function updateCartLine(
  productId: number,
  quantity: number,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(SHOP_API.cart, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      return { ok: false, error: data.error ?? "Nepavyko atnaujinti." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Ryšio klaida." };
  }
}

export async function removeCartItem(productId: number): Promise<{ ok: boolean }> {
  try {
    await fetch(`${SHOP_API.cart}?productId=${productId}`, { method: "DELETE" });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function clearCartRemote(): Promise<{ ok: boolean }> {
  try {
    await fetch(SHOP_API.cart, { method: "DELETE" });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function submitCheckout(
  payload: CheckoutPayload,
): Promise<{ ok: boolean; orderId?: number; error?: string }> {
  try {
    const res = await fetch(SHOP_API.checkout, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      orderId?: number;
    };
    if (!res.ok) {
      return { ok: false, error: data.error ?? "Nepavyko pateikti užsakymo." };
    }
    return { ok: true, orderId: data.orderId };
  } catch {
    return { ok: false, error: "Ryšio klaida." };
  }
}
