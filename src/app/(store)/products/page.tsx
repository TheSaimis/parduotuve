import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/home/ProductCard";
import CategoryCard from "@/components/home/CategoryCard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Visi produktai | TechShop",
  description: "Platus kompiuterių dalių ir elektronikos pasirinkimas",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: { select: { name: true } },
        images: { take: 1 },
      },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:max-w-[1600px] lg:px-8 xl:max-w-[1920px] 2xl:max-w-[95vw]">
      <Link
        href="/"
        className="mb-4 inline-flex min-h-[44px] min-w-[44px] items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Atgal į pagrindinį
      </Link>

      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
          Visi produktai
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {products.length} produktai
        </p>
      </div>

      <section className="mb-8 sm:mb-12">
        <h2 className="mb-3 text-base font-semibold text-foreground sm:mb-4 sm:text-lg">
          Kategorijos
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
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

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground sm:mb-6 sm:text-xl">
          Produktai
        </h2>
        {products.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-muted/30 py-10 text-center text-sm text-muted-foreground sm:py-12 sm:text-base">
            Produktų nėra.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {products.map((product) => (
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
        )}
      </section>
    </div>
  );
}
