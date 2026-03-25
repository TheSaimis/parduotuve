import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border/60 bg-muted/40">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent"
        aria-hidden
      />
      <div className="page-container py-12 sm:py-14">
        <div className="grid grid-cols-1 justify-items-center gap-10 text-center sm:grid-cols-2 md:grid-cols-3 md:gap-12 md:text-left">
          <div className="flex max-w-sm flex-col items-center md:items-start">
            <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-accent/15 ring-1 ring-white/10">
                <ShoppingBag className="h-[1.05rem] w-[1.05rem] text-primary" />
              </span>
              <span className="bg-gradient-to-r from-primary via-sky-400 to-accent bg-clip-text text-transparent">
                Vitrina
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:max-w-sm">
              Platus prekių pasirinkimas vienoje vietoje. Greitas pristatymas visoje Lietuvoje.
            </p>
          </div>

          <div className="w-full max-w-xs">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Navigacija
            </h3>
            <ul className="mt-4 space-y-2.5 md:text-left">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Pagrindinis
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Produktai
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full max-w-xs">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Kontaktai
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground md:text-left">
              <li>info@vitrina.lt</li>
              <li>+370 600 00000</li>
              <li>Vilnius, Lietuva</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-8 text-center text-sm text-muted-foreground/90">
          &copy; {new Date().getFullYear()} Vitrina. Visos teisės saugomos.
        </div>
      </div>
    </footer>
  );
}
