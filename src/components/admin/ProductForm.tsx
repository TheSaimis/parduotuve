"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save, Loader2 } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: number;
    name: string;
    description: string | null;
    price: string | number;
    stock: number;
    brand: string | null;
    featured: boolean;
    categoryId: number;
    imageUrl?: string;
  };
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      stock: formData.get("stock"),
      brand: formData.get("brand"),
      featured: formData.get("featured") === "on",
      categoryId: formData.get("categoryId"),
      imageUrl: formData.get("imageUrl"),
    };

    try {
      const url = isEdit ? `/api/products/${initialData.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Klaida išsaugant produktą");
      }
    } catch {
      setError("Tinklo klaida");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Pavadinimas *
          </label>
          <input
            name="name"
            required
            defaultValue={initialData?.name}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
            placeholder="pvz. AMD Ryzen 7 7800X3D"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Kategorija *
          </label>
          <select
            name="categoryId"
            required
            defaultValue={initialData?.categoryId}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
          >
            <option value="">Pasirinkite kategoriją</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Kaina (EUR) *
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={initialData ? Number(initialData.price) : ""}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Sandėlyje (vnt.)
          </label>
          <input
            name="stock"
            type="number"
            defaultValue={initialData?.stock ?? 0}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
            placeholder="0"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Gamintojas
          </label>
          <input
            name="brand"
            defaultValue={initialData?.brand ?? ""}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
            placeholder="pvz. AMD, Intel, NVIDIA"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Nuotraukos URL
          </label>
          <input
            name="imageUrl"
            defaultValue={initialData?.imageUrl ?? ""}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Aprašymas
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialData?.description ?? ""}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
          placeholder="Produkto aprašymas..."
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="featured"
          id="featured"
          defaultChecked={initialData?.featured}
          className="h-4 w-4 rounded border-border accent-primary"
        />
        <label htmlFor="featured" className="text-sm font-medium text-foreground">
          Išskirtinis produktas (rodomas pagrindiniame puslapyje)
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isEdit ? "Atnaujinti" : "Sukurti"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Atšaukti
        </button>
      </div>
    </form>
  );
}
