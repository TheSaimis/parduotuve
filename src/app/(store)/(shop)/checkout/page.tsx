import ShopFlowShell from "@/components/cart/ShopFlowShell";
import CheckoutForm from "@/components/cart/CheckoutForm";
import { getCartLines } from "@/lib/cart/cookie";
import { SHOP_ROUTES } from "@/lib/cart/constants";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Apmokėjimas | Vitrina",
};

export default async function CheckoutPage() {
  const cart = await getCartLines();
  if (cart.length === 0) {
    redirect(SHOP_ROUTES.cart);
  }

  return (
    <div className="flex w-full min-h-[calc(100dvh-12rem)] items-center justify-center">
      <ShopFlowShell
        title="Pristatymo duomenys"
        description="Užpildykite formą — užsakymas bus išsaugotas, krepšelis išvalytas."
        crumbs={[
          { label: "Pagrindinis", href: "/" },
          { label: "Krepšelis", href: SHOP_ROUTES.cart },
          { label: "Apmokėjimas" },
        ]}
        maxWidth="lg"
        centered
      >
        <div className="card-elevated border border-border/80 p-6 sm:p-8">
          <CheckoutForm />
        </div>
      </ShopFlowShell>
    </div>
  );
}
