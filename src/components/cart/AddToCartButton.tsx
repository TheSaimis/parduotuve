"use client";

import { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { addCartItem, emitCartChanged } from "@/lib/cart/client";

type Props = {
  productId: number;
  stock: number;
};

export default function AddToCartButton({ productId, stock }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function add() {
    setMessage(null);
    setLoading(true);
    try {
      const result = await addCartItem(productId, 1);
      if (!result.ok) {
        setMessage(result.error ?? "Nepavyko įdėti į krepšelį.");
        return;
      }
      emitCartChanged();
      setMessage("Pridėta į krepšelį.");
    } catch {
      setMessage("Ryšio klaida.");
    } finally {
      setLoading(false);
    }
  }

  const disabled = stock < 1 || loading;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={add}
        disabled={disabled}
        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
        Į krepšelį
      </button>
      {message && (
        <p
          className={`text-sm ${message.includes("Nepavyko") || message.includes("Ryšio") ? "text-destructive" : "text-success"}`}
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
