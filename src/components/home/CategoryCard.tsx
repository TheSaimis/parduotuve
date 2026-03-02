import Link from "next/link";
import {
  Cpu,
  MonitorSpeaker,
  MemoryStick,
  CircuitBoard,
  BatteryCharging,
  Box,
  Snowflake,
  Mouse,
  Monitor,
  HardDrive,
  Laptop,
  Smartphone,
  Tablet,
  Headphones,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  procesoriai: Cpu,
  "vaizdo-plokstes": MonitorSpeaker,
  "operatyvioji-atmintis": MemoryStick,
  "pagrindines-plokstes": CircuitBoard,
  "maitinimo-blokai": BatteryCharging,
  korpusai: Box,
  ausinimas: Snowflake,
  "periferiniai-irenginiai": Mouse,
  monitoriai: Monitor,
  "atminties-kaupikliai": HardDrive,
  // DummyJSON categories
  laptops: Laptop,
  smartphones: Smartphone,
  tablets: Tablet,
  "mobile-accessories": Headphones,
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
      className="group relative flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:bg-muted hover:shadow-lg hover:shadow-primary/5 sm:gap-3 sm:rounded-2xl sm:p-5 lg:p-6"
    >
      <div className="flex h-12 w-12 min-w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20 sm:h-14 sm:w-14 sm:rounded-xl">
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
      </div>
      <h3 className="line-clamp-2 text-center text-xs font-semibold text-foreground sm:text-sm">{name}</h3>
      <span className="text-xs text-muted-foreground">{productCount} produktai</span>
    </Link>
  );
}
