import CheckoutForm from "@/components/cart/CheckoutForm";
import { getCartLines } from "@/lib/cart/cookie";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MobileCheckoutPage() {
  const cart = await getCartLines();
  if (cart.length === 0) {
    redirect("/m/cart");
  }

  return (
    <div className="space-y-4">
      <header className="text-center">
        <h1 className="text-lg font-bold tracking-tight">Checkout (Mobile)</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Atskira mobilioji checkout forma.
        </p>
      </header>

      <div className="card-elevated border border-border/80 p-5">
        <CheckoutForm successContinueHref="/m/products" cartHref="/m/cart" />
      </div>
    </div>
  );
}

