"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingCart, ChevronDown } from "lucide-react";

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Laukia", color: "bg-yellow-500/10 text-yellow-500" },
  PROCESSING: { label: "Vykdoma", color: "bg-blue-500/10 text-blue-500" },
  SHIPPED: { label: "Išsiųsta", color: "bg-purple-500/10 text-purple-500" },
  DELIVERED: { label: "Pristatyta", color: "bg-green-500/10 text-green-500" },
  CANCELLED: { label: "Atšaukta", color: "bg-red-500/10 text-red-500" },
};

const allStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: { name: string };
}

interface Order {
  id: number;
  status: string;
  total: string;
  address: string;
  createdAt: string;
  user: { name: string; email: string };
  items: OrderItem[];
}

function formatPrice(price: number | string) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
  }).format(num);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  async function fetchOrders() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders);
    setLoading(false);
  }

  useEffect(() => {
    queueMicrotask(() => {
      void fetchOrders();
    });
  }, []);

  async function updateStatus(orderId: number, status: string) {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchOrders();
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-9 text-center">
        <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-accent" aria-hidden />
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Užsakymai</h1>
        <p className="mt-1 text-sm text-muted-foreground">{orders.length} užsakymų iš viso</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusLabels[order.status];
          const isExpanded = expandedOrder === order.id;

          return (
            <div
              key={order.id}
              className="card-elevated overflow-hidden transition-transform hover:-translate-y-0.5"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedOrder(isExpanded ? null : order.id)
                }
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/30 sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">
                        Užsakymas #{order.id}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {order.user.name} &middot; {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-foreground">
                    {formatPrice(order.total)}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border/70 bg-muted/10 px-5 py-5 sm:px-6">
                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Klientas
                      </p>
                      <p className="text-sm text-foreground">
                        {order.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.user.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Pristatymo adresas
                      </p>
                      <p className="text-sm text-foreground">{order.address}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Produktai
                    </p>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/40 px-3 py-2.5"
                        >
                          <span className="text-sm text-foreground">
                            {item.product.name}{" "}
                            <span className="text-muted-foreground">
                              x{item.quantity}
                            </span>
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Keisti statusą
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {allStatuses.map((s) => {
                        const sInfo = statusLabels[s];
                        const isActive = order.status === s;
                        return (
                          <button
                            key={s}
                            onClick={() => updateStatus(order.id, s)}
                            disabled={isActive}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                              isActive
                                ? sInfo.color + " ring-1 ring-white/10"
                                : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            {sInfo.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="card-elevated py-14 text-center">
            <ShoppingCart className="mx-auto mb-3 h-11 w-11 text-muted-foreground/70" />
            <p className="text-sm text-muted-foreground">Nėra užsakymų</p>
          </div>
        )}
      </div>
    </div>
  );
}
