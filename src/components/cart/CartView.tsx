"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CART_CHANGED_EVENT, SHOP_ROUTES } from "@/lib/cart/constants";
import type { CartLineDto } from "@/lib/cart/types";
import {
  clearCartRemote,
  emitCartChanged,
  fetchCartSnapshot,
  removeCartItem,
  updateCartLine,
} from "@/lib/cart/client";

export default function CartView() {
  const [lines, setLines] = useState<CartLineDto[] | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const snap = await fetchCartSnapshot();
    if (!snap.ok) {
      setError(snap.error ?? "Nepavyko įkelti krepšelio.");
      setLines([]);
      return;
    }
    setLines(snap.lines);
    setItemCount(snap.itemCount);
    setSubtotal(snap.subtotal);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const h = () => {
      void load();
    };
    window.addEventListener(CART_CHANGED_EVENT, h);
    return () => window.removeEventListener(CART_CHANGED_EVENT, h);
  }, [load]);

  async function setQty(productId: number, quantity: number) {
    setBusyId(productId);
    try {
      const r = await updateCartLine(productId, quantity);
      if (!r.ok) setError(r.error ?? "Nepavyko atnaujinti.");
      emitCartChanged();
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function removeLine(productId: number) {
    setBusyId(productId);
    try {
      await removeCartItem(productId);
      emitCartChanged();
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function clearAll() {
    setBusyId(-1);
    try {
      await clearCartRemote();
      emitCartChanged();
      await load();
    } finally {
      setBusyId(null);
    }
  }

  if (lines === null) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border/80 bg-muted/20 py-14 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">Krepšelis tuščias</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Užsisukite į katalogą ir įmeskite prekių.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Į produktus
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <ul className="space-y-4">
        {lines.map((line) => (
          <li
            key={line.productId}
            className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/60 p-4 ring-1 ring-white/[0.04] sm:flex-row sm:items-center"
          >
            <Link
              href={`/products/${line.slug}`}
              className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-muted/50 sm:mx-0"
            >
              {line.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={line.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-2xl text-muted-foreground/30">
                  📦
                </span>
              )}
            </Link>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <Link
                href={`/products/${line.slug}`}
                className="font-semibold text-foreground hover:text-primary"
              >
                {line.name}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatPrice(line.price)} × {line.qty} ={" "}
                <span className="font-medium text-foreground">
                  {formatPrice(line.price * line.qty)}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Sandėlyje: {line.stock} vnt.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 sm:flex-col sm:justify-center md:flex-row">
              <div className="flex items-center rounded-xl border border-border/80 bg-muted/30 p-1">
                <button
                  type="button"
                  aria-label="Mažinti"
                  disabled={busyId !== null}
                  onClick={() => setQty(line.productId, line.qty - 1)}
                  className="rounded-lg p-2 hover:bg-muted/80 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
                  {busyId === line.productId ? (
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  ) : (
                    line.qty
                  )}
                </span>
                <button
                  type="button"
                  aria-label="Didinti"
                  disabled={busyId !== null || line.qty >= line.stock}
                  onClick={() => setQty(line.productId, line.qty + 1)}
                  className="rounded-lg p-2 hover:bg-muted/80 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                aria-label="Pašalinti"
                disabled={busyId !== null}
                onClick={() => removeLine(line.productId)}
                className="rounded-xl p-2.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Iš viso prekių: {itemCount}</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
            {formatPrice(subtotal)}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={clearAll}
            disabled={busyId !== null}
            className="rounded-xl border border-border/80 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/60 disabled:opacity-50"
          >
            Išvalyti
          </button>
          <Link
            href={SHOP_ROUTES.checkout}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95"
          >
            Apmokėti
          </Link>
        </div>
      </div>
    </div>
  );
}
