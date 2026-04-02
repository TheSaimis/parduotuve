import type { ProductSourceAdapter, UnifiedProduct } from "./types";

type CreateArgs = {
  baseUrl: string;
  slugify: (input: string) => string;
};

const FAKESTORE_CAT_MAP: Record<string, string> = {
  electronics: "electronics",
  jewelery: "jewelery",
  "men's clothing": "mens-clothing",
  "women's clothing": "womens-clothing",
};

export function createFakeStoreAdapter({ baseUrl, slugify }: CreateArgs): ProductSourceAdapter {
  return {
    name: "fakestore",
    fetchProducts: async () => {
      let res: Response;
      try {
        res = await fetch(`${baseUrl}/products`);
      } catch (e) {
        console.warn(
          `  ⚠ FakeStoreAPI: ryšio klaida — praleidžiama (${e instanceof Error ? e.message : e})`,
        );
        return [];
      }
      if (!res.ok) {
        console.warn(
          `  ⚠ FakeStoreAPI: HTTP ${res.status} — praleidžiama, lieka tik DummyJSON`,
        );
        return [];
      }
      const data = await res.json();
      const products: UnifiedProduct[] = [];

      for (const p of data) {
        if (!p.image || typeof p.image !== "string" || !p.image.startsWith("http")) continue;
        const catKey = FAKESTORE_CAT_MAP[p.category] ?? slugify(p.category);

        products.push({
          title: p.title,
          description: p.description || "",
          price: p.price,
          category: catKey,
          brand: undefined,
          stock: Math.floor(Math.random() * 80) + 10,
          images: [p.image],
          specs: p.rating
            ? { reitingas: `${p.rating.rate}/5 (${p.rating.count} atsiliepimai)` }
            : {},
          source: "fakestore",
        });
      }

      return products;
    },
  };
}

