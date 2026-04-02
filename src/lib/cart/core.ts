import { createHmac, timingSafeEqual } from "crypto";

export type CartLine = { productId: number; qty: number };
type CartPayload = { v: 1; items: CartLine[] };

const MAX_LINES = 80;
const MAX_QTY_PER_LINE = 999;

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

function sanitizeItems(items: CartLine[]): CartLine[] {
  const merge = new Map<number, number>();
  for (const { productId, qty } of items) {
    if (!Number.isInteger(productId) || productId < 1 || !Number.isInteger(qty)) continue;
    const q = Math.min(Math.max(0, qty), MAX_QTY_PER_LINE);
    if (q === 0) continue;
    merge.set(productId, Math.min((merge.get(productId) ?? 0) + q, MAX_QTY_PER_LINE));
  }
  return Array.from(merge.entries(), ([productId, qty]) => ({ productId, qty })).slice(0, MAX_LINES);
}

export function encodeCartPayload(items: CartLine[], secret: string): string {
  const payload: CartPayload = { v: 1, items: sanitizeItems(items) };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export function decodeCartPayload(token: string, secret: string): CartLine[] {
  const i = token.lastIndexOf(".");
  if (i <= 0) return [];
  const body = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = sign(body, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return [];
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as CartPayload;
    if (parsed.v !== 1 || !Array.isArray(parsed.items)) return [];
    return sanitizeItems(parsed.items);
  } catch {
    return [];
  }
}

export function addToCartLines(
  lines: CartLine[],
  productId: number,
  addQty: number,
  maxStock: number,
): CartLine[] {
  if (addQty < 1 || maxStock < 1) return lines.filter((l) => l.productId !== productId);
  const rest = lines.filter((l) => l.productId !== productId);
  const cur = lines.find((l) => l.productId === productId)?.qty ?? 0;
  const next = Math.min(cur + addQty, maxStock);
  if (next < 1) return rest;
  return sanitizeItems([...rest, { productId, qty: next }]);
}

export function setCartLineQty(
  lines: CartLine[],
  productId: number,
  qty: number,
  maxStock: number,
): CartLine[] {
  const rest = lines.filter((l) => l.productId !== productId);
  if (qty < 1) return rest;
  const next = Math.min(qty, maxStock);
  if (next < 1) return rest;
  return sanitizeItems([...rest, { productId, qty: next }]);
}

export function removeCartLine(lines: CartLine[], productId: number): CartLine[] {
  return lines.filter((l) => l.productId !== productId);
}

export function clearCartLines(): CartLine[] {
  return [];
}

