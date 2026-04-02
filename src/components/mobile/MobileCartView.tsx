"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CART_CHANGED_EVENT } from "@/lib/cart/constants";
import type { CartLineDto } from "@/lib/cart/types";
import {
  clearCartRemote,
  emitCartChanged,
  fetchCartSnapshot,
  removeCartItem,
  updateCartLine,
} from "@/lib/cart/client";

export default function MobileCartView() {
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
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 py-12 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">Krepšelis tuščias</h2>
        <p className="mt-2 text-sm text-muted-foreground">Įsidėkite prekių iš katalogo.</p>
        <Link
          href="/m/products"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Į produktus
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <ul className="space-y-3">
        {lines.map((line) => (
          <li key={line.productId} className="rounded-2xl border border-border/80 bg-card/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <Link href={`/m/products/${line.slug}`} className="min-w-0">
                <div className="line-clamp-2 text-sm font-semibold text-foreground">
                  {line.name}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {formatPrice(line.price)} × {line.qty} ={" "}
                  <span className="font-medium text-foreground">
                    {formatPrice(line.price * line.qty)}
                  </span>
                </div>
              </Link>
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

            <div className="mt-3 flex items-center justify-between">
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

              <div className="text-xs text-muted-foreground">Sandėlyje: {line.stock}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-2xl border border-border/80 bg-muted/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Prekių: {itemCount}</div>
            <div className="mt-1 text-lg font-bold tabular-nums">{formatPrice(subtotal)}</div>
          </div>
          <button
            type="button"
            onClick={clearAll}
            disabled={busyId !== null}
            className="rounded-xl border border-border/80 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60 disabled:opacity-50"
          >
            Išvalyti
          </button>
        </div>

        <Link
          href="/m/checkout"
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
        >
          Į checkout
        </Link>
      </div>
    </div>
  );
}

