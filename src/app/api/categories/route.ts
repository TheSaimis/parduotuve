import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unauthorizedIfNotAdmin } from "@/lib/require-admin-api";
import { createSlugify } from "@/lib/slug/factory";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const body = await request.json();

  const slugify = createSlugify("lt");
  const slug = slugify(body.name);

  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug,
      description: body.description ?? null,
      image: body.image ?? null,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
