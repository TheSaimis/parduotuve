import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/cart/AddToCartButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!product) return { title: "Produktas nerastas" };
  return {
    title: `${product.name} | Vitrina`,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: { include: { parent: { select: { name: true, slug: true } } } },
      images: true,
    },
  });

  if (!product) notFound();

  const specs = product.specs as Record<string, unknown> | null;

  return (
    <div className="page-container py-8 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-muted-foreground sm:mb-8">
          <Link href="/" className="transition-colors hover:text-primary">
            Pagrindinis
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
          {product.category.parent && (
            <>
              <Link
                href={`/categories/${product.category.parent.slug}`}
                className="transition-colors hover:text-primary"
              >
                {product.category.parent.name}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
            </>
          )}
          <Link
            href={`/categories/${product.category.slug}`}
            className="transition-colors hover:text-primary"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
          <span className="line-clamp-2 max-w-[min(100%,20rem)] font-medium text-foreground sm:line-clamp-1 sm:max-w-none">
            {product.name}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 lg:items-start">
          <div className="mx-auto w-full max-w-md space-y-4 lg:mx-0 lg:max-w-none">
          {product.images.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-muted/40 shadow-lg ring-1 ring-white/[0.06]">
              <img
                src={product.images[0].url}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/30">
              <span className="text-4xl text-muted-foreground/40">📦</span>
            </div>
          )}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.slice(1).map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt=""
                  className="h-20 w-20 flex-shrink-0 rounded-xl border border-border/60 object-cover ring-1 ring-white/5"
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center lg:text-left">
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-sm font-semibold text-primary transition-colors hover:text-sky-400"
          >
            {product.category.name}
          </Link>
          {product.brand && (
            <span className="ml-2 text-sm text-muted-foreground">
              · {product.brand}
            </span>
          )}

          <h1 className="mt-2 text-balance text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
            {product.name}
          </h1>

          <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight text-foreground">
            {formatPrice(Number(product.price))}
          </p>

          {product.stock > 0 ? (
            <p className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1 text-sm font-medium text-success ring-1 ring-success/20 lg:justify-start">
              Sandėlyje: {product.stock} vnt.
            </p>
          ) : (
            <p className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-destructive/10 px-2.5 py-1 text-sm font-medium text-destructive ring-1 ring-destructive/25 lg:justify-start">
              Išparduota
            </p>
          )}

          {product.description && (
            <div className="mt-8 rounded-2xl border border-border/70 bg-card/50 p-5 ring-1 ring-white/[0.04]">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Aprašymas
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {specs && Object.keys(specs).length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Specifikacijos
              </h2>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {Object.entries(specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl border border-border/70 bg-muted/25 px-3 py-2.5"
                  >
                    <dt className="text-xs text-muted-foreground capitalize">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="mt-0.5 font-medium">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-3 lg:justify-start">
            <AddToCartButton productId={product.id} stock={product.stock} />
            <Link
              href="/products"
              className="flex min-h-[48px] items-center justify-center rounded-xl border border-border/80 bg-muted/30 px-6 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"
            >
              Grįžti
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
