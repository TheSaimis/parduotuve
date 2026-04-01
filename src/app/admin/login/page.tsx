import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import { getVerifiedAdminUser } from "@/lib/admin-session";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const user = await getVerifiedAdminUser();
  if (user) {
    redirect("/admin");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
      >
        <div className="absolute left-1/2 top-0 h-[min(60vh,32rem)] w-[min(100vw,40rem)] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            href="/"
            className="group mb-6 flex items-center gap-2.5 text-xl font-bold tracking-tight"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-accent/20 ring-1 ring-primary/30 transition-transform group-hover:scale-[1.02]">
              <ShoppingBag className="h-[1.2rem] w-[1.2rem] text-primary" />
            </span>
            <span className="bg-gradient-to-r from-primary via-sky-400 to-accent bg-clip-text text-transparent">
              Vitrina
            </span>
          </Link>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Administratoriaus prisijungimas
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Įeikite į skydelį
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Prieiga tik paskyroms su administratoriaus role. Parduotuvės lankytojai
            čia prisijungti negali.
          </p>
        </div>

        <div className="card-elevated border border-border/80 p-6 sm:p-8">
          <AdminLoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-primary hover:underline">
            ← Grįžti į parduotuvę
          </Link>
        </p>
      </div>
    </div>
  );
}
