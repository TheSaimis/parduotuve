import Link from "next/link";
import {
  Monitor,
  Shirt,
  Sparkles,
  Gem,
  Home,
  Apple,
  Dumbbell,
  Car,
  Box,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  elektronika: Monitor,
  drabuziai: Shirt,
  "grozis-ir-higiena": Sparkles,
  "papuosalai-ir-aksesuarai": Gem,
  "namai-ir-virtuve": Home,
  maistas: Apple,
  "sportas-ir-laisvalaikis": Dumbbell,
  transportas: Car,
};

interface CatalogCardProps {
  name: string;
  slug: string;
  description?: string | null;
  childCount: number;
  productCount: number;
  image?: string | null;
}

export default function CatalogCard({ name, slug, description, childCount, productCount, image }: CatalogCardProps) {
  const Icon = iconMap[slug] || Box;

  return (
    <Link
      href={`/categories/${slug}`}
      className="group relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-sm ring-1 ring-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="relative flex h-28 shrink-0 items-center justify-center bg-gradient-to-b from-muted/70 to-muted/30 sm:h-32 md:h-36">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover opacity-30 transition-opacity duration-300 group-hover:opacity-50"
          />
        ) : null}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-inner ring-1 ring-primary/25 backdrop-blur-sm sm:h-14 sm:w-14">
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <h3 className="px-2 text-center text-sm font-bold text-foreground drop-shadow-sm sm:text-base">{name}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-3 sm:p-4">
        {description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
        )}
        <div className="flex items-center justify-between border-t border-border/50 pt-2 text-[11px] sm:text-xs">
          <span className="shrink-0 text-muted-foreground">{childCount} subkat.</span>
          <span className="shrink-0 font-semibold text-primary">{productCount} prekių</span>
        </div>
      </div>
    </Link>
  );
}
