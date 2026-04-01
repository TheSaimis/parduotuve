"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { SHOP_ROUTES } from "@/lib/cart/constants";

export default function CartNavLink({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const { itemCount } = useCart();
  const show = itemCount > 0;

  return (
    <Link
      href={SHOP_ROUTES.cart}
      className={className}
      onClick={onNavigate}
      aria-label={`Krepšelis${show ? `, ${itemCount} prekių` : ""}`}
    >
      <span className="relative inline-flex">
        <ShoppingCart className="h-[1.05rem] w-[1.05rem]" />
        {show && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </span>
      <span className="hidden sm:inline">Krepšelis</span>
    </Link>
  );
}
