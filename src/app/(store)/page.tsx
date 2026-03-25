import { prisma } from "@/lib/prisma";
import HeroBanner from "@/components/home/HeroBanner";
import CatalogCard from "@/components/home/CatalogCard";
import ProductCard from "@/components/home/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const catalogs = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          _count: { select: { products: true } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: {
      category: { select: { name: true, parent: { select: { name: true, slug: true } } } },
      images: { take: 1 },
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <HeroBanner />

      <section className="page-container py-10 sm:py-14 lg:py-16">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
            Katalogai
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground sm:text-sm">
            Pasirinkite kategoriją ir naršykite prekes
          </p>
        </div>

        <ul className="grid-fluid-cards w-full list-none">
          {catalogs.map((catalog) => {
            const totalProducts = catalog.children.reduce((sum, c) => sum + c._count.products, 0);
            return (
              <li key={catalog.id} className="flex min-h-0 min-w-0">
                <CatalogCard
                  name={catalog.name}
                  slug={catalog.slug}
                  description={catalog.description}
                  childCount={catalog.children.length}
                  productCount={totalProducts}
                  image={catalog.image}
                />
              </li>
            );
          })}
        </ul>
      </section>

      <section className="page-container pb-14 sm:pb-16 lg:pb-20">
        <div className="mb-8 flex flex-col items-center gap-3 text-center sm:mb-10 sm:gap-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
            Išskirtiniai produktai
          </h2>
          <p className="mx-auto max-w-md text-xs text-muted-foreground sm:text-sm">
            Populiariausi ir rekomenduojami produktai
          </p>
          <Link
            href="/products"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-primary transition-colors hover:text-sky-400 sm:text-lg sm:min-h-14 sm:px-6 sm:py-3.5"
          >
            Visi produktai
            <ArrowRight className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
          </Link>
        </div>

        <ul className="grid-fluid-products w-full list-none">
          {featuredProducts.map((product) => (
            <li key={product.id} className="flex min-h-0 min-w-0">
              <ProductCard
                name={product.name}
                slug={product.slug}
                price={Number(product.price)}
                brand={product.brand}
                image={product.images[0]?.url ?? null}
                category={product.category.name}
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
