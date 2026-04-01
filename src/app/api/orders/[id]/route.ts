import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unauthorizedIfNotAdmin } from "@/lib/require-admin-api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: {
            select: { name: true, slug: true, images: { take: 1 } },
          },
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();

  const order = await prisma.order.update({
    where: { id: parseInt(id) },
    data: {
      status: body.status,
    },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  });

  return NextResponse.json(order);
}
