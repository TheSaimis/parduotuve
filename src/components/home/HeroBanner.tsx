import Link from "next/link";
import { ArrowRight, Package, Zap } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden border-b border-border/40 bg-gradient-to-b from-muted/30 via-background to-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[12%] h-[min(28rem,50vw)] w-[min(28rem,50vw)] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[8%] h-[min(24rem,45vw)] w-[min(24rem,45vw)] rounded-full bg-accent/12 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(8,8,12,0.4))]" />
      </div>

      <div className="relative page-container flex flex-col items-center py-16 text-center sm:py-24 lg:py-32 xl:py-36">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center xl:max-w-4xl 2xl:max-w-5xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm sm:mb-6 sm:px-4 sm:text-sm">
            <Zap className="h-3.5 w-3.5 text-amber-400/90 sm:h-4 sm:w-4" />
            Naujausi produktai jau sandėlyje
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.08]">
            Viskas ko reikia,{" "}
            <span className="bg-gradient-to-r from-primary via-sky-400 to-accent bg-clip-text text-transparent">
              vienoje vietoje
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg lg:text-xl">
            Platus prekių pasirinkimas — nuo elektronikos iki drabužių ir namų reikmenų.
            Greitas pristatymas visoje Lietuvoje.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-primary/35"
            >
              Peržiūrėti prekes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground sm:mt-12 sm:gap-6 sm:text-sm">
            <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 px-3 py-2 ring-1 ring-border/50">
              <Package className="h-5 w-5 shrink-0 text-primary" />
              <span>200+ prekių</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 px-3 py-2 ring-1 ring-border/50">
              <Zap className="h-5 w-5 shrink-0 text-accent" />
              <span>Greitas pristatymas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
