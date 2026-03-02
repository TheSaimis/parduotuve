import { prisma } from "@/lib/prisma";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryCard from "@/components/home/CategoryCard";
import ProductCard from "@/components/home/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });

  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: {
      category: { select: { name: true } },
      images: { take: 1 },
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <HeroBanner />

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:max-w-[1600px] lg:px-8 xl:max-w-[1920px] 2xl:max-w-[95vw]">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">Kategorijos</h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Raskite tai, ko ieškote
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              productCount={cat._count.products}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:max-w-[1600px] lg:px-8 xl:max-w-[1920px] 2xl:max-w-[95vw]">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
              Išskirtiniai produktai
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Populiariausi ir rekomenduojami produktai
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:self-center"
          >
            Visi produktai
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              slug={product.slug}
              price={Number(product.price)}
              brand={product.brand}
              image={product.images[0]?.url ?? null}
              category={product.category.name}
            />
          ))}
        </div>
      </section>
    </>
  );
}
