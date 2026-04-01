import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unauthorizedIfNotAdmin } from "@/lib/require-admin-api";

export async function GET() {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const [productCount, categoryCount, orderCount, userCount, revenueResult] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
    ]);

  const revenue = revenueResult._sum.total ?? 0;

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  });

  return NextResponse.json({
    productCount,
    categoryCount,
    orderCount,
    userCount,
    revenue: Number(revenue),
    recentOrders,
  });
}
