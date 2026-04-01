"use client";

import { CartProvider } from "@/lib/cart/context";

export default function StoreProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
