import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionSecret } from "@/lib/admin-session";
import {
  addToCartLines,
  applyCartCookie,
  clearCartLines,
  getCartLines,
  removeCartLine,
  setCartLineQty,
} from "@/lib/cart/cookie";

async function enrichLines(lines: { productId: number; qty: number }[]) {
  if (lines.length === 0) {
    return { lines: [] as unknown[], itemCount: 0, subtotal: 0 };
  }
  const ids = lines.map((l) => l.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: { images: { take: 1 } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  type Enriched = {
    productId: number;
    qty: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    image: string | null;
  };

  const enriched: Enriched[] = [];
  let itemCount = 0;
  let subtotal = 0;

  for (const line of lines) {
    const p = byId.get(line.productId);
    if (!p) continue;
    const qty = Math.min(line.qty, p.stock);
    if (qty < 1) continue;
    const price = Number(p.price);
    itemCount += qty;
    subtotal += price * qty;
    enriched.push({
      productId: p.id,
      qty,
      name: p.name,
      slug: p.slug,
      price,
      stock: p.stock,
      image: p.images[0]?.url ?? null,
    });
  }

  return { lines: enriched, itemCount, subtotal };
}

export async function GET() {
  if (!getSessionSecret()) {
    return NextResponse.json({ lines: [], itemCount: 0, subtotal: 0 });
  }

  const rawLines = await getCartLines();
  const { lines, itemCount, subtotal } = await enrichLines(rawLines);

  const reconciled = (lines as { productId: number; qty: number }[]).map((e) => ({
    productId: e.productId,
    qty: e.qty,
  }));

  const res = NextResponse.json({ lines, itemCount, subtotal });
  applyCartCookie(res, reconciled);
  return res;
}

export async function POST(req: Request) {
  if (!getSessionSecret()) {
    return NextResponse.json(
      { error: "Sesijos slapukas neprieinamas (SESSION_SECRET)." },
      { status: 500 },
    );
  }

  let body: { productId?: unknown; quantity?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 });
  }

  const productId =
    typeof body.productId === "number"
      ? body.productId
      : typeof body.productId === "string"
        ? parseInt(body.productId, 10)
        : NaN;
  const quantity =
    typeof body.quantity === "number"
      ? body.quantity
      : typeof body.quantity === "string"
        ? parseInt(body.quantity, 10)
        : 1;

  if (!Number.isInteger(productId) || productId < 1) {
    return NextResponse.json({ error: "Neteisingas productId" }, { status: 400 });
  }

  const addQty = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, stock: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Produktas nerastas" }, { status: 404 });
  }

  if (product.stock < 1) {
    return NextResponse.json({ error: "Produktas išparduotas" }, { status: 400 });
  }

  const current = await getCartLines();
  const next = addToCartLines(current, productId, addQty, product.stock);

  const res = NextResponse.json({ ok: true });
  applyCartCookie(res, next);
  return res;
}

export async function PATCH(req: Request) {
  if (!getSessionSecret()) {
    return NextResponse.json(
      { error: "Sesijos slapukas neprieinamas (SESSION_SECRET)." },
      { status: 500 },
    );
  }

  let body: { productId?: unknown; quantity?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 });
  }

  const productId =
    typeof body.productId === "number"
      ? body.productId
      : typeof body.productId === "string"
        ? parseInt(body.productId, 10)
        : NaN;
  const quantity =
    typeof body.quantity === "number"
      ? body.quantity
      : typeof body.quantity === "string"
        ? parseInt(body.quantity, 10)
        : NaN;

  if (!Number.isInteger(productId) || productId < 1) {
    return NextResponse.json({ error: "Neteisingas productId" }, { status: 400 });
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    return NextResponse.json({ error: "Neteisingas kiekis" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Produktas nerastas" }, { status: 404 });
  }

  const current = await getCartLines();
  const next = setCartLineQty(current, productId, quantity, product.stock);

  const res = NextResponse.json({ ok: true });
  applyCartCookie(res, next);
  return res;
}

export async function DELETE(req: Request) {
  if (!getSessionSecret()) {
    return NextResponse.json(
      { error: "Sesijos slapukas neprieinamas (SESSION_SECRET)." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const idRaw = searchParams.get("productId");

  const current = await getCartLines();

  if (idRaw === null) {
    const res = NextResponse.json({ ok: true });
    applyCartCookie(res, clearCartLines());
    return res;
  }

  const productId = parseInt(idRaw, 10);
  if (!Number.isInteger(productId) || productId < 1) {
    return NextResponse.json({ error: "Neteisingas productId" }, { status: 400 });
  }

  const next = removeCartLine(current, productId);
  const res = NextResponse.json({ ok: true });
  applyCartCookie(res, next);
  return res;
}
