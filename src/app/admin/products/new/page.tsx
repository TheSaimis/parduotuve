import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Naujas produktas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Užpildykite informaciją apie naują produktą
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
