import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/home/ProductCard";
import CategoryCard from "@/components/home/CategoryCard";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!category) return { title: "Kategorija nerasta" };
  return {
    title: `${category.name} | TechShop`,
    description: category.description ?? undefined,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          images: { take: 1 },
          category: { select: { name: true } },
        },
        orderBy: { name: "asc" },
      },
      _count: { select: { products: true } },
    },
  });

  if (!category) notFound();

  const allCategories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

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
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{category.description}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          {category._count.products} produktai
        </p>
      </div>

      <section className="mb-8 sm:mb-12">
        <h2 className="mb-3 text-base font-semibold text-foreground sm:mb-4 sm:text-lg">
          Kitos kategorijos
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {allCategories
            .filter((c) => c.slug !== slug)
            .map((cat) => (
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
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            Produktai
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Visi produktai
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {category.products.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-muted/30 py-10 text-center text-sm text-muted-foreground sm:py-12 sm:text-base">
            Šioje kategorijoje produktų nėra.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {category.products.map((product) => (
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
