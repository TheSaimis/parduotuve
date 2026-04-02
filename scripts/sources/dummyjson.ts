import type { ProductSourceAdapter, UnifiedProduct } from "./types";

export function createDummyJsonAdapter(baseUrl: string): ProductSourceAdapter {
  return {
    name: "dummyjson",
    fetchProducts: async () => {
      const res = await fetch(`${baseUrl}/products?limit=0`);
      if (!res.ok) throw new Error(`DummyJSON failed: ${res.status}`);
      const data = await res.json();
      const products: UnifiedProduct[] = [];

      for (const p of data.products ?? []) {
        const imgs: string[] = [];
        if (Array.isArray(p.images)) {
          for (const img of p.images) {
            if (typeof img === "string" && img.startsWith("http")) imgs.push(img);
          }
        }
        if (p.thumbnail && typeof p.thumbnail === "string" && p.thumbnail.startsWith("http")) {
          if (!imgs.includes(p.thumbnail)) imgs.push(p.thumbnail);
        }
        if (imgs.length === 0) continue;

        const specs: Record<string, unknown> = {};
        if (p.sku) specs.sku = p.sku;
        if (p.weight != null) specs.svoris_kg = p.weight;
        if (p.dimensions) {
          specs.matmenys_cm = `${p.dimensions.width} × ${p.dimensions.height} × ${p.dimensions.depth}`;
        }
        if (p.warrantyInformation) specs.garantija = p.warrantyInformation;
        if (p.shippingInformation) specs.pristatymas = p.shippingInformation;
        if (p.tags?.length) specs.zymos = p.tags.join(", ");
        if (p.brand) specs.gamintojas = p.brand;

        products.push({
          title: p.title,
          description: p.description || "",
          price: p.price,
          category: p.category,
          brand: p.brand || undefined,
          stock: p.stock ?? Math.floor(Math.random() * 50) + 5,
          images: imgs,
          specs,
          source: "dummyjson",
        });
      }

      return products;
    },
  };
}

