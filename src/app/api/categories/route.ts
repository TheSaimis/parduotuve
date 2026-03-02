import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  const body = await request.json();

  const slug = body.name
    .toLowerCase()
    .replace(/[ąčęėįšųūž]/g, (c: string) => {
      const map: Record<string, string> = {
        ą: "a", č: "c", ę: "e", ė: "e", į: "i",
        š: "s", ų: "u", ū: "u", ž: "z",
      };
      return map[c] ?? c;
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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
