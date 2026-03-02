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
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 sm:rounded-2xl"
    >
      <div className="relative flex aspect-square min-h-[140px] items-center justify-center bg-muted/50 sm:aspect-[4/3] sm:min-h-[180px] lg:aspect-[4/3]">
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
          <span className="absolute left-2 top-2 rounded-lg bg-background/80 px-2 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm sm:left-3 sm:top-3">
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
