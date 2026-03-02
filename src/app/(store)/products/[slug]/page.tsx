import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

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
    title: `${product.name} | TechShop`,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
    },
  });

  if (!product) notFound();

  const specs = product.specs as Record<string, unknown> | null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:max-w-[1600px] lg:px-8 xl:max-w-[1920px] 2xl:max-w-[95vw]">
      <Link
        href="/products"
        className="mb-4 inline-flex min-h-[44px] min-w-[44px] items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Atgal į produktus
      </Link>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="space-y-4">
          {product.images.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
              <img
                src={product.images[0].url}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-muted/30">
              <span className="text-4xl text-muted-foreground/50">📦</span>
            </div>
          )}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.slice(1).map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt=""
                  className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {product.category.name}
          </Link>
          {product.brand && (
            <span className="ml-2 text-sm text-muted-foreground">
              · {product.brand}
            </span>
          )}

          <h1 className="mt-2 text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
            {product.name}
          </h1>

          <p className="mt-4 text-2xl font-bold text-foreground">
            {formatPrice(product.price)}
          </p>

          {product.stock > 0 ? (
            <p className="mt-1 text-sm text-green-600 dark:text-green-400">
              Sandėlyje: {product.stock} vnt.
            </p>
          ) : (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              Išparduota
            </p>
          )}

          {product.description && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-foreground">
                Aprašymas
              </h2>
              <p className="mt-2 text-muted-foreground whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {specs && Object.keys(specs).length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-foreground">
                Specifikacijos
              </h2>
              <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                {Object.entries(specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-lg border border-border bg-muted/20 px-3 py-2"
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

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-3">
            <button
              type="button"
              disabled={product.stock === 0}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />
              Į krepšelį
            </button>
            <Link
              href="/products"
              className="flex min-h-[48px] items-center justify-center rounded-xl border border-border px-6 py-3 text-center text-sm font-medium transition-colors hover:bg-muted"
            >
              Grįžti
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
