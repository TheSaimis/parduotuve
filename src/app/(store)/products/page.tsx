import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/home/ProductCard";
import CategoryCard from "@/components/home/CategoryCard";
import Pagination from "@/components/ui/Pagination";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const PER_PAGE = 20;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export const metadata = {
  title: "Visi produktai | Vitrina",
  description: "Platus prekių pasirinkimas",
};

export default async function ProductsPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);

  const totalProducts = await prisma.product.count();
  const totalPages = Math.ceil(totalProducts / PER_PAGE);
  const skip = (page - 1) * PER_PAGE;

  const [products, subcategories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: { select: { name: true } },
        images: { take: 1 },
      },
      orderBy: { name: "asc" },
      skip,
      take: PER_PAGE,
    }),
    prisma.category.findMany({
      where: { parentId: { not: null } },
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="page-container py-8 sm:py-10">
      <div className="text-center">
        <Link
          href="/"
          className="mb-8 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:mb-10"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          Atgal į pagrindinį
        </Link>

        <div className="mb-10 sm:mb-12">
          <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-accent" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Visi produktai
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {totalProducts} prekės
            {totalPages > 1 && ` · Puslapis ${page} iš ${totalPages}`}
          </p>
        </div>
      </div>

      <section className="mb-10 sm:mb-14">
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:mb-5 sm:text-xs">
          Kategorijos
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {subcategories.map((cat) => (
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
        <h2 className="mb-5 text-center text-lg font-semibold tracking-tight text-foreground sm:mb-6 sm:text-xl">
          Prekės
        </h2>
        {products.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/80 bg-muted/25 py-14 text-center text-sm text-muted-foreground shadow-inner sm:py-16 sm:text-base">
            Prekių nėra.
          </p>
        ) : (
          <>
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
            <Pagination currentPage={page} totalPages={totalPages} basePath="/products" />
          </>
        )}
      </section>
    </div>
  );
}
