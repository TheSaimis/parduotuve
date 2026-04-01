"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { emitCartChanged, submitCheckout } from "@/lib/cart/client";
import { SHOP_ROUTES } from "@/lib/cart/constants";

export default function CheckoutForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [doneId, setDoneId] = useState<number | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await submitCheckout({ name, email, address });
      if (!result.ok) {
        setError(result.error ?? "Nepavyko pateikti užsakymo.");
        return;
      }
      emitCartChanged();
      setDoneId(typeof result.orderId === "number" ? result.orderId : null);
      router.refresh();
    } catch {
      setError("Ryšio klaida.");
    } finally {
      setLoading(false);
    }
  }

  if (doneId !== null) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/10 p-6 text-center ring-1 ring-success/20">
        <CheckCircle className="mx-auto h-12 w-12 text-success" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Užsakymas #{doneId} priimtas
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Netrukus susisieksime el. paštu. Krepšelis ištuštintas.
        </p>
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Tęsti apsipirkimą
        </button>
        <p className="mt-4">
          <button
            type="button"
            onClick={() => router.push(SHOP_ROUTES.cart)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Atgal į krepšelį
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="space-y-2">
        <label htmlFor="co-name" className="text-sm font-medium">
          Vardas ir pavardė
        </label>
        <input
          id="co-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field w-full"
          autoComplete="name"
          required
          minLength={2}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="co-email" className="text-sm font-medium">
          El. paštas
        </label>
        <input
          id="co-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field w-full"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="co-address" className="text-sm font-medium">
          Pristatymo adresas
        </label>
        <textarea
          id="co-address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input-field min-h-[6rem] w-full resize-y"
          autoComplete="street-address"
          required
          minLength={8}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Siunčiama…
          </>
        ) : (
          "Patvirtinti užsakymą"
        )}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        Užsakymas susiejamas su el. paštu: jei tokios paskyros dar nėra, sistemoje
        automatiškai sukuriama kliento paskyra (vartotojas negali prisijungti, kol
        nebus nustatytas slaptažodis — tai galima padaryti vėliau per administravimą).
      </p>
    </form>
  );
}
