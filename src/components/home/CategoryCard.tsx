import Link from "next/link";
import {
  Sparkles,
  Flower2,
  Sofa,
  Apple,
  Lamp,
  ChefHat,
  Laptop,
  Shirt,
  Footprints,
  Watch,
  Headphones,
  Bike,
  Droplets,
  Smartphone,
  Dumbbell,
  Glasses,
  Tablet,
  CircleDot,
  Car,
  ShoppingBag,
  Gem,
  Box,
  Monitor,
  Cpu,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "akiniai-nuo-saules": Glasses,
  baldai: Sofa,
  elektronika: Monitor,
  "grozio-priemones": Sparkles,
  "ismanieji-telefonai": Smartphone,
  juvelyrika: Gem,
  kvepalai: Flower2,
  "maisto-prekes": Apple,
  "mobiliuju-priedai": Headphones,
  "moteriski-batai": Footprints,
  "moteriski-drabuziai": Shirt,
  "moteriski-laikrodziai": Watch,
  "moteriski-papuosalai": Gem,
  "moteriskos-rankines": ShoppingBag,
  "moteriskos-sukneles": CircleDot,
  motociklai: Bike,
  "namu-dekoracijos": Lamp,
  "nesiojamieji-kompiuteriai": Laptop,
  "odos-prieziura": Droplets,
  plansetes: Tablet,
  "sporto-reikmenys": Dumbbell,
  "transporto-priemones": Car,
  "virtuves-reikmenys": ChefHat,
  "virsutiniai-drabuziai": Shirt,
  "vyriski-batai": Footprints,
  "vyriski-drabuziai": Shirt,
  "vyriski-laikrodziai": Watch,
  "vyriski-marskiniai": Shirt,
};

interface CategoryCardProps {
  name: string;
  slug: string;
  productCount: number;
}

export default function CategoryCard({ name, slug, productCount }: CategoryCardProps) {
  const Icon = iconMap[slug] || Box;

  return (
    <Link
      href={`/categories/${slug}`}
      className="group relative flex flex-col items-center gap-2 rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm ring-1 ring-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-muted/50 hover:shadow-md hover:shadow-primary/5 sm:gap-3 sm:p-5 lg:p-6"
    >
      <div className="flex h-12 w-12 min-w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20 transition-colors group-hover:from-primary/25 group-hover:to-primary/10 sm:h-14 sm:w-14">
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
      </div>
      <h3 className="line-clamp-2 text-center text-xs font-semibold text-foreground sm:text-sm">{name}</h3>
      <span className="text-xs text-muted-foreground">{productCount} produktai</span>
    </Link>
  );
}
