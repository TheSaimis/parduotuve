import Link from "next/link";
import { Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  name: string;
  slug: string;
  price: number | string;
  brand: string | null;
  image: string | null;
  category: string;
}

export default function ProductCard({
  name,
  slug,
  price,
  brand,
  image,
  category,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-sm ring-1 ring-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="relative flex aspect-square min-h-[140px] items-center justify-center bg-gradient-to-b from-muted/60 to-muted/30 sm:aspect-[4/3] sm:min-h-[180px] lg:aspect-[4/3]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Package className="h-12 w-12 text-muted-foreground/30 sm:h-16 sm:w-16" />
        )}
        {brand && (
          <span className="absolute left-2 top-2 rounded-lg border border-border/50 bg-background/85 px-2 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md sm:left-3 sm:top-3">
            {brand}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <span className="text-xs font-medium text-primary">{category}</span>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {name}
        </h3>
        <div className="mt-auto pt-2 sm:pt-3">
          <span className="text-base font-bold text-foreground sm:text-lg">{formatPrice(price)}</span>
        </div>
      </div>
    </Link>
  );
}
