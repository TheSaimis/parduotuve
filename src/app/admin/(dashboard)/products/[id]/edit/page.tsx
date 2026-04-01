import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { images: { take: 1 } },
  });

  if (!product) notFound();

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-9 text-center">
        <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-accent" aria-hidden />
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Redaguoti produktą
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      </div>

      <div className="card-elevated p-6 text-left sm:p-8">
        <ProductForm
          categories={categories}
          initialData={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: Number(product.price),
            stock: product.stock,
            brand: product.brand,
            featured: product.featured,
            categoryId: product.categoryId,
            imageUrl: product.images[0]?.url,
          }}
        />
      </div>
    </div>
  );
}
