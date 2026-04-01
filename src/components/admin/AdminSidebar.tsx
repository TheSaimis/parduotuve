"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const links = [
  { href: "/admin", label: "Apžvalga", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produktai", icon: Package },
  { href: "/admin/categories", label: "Kategorijos", icon: FolderTree },
  { href: "/admin/orders", label: "Užsakymai", icon: ShoppingCart },
];

type Props = {
  adminName: string;
  adminEmail: string;
};

export default function AdminSidebar({ adminName, adminEmail }: Props) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-40 flex h-screen w-[17rem] shrink-0 flex-col border-r border-border/70 bg-card/95 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md">
      <div className="flex h-[4.25rem] items-center gap-2.5 border-b border-border/60 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 ring-1 ring-primary/25">
          <ShoppingBag className="h-[1.1rem] w-[1.1rem] text-primary" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Vitrina
          </p>
          <h1 className="truncate text-base font-bold tracking-tight text-foreground">
            Administravimas
          </h1>
          <p className="truncate text-xs text-muted-foreground" title={adminEmail}>
            {adminName}
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-primary/20 to-primary/5 text-foreground shadow-sm ring-1 ring-primary/25"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary to-sky-400"
                  aria-hidden
                />
              )}
              <link.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-border/60 p-3">
        <AdminLogoutButton />
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/35 hover:bg-muted/60 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Grįžti į parduotuvę
        </Link>
      </div>
    </aside>
  );
}
