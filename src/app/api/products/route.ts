import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unauthorizedIfNotAdmin } from "@/lib/require-admin-api";
import { createSlugify } from "@/lib/slug/factory";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId");

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { brand: { contains: search } },
    ];
  }
  if (categoryId) {
    where.categoryId = parseInt(categoryId);
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        images: { take: 1 },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const body = await request.json();

  const slugify = createSlugify("lt");
  const slug = slugify(body.name);

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug,
      description: body.description ?? null,
      price: parseFloat(body.price),
      stock: parseInt(body.stock ?? "0"),
      brand: body.brand ?? null,
      specs: body.specs ?? null,
      featured: body.featured ?? false,
      categoryId: parseInt(body.categoryId),
      images: body.imageUrl
        ? { create: [{ url: body.imageUrl }] }
        : undefined,
    },
    include: {
      category: { select: { name: true } },
      images: true,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
