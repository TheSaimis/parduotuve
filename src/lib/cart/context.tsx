"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CART_CHANGED_EVENT } from "@/lib/cart/constants";
import { fetchCartSnapshot } from "@/lib/cart/client";

type CartContextValue = {
  itemCount: number;
  /** Rankinis perkrovimas (dažniau pakanka `emitCartChanged()` iš `@/lib/cart/client`). */
  refreshCartCount: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itemCount, setItemCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    const snap = await fetchCartSnapshot();
    if (snap.ok) setItemCount(snap.itemCount);
    else setItemCount(0);
  }, []);

  useEffect(() => {
    void refreshCartCount();
  }, [refreshCartCount]);

  useEffect(() => {
    const onChange = () => {
      void refreshCartCount();
    };
    window.addEventListener(CART_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(CART_CHANGED_EVENT, onChange);
  }, [refreshCartCount]);

  const value = useMemo(
    () => ({ itemCount, refreshCartCount }),
    [itemCount, refreshCartCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart turi būti naudojamas CartProvider viduje");
  }
  return ctx;
}
