import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/cart/AddToCartButton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function MobileProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { take: 1 }, category: { select: { name: true } } },
  });
  if (!product) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Link href="/m/products" className="text-sm font-medium text-primary">
          ← Atgal
        </Link>
        <Link href="/m/cart" className="text-sm font-medium text-primary">
          Krepšelis
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/70">
        <div className="aspect-square bg-muted/30">
          {product.images[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0].url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="space-y-3 p-4">
          <div className="text-xs font-medium text-primary">{product.category.name}</div>
          <h1 className="text-lg font-bold tracking-tight">{product.name}</h1>
          <div className="text-2xl font-bold">{formatPrice(Number(product.price))}</div>

          <div className="flex flex-col gap-2">
            <AddToCartButton productId={product.id} stock={product.stock} />
            <Link
              href="/m/checkout"
              className="flex min-h-[48px] items-center justify-center rounded-xl border border-border/80 bg-muted/30 px-6 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"
            >
              Į checkout
            </Link>
          </div>

          {product.description ? (
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Aprašymas
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

