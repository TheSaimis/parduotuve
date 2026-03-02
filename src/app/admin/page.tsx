import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  Users,
  Euro,
  TrendingUp,
} from "lucide-react";

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Laukia", color: "bg-yellow-500/10 text-yellow-500" },
  PROCESSING: { label: "Vykdoma", color: "bg-blue-500/10 text-blue-500" },
  SHIPPED: { label: "Išsiųsta", color: "bg-purple-500/10 text-purple-500" },
  DELIVERED: { label: "Pristatyta", color: "bg-green-500/10 text-green-500" },
  CANCELLED: { label: "Atšaukta", color: "bg-red-500/10 text-red-500" },
};

export default async function AdminDashboard() {
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

  const revenue = Number(revenueResult._sum.total ?? 0);

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

  const stats = [
    {
      label: "Produktai",
      value: productCount,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Užsakymai",
      value: orderCount,
      icon: ShoppingCart,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Vartotojai",
      value: userCount,
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Pajamos",
      value: formatPrice(revenue),
      icon: Euro,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Parduotuvės apžvalga
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div className={`rounded-xl p-2.5 ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Naujausi užsakymai
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Klientas</th>
                <th className="px-6 py-3 font-medium">Produktai</th>
                <th className="px-6 py-3 font-medium">Suma</th>
                <th className="px-6 py-3 font-medium">Statusas</th>
                <th className="px-6 py-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const status = statusLabels[order.status];
                return (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">
                        {order.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.user.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {order.items
                        .map((item) => item.product.name)
                        .join(", ")}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      {formatPrice(Number(order.total))}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-muted-foreground"
                  >
                    Nėra užsakymų
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
