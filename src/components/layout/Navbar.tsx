"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, ShieldCheck } from "lucide-react";

const navLinks = [
  { href: "/", label: "Pagrindinis" },
  { href: "/products", label: "Produktai" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/75 shadow-[0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-xl backdrop-saturate-150">
      <div className="page-container flex h-[4.25rem] w-full min-w-0 items-center gap-3">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-xl font-bold tracking-tight transition-opacity hover:opacity-95"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-accent/20 ring-1 ring-primary/30 transition-transform group-hover:scale-[1.02]">
            <ShoppingBag className="h-[1.15rem] w-[1.15rem] text-primary" />
          </span>
          <span className="bg-gradient-to-r from-primary via-sky-400 to-accent bg-clip-text text-transparent">
            Vitrina
          </span>
        </Link>

        {/* Desktop nav */}
        <span className="mx-5 hidden h-5 w-px shrink-0 bg-gradient-to-b from-transparent via-border to-transparent md:block" aria-hidden />
        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="min-w-0 flex-1" aria-hidden />

        {/* Admin link - visually separated */}
        <Link
          href="/admin"
          className="hidden shrink-0 items-center gap-2 rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs font-semibold text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-muted/60 hover:text-foreground md:flex"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-primary/90" />
          Admin
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Uždaryti meniu" : "Atidaryti meniu"}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/70 bg-background/95 px-4 pb-5 pt-2 backdrop-blur-md md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="my-2 border-t border-border/60" />
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
}
