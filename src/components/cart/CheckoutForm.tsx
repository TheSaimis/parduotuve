"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { emitCartChanged, submitCheckout } from "@/lib/cart/client";
import { SHOP_ROUTES } from "@/lib/cart/constants";

export default function CheckoutForm({
  successContinueHref = "/products",
  cartHref = SHOP_ROUTES.cart,
}: {
  successContinueHref?: string;
  cartHref?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "card" | "cash">(
    "bank_transfer",
  );
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [doneId, setDoneId] = useState<number | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await submitCheckout({
        name,
        email,
        address,
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        postalCode: postalCode.trim() || undefined,
        paymentMethod,
        notes: notes.trim() || undefined,
      });
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
          onClick={() => router.push(successContinueHref)}
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Tęsti apsipirkimą
        </button>
        <p className="mt-4">
          <button
            type="button"
            onClick={() => router.push(cartHref)}
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
        <label htmlFor="co-phone" className="text-sm font-medium">
          Telefonas
        </label>
        <input
          id="co-phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field w-full"
          autoComplete="tel"
          placeholder="+370..."
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="co-city" className="text-sm font-medium">
            Miestas
          </label>
          <input
            id="co-city"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input-field w-full"
            autoComplete="address-level2"
            placeholder="Vilnius"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="co-postal" className="text-sm font-medium">
            Pašto kodas
          </label>
          <input
            id="co-postal"
            name="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="input-field w-full"
            autoComplete="postal-code"
            placeholder="LT-00000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="co-pay" className="text-sm font-medium">
          Apmokėjimo būdas
        </label>
        <select
          id="co-pay"
          name="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
          className="input-field w-full"
        >
          <option value="bank_transfer">Bankinis pavedimas</option>
          <option value="card">Kortele (demo)</option>
          <option value="cash">Grynais pristatymo metu (demo)</option>
        </select>
        {paymentMethod === "bank_transfer" ? (
          <div className="rounded-xl border border-border/70 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
            <div className="font-medium text-foreground">Mokėjimo duomenys</div>
            <div className="mt-1 grid gap-1">
              <div>
                <span className="font-medium text-foreground">Gavėjas:</span>{" "}
                Vitrina (demo)
              </div>
              <div>
                <span className="font-medium text-foreground">IBAN:</span>{" "}
                LT12 1234 1234 1234 1234
              </div>
              <div>
                <span className="font-medium text-foreground">Paskirtis:</span>{" "}
                Užsakymas bus suformuotas, o apmokėjimą suderinsime el. paštu.
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="co-notes" className="text-sm font-medium">
          Pastabos (nebūtina)
        </label>
        <textarea
          id="co-notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-field min-h-[4.5rem] w-full resize-y"
          placeholder="Pvz., kodas laiptinėje, patogus pristatymo laikas..."
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
