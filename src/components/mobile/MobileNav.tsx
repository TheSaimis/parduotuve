"use client";

import Link from "next/link";
import { Home, Search, ShoppingCart, CreditCard } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart/context";

function NavItem({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/m" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition-colors ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function MobileNav() {
  const { itemCount } = useCart();
  const show = itemCount > 0;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        <NavItem href="/m" label="Pradžia" icon={<Home className="h-5 w-5" />} />
        <NavItem href="/m/products" label="Prekės" icon={<Search className="h-5 w-5" />} />
        <Link
          href="/m/cart"
          className="flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`Krepšelis${show ? `, ${itemCount} prekių` : ""}`}
        >
          <span className="relative inline-flex">
            <ShoppingCart className="h-5 w-5" />
            {show && (
              <span className="absolute -right-2.5 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </span>
          <span>Krepšelis</span>
        </Link>
        <NavItem href="/m/checkout" label="Checkout" icon={<CreditCard className="h-5 w-5" />} />
      </div>
    </nav>
  );
}

