import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionSecret } from "@/lib/admin-session";
import { applyCartCookie, clearCartLines, getCartLines } from "@/lib/cart/cookie";

export async function POST(req: Request) {
  if (!getSessionSecret()) {
    return NextResponse.json(
      { error: "SESSION_SECRET nekonfigūruotas." },
      { status: 500 },
    );
  }

  let body: {
    name?: unknown;
    email?: unknown;
    address?: unknown;
    phone?: unknown;
    city?: unknown;
    postalCode?: unknown;
    paymentMethod?: unknown;
    notes?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neteisingas JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const postalCode =
    typeof body.postalCode === "string" ? body.postalCode.trim() : "";
  const paymentMethod =
    body.paymentMethod === "bank_transfer" ||
    body.paymentMethod === "card" ||
    body.paymentMethod === "cash"
      ? body.paymentMethod
      : "bank_transfer";
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";

  if (name.length < 2) {
    return NextResponse.json({ error: "Įveskite vardą." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Įveskite tinkamą el. paštą." }, { status: 400 });
  }
  if (address.length < 8) {
    return NextResponse.json({ error: "Įveskite pristatymo adresą." }, { status: 400 });
  }

  // Papildomi laukai (nebūtini), bet validuojami jei pateikti
  if (phone && phone.length < 6) {
    return NextResponse.json({ error: "Įveskite tinkamą telefono numerį." }, { status: 400 });
  }
  if (postalCode && postalCode.length < 4) {
    return NextResponse.json({ error: "Įveskite tinkamą pašto kodą." }, { status: 400 });
  }

  const cartLines = await getCartLines();
  if (cartLines.length === 0) {
    return NextResponse.json({ error: "Krepšelis tuščias." }, { status: 400 });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const prepared: {
        productId: number;
        qty: number;
        unitPrice: number;
      }[] = [];

      for (const line of cartLines) {
        const product = await tx.product.findUnique({
          where: { id: line.productId },
        });
        if (!product) {
          throw new Error(`Produktas #${line.productId} nebeegzistuoja.`);
        }
        const qty = Math.min(line.qty, product.stock);
        if (qty < 1) {
          throw new Error(`„${product.name}“ nebėra sandėlyje.`);
        }
        prepared.push({
          productId: product.id,
          qty,
          unitPrice: Number(product.price),
        });
      }

      let total = 0;
      for (const p of prepared) {
        total += p.unitPrice * p.qty;
      }

      let user = await tx.user.findUnique({ where: { email } });
      if (!user) {
        const password = await bcrypt.hash(randomBytes(24).toString("hex"), 10);
        user = await tx.user.create({
          data: {
            email,
            name,
            password,
            role: "USER",
          },
        });
      } else {
        await tx.user.update({
          where: { id: user.id },
          data: { name },
        });
      }

      const addressParts = [
        address,
        [postalCode, city].filter(Boolean).join(" ").trim(),
        phone ? `Tel.: ${phone}` : "",
        paymentMethod ? `Mokėjimas: ${paymentMethod}` : "",
        notes ? `Pastabos: ${notes}` : "",
      ].filter(Boolean);

      const order = await tx.order.create({
        data: {
          userId: user.id,
          total: new Prisma.Decimal(total.toFixed(2)),
          address: addressParts.join("\n"),
          status: "PENDING",
          items: {
            create: prepared.map((p) => ({
              productId: p.productId,
              quantity: p.qty,
              price: new Prisma.Decimal(p.unitPrice.toFixed(2)),
            })),
          },
        },
      });

      for (const p of prepared) {
        await tx.product.update({
          where: { id: p.productId },
          data: { stock: { decrement: p.qty } },
        });
      }

      return order;
    });

    const res = NextResponse.json({
      ok: true,
      orderId: order.id,
    });
    applyCartCookie(res, clearCartLines());
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Užsakymo klaida.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
