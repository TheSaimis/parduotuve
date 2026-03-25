import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-9 text-center">
        <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-accent" aria-hidden />
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Naujas produktas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Užpildykite informaciją apie naują produktą
        </p>
      </div>

      <div className="card-elevated p-6 text-left sm:p-8">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
