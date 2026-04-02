import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PER_PAGE = 12;

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function MobileProductsPage({ searchParams }: Props) {
  const { page: pageStr, q } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const query = typeof q === "string" ? q.trim() : "";

  const where =
    query.length > 0
      ? {
          OR: [
            { name: { contains: query } },
            { brand: { contains: query } },
          ],
        }
      : {};

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { images: { take: 1 }, category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div className="space-y-4">
      <header className="text-center">
        <h1 className="text-lg font-bold tracking-tight">Prekės (Mobile)</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {total} prekės{totalPages > 1 ? ` · Puslapis ${page}/${totalPages}` : ""}
        </p>
      </header>

      <form action="/m/products" className="flex gap-2">
        <input
          name="q"
          defaultValue={query}
          className="input-field h-11 flex-1"
          placeholder="Paieška (pavadinimas, brand)..."
        />
        <button className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
          Ieškoti
        </button>
      </form>

      <div className="space-y-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/m/products/${p.slug}`}
            className="flex gap-3 rounded-2xl border border-border/70 bg-card/70 p-3"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted/30">
              {p.images[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-primary">{p.category.name}</div>
              <div className="mt-0.5 line-clamp-2 text-sm font-semibold text-foreground">
                {p.name}
              </div>
              <div className="mt-1 text-sm font-bold">{formatPrice(Number(p.price))}</div>
              {p.brand ? (
                <div className="mt-0.5 text-xs text-muted-foreground">{p.brand}</div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Link
          aria-disabled={page <= 1}
          href={`/m/products?page=${Math.max(1, page - 1)}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
          className={`rounded-xl border border-border/70 px-4 py-2 text-sm font-medium ${
            page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-muted/50"
          }`}
        >
          Atgal
        </Link>
        <Link
          aria-disabled={page >= totalPages}
          href={`/m/products?page=${Math.min(totalPages, page + 1)}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
          className={`rounded-xl border border-border/70 px-4 py-2 text-sm font-medium ${
            page >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-muted/50"
          }`}
        >
          Pirmyn
        </Link>
      </div>
    </div>
  );
}

