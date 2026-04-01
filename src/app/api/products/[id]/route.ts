import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unauthorizedIfNotAdmin } from "@/lib/require-admin-api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: true,
      images: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();

  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: {
      name: body.name,
      description: body.description,
      price: body.price ? parseFloat(body.price) : undefined,
      stock: body.stock !== undefined ? parseInt(body.stock) : undefined,
      brand: body.brand,
      specs: body.specs,
      featured: body.featured,
      categoryId: body.categoryId ? parseInt(body.categoryId) : undefined,
    },
    include: {
      category: { select: { name: true } },
      images: true,
    },
  });

  if (body.imageUrl) {
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: { url: body.imageUrl, productId: product.id },
    });
  }

  return NextResponse.json(product);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  await prisma.product.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
