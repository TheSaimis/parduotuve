import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus, Package, Pencil } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true } },
      images: { take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-9 flex flex-col items-center gap-5 text-center">
        <div>
          <div className="mx-auto mb-2 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-accent" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Produktai</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} produktų iš viso</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Naujas produktas
        </Link>
      </div>

      <div className="card-elevated overflow-hidden text-left">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/70 bg-muted/15 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3.5 font-medium">Produktas</th>
                <th className="px-6 py-3.5 font-medium">Kategorija</th>
                <th className="px-6 py-3.5 font-medium">Kaina</th>
                <th className="px-6 py-3.5 font-medium">Sandėlyje</th>
                <th className="px-6 py-3.5 font-medium">Išskirtinis</th>
                <th className="px-6 py-3.5 font-medium">Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/25"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/80 ring-1 ring-border/50">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.brand}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {product.category.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    {formatPrice(Number(product.price))}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-medium ${
                        product.stock > 10
                          ? "text-green-500"
                          : product.stock > 0
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.featured ? (
                      <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        Taip
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Ne</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
