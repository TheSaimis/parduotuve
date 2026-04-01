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
      <div className="mb-9 text-center">
        <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-accent" aria-hidden />
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Apžvalga</h1>
        <p className="mt-1 text-sm text-muted-foreground">Parduotuvės santrauka</p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card-elevated p-6 transition-transform hover:-translate-y-0.5"
          >
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className={`rounded-xl p-2.5 ring-1 ring-white/5 ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold tabular-nums tracking-tight text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="card-elevated overflow-hidden text-left">
        <div className="flex items-center justify-center gap-2.5 border-b border-border/70 bg-muted/20 px-6 py-4 text-center sm:justify-start sm:text-left">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <TrendingUp className="h-5 w-5" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Naujausi užsakymai
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/70 bg-muted/15 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3.5 font-medium">ID</th>
                <th className="px-6 py-3.5 font-medium">Klientas</th>
                <th className="px-6 py-3.5 font-medium">Produktai</th>
                <th className="px-6 py-3.5 font-medium">Suma</th>
                <th className="px-6 py-3.5 font-medium">Statusas</th>
                <th className="px-6 py-3.5 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const status = statusLabels[order.status];
                return (
                  <tr
                    key={order.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/25"
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
