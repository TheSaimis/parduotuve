"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-destructive/35 hover:bg-destructive/5 hover:text-destructive disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4 shrink-0" />
      )}
      Atsijungti
    </button>
  );
}
