export type UnifiedProduct = {
  title: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  stock: number;
  images: string[];
  specs: Record<string, unknown>;
  source: string;
};

export type ProductSourceAdapter = {
  name: string;
  fetchProducts: () => Promise<UnifiedProduct[]>;
};

