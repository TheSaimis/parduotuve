import Link from "next/link";
import { Monitor } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:max-w-[1600px] lg:px-8 xl:max-w-[1920px] 2xl:max-w-[95vw]">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <Monitor className="h-5 w-5 text-primary" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TechShop
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Kokybiškos kompiuterių dalys ir aksesuarai. Platus pasirinkimas, greitas pristatymas.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Navigacija
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Pagrindinis
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Produktai
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Kontaktai
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>info@techshop.lt</li>
              <li>+370 600 00000</li>
              <li>Vilnius, Lietuva</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} TechShop. Visos teisės saugomos.
        </div>
      </div>
    </footer>
  );
}
