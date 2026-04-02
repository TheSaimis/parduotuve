import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MobileHomePage() {
  const featured = await prisma.product.findMany({
    where: { featured: true },
    take: 6,
    include: { images: { take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <header className="space-y-2 text-center">
        <h1 className="text-xl font-bold tracking-tight">Vitrina Mobile</h1>
        <p className="text-sm text-muted-foreground">
          Atskira mobilioji sąsaja, naudojanti tą pačią DB ir API.
        </p>
      </header>

      <section className="rounded-2xl border border-border/70 bg-muted/15 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Greitos nuorodos</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Produktai, krepšelis ir checkout.
            </div>
          </div>
          <Link
            href="/m/products"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Į produktus
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Rekomenduojamos prekės</h2>
          <Link href="/m/products" className="text-xs font-medium text-primary">
            Žiūrėti visas
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {featured.map((p) => (
            <Link
              key={p.id}
              href={`/m/products/${p.slug}`}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card/70"
            >
              <div className="aspect-square bg-muted/30">
                {p.images[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images[0].url}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="p-3">
                <div className="line-clamp-2 text-sm font-semibold">{p.name}</div>
                <div className="mt-1 text-sm font-bold">{formatPrice(Number(p.price))}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

