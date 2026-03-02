import Link from "next/link";
import { ArrowRight, Cpu, Zap } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted to-background">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent/20 blur-[100px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-[1600px] lg:px-8 lg:py-32 xl:max-w-[1920px] xl:py-40 2xl:max-w-[95vw]">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground sm:mb-6 sm:px-4 sm:text-sm">
            <Zap className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
            Naujausi komponentai jau sandėlyje
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Kompiuterių dalys{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              profesionalams
            </span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg lg:text-xl">
            Platus procesorių, vaizdo plokščių, RAM ir kitų komponentų pasirinkimas.
            Greitas pristatymas visoje Lietuvoje.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Peržiūrėti produktus
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground sm:mt-12 sm:gap-8 sm:text-sm">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              <span>500+ produktų</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <span>Greitas pristatymas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
