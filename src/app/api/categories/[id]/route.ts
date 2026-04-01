import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unauthorizedIfNotAdmin } from "@/lib/require-admin-api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id: parseInt(id) },
    include: {
      _count: { select: { products: true } },
    },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(category);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();

  const category = await prisma.category.update({
    where: { id: parseInt(id) },
    data: {
      name: body.name,
      description: body.description,
      image: body.image,
    },
  });

  return NextResponse.json(category);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const productCount = await prisma.product.count({
    where: { categoryId: parseInt(id) },
  });

  if (productCount > 0) {
    return NextResponse.json(
      { error: "Negalima ištrinti kategorijos su produktais" },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
