import CartView from "@/components/cart/CartView";
import ShopFlowShell from "@/components/cart/ShopFlowShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Krepšelis | Vitrina",
};

export default function CartPage() {
  return (
    <ShopFlowShell
      title="Krepšelis"
      description="Prekės saugomos naršyklės slapuke (httpOnly, pasirašytas) — išlieka po perkrovimo, kol užbaigsite užsakymą arba išvalysite."
      crumbs={[
        { label: "Pagrindinis", href: "/" },
        { label: "Krepšelis" },
      ]}
      maxWidth="3xl"
      centered
    >
      <CartView />
    </ShopFlowShell>
  );
}
