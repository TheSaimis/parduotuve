/** Viena krepšelio eilutė (iš GET /api/cart). */
export type CartLineDto = {
  productId: number;
  qty: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image: string | null;
};

export type CartSnapshot = {
  lines: CartLineDto[];
  itemCount: number;
  subtotal: number;
};

export type CheckoutPayload = {
  name: string;
  email: string;
  address: string;
};
