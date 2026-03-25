import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/home/ProductCard";
import CategoryCard from "@/components/home/CategoryCard";
import Pagination from "@/components/ui/Pagination";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PER_PAGE = 20;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true, parent: { select: { name: true } } },
  });
  if (!category) return { title: "Kategorija nerasta" };
  const prefix = category.parent ? `${category.parent.name} → ` : "";
  return {
    title: `${prefix}${category.name} | Vitrina`,
    description: category.description ?? undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      parent: { select: { name: true, slug: true } },
      children: {
        include: {
          _count: { select: { products: true } },
        },
        orderBy: { name: "asc" },
      },
      _count: { select: { products: true } },
    },
  });

  if (!category) notFound();

  const isParent = category.children.length > 0;

  if (isParent) {
    // This is a catalog — show subcategories
    const totalProducts = category.children.reduce((sum, c) => sum + c._count.products, 0);

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
              {category.name}
            </h1>
            {category.description && (
              <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                {category.description}
              </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              {category.children.length} subkategorijos · {totalProducts} prekės
            </p>
          </div>
        </div>

        <section>
          <h2 className="mb-5 text-center text-lg font-semibold tracking-tight text-foreground sm:mb-6 sm:text-xl">
            Subkategorijos
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
            {category.children.map((sub) => (
              <CategoryCard
                key={sub.id}
                name={sub.name}
                slug={sub.slug}
                productCount={sub._count.products}
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  // This is a subcategory — show products with pagination
  const totalProducts = category._count.products;
  const totalPages = Math.ceil(totalProducts / PER_PAGE);
  const skip = (page - 1) * PER_PAGE;

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: {
      images: { take: 1 },
      category: { select: { name: true } },
    },
    orderBy: { name: "asc" },
    skip,
    take: PER_PAGE,
  });

  // Sibling subcategories (from same parent)
  const siblings = category.parent
    ? await prisma.category.findMany({
        where: { parentId: category.parent ? (await prisma.category.findUnique({ where: { slug: category.parent.slug } }))?.id : null, slug: { not: slug } },
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      })
    : [];

  return (
    <div className="page-container py-8 sm:py-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-muted-foreground sm:mb-8">
        <Link href="/" className="transition-colors hover:text-primary">
          Pagrindinis
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
        {category.parent && (
          <>
            <Link
              href={`/categories/${category.parent.slug}`}
              className="transition-colors hover:text-primary"
            >
              {category.parent.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
          </>
        )}
        <span className="font-medium text-foreground">{category.name}</span>
      </div>

      <div className="mb-10 text-center sm:mb-12">
        <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-accent" aria-hidden />
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {category.description}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
          {totalProducts} {totalProducts === 1 ? "prekė" : "prekės"}
          {totalPages > 1 && ` · Puslapis ${page} iš ${totalPages}`}
        </p>
      </div>

      {/* Sibling subcategories */}
      {siblings.length > 0 && (
        <section className="mb-10 sm:mb-14">
          <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:mb-5">
            Kitos subkategorijos
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
            {siblings.map((sub) => (
              <CategoryCard
                key={sub.id}
                name={sub.name}
                slug={sub.slug}
                productCount={sub._count.products}
              />
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section>
        <h2 className="mb-5 text-center text-lg font-semibold tracking-tight text-foreground sm:mb-6 sm:text-xl">
          Prekės
        </h2>

        {products.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/80 bg-muted/25 py-14 text-center text-sm text-muted-foreground shadow-inner sm:py-16 sm:text-base">
            Šioje kategorijoje prekių nėra.
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
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/categories/${slug}`}
            />
          </>
        )}
      </section>
    </div>
  );
}
