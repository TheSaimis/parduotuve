import type { Metadata } from "next";
import MobileProviders from "@/components/mobile/MobileProviders";
import MobileNav from "@/components/mobile/MobileNav";

export const metadata: Metadata = {
  title: "Vitrina Mobile",
  description: "Mobilioji parduotuvės sąsaja (demo).",
};

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileProviders>
      <div className="min-h-screen w-full bg-background">
        <main className="mx-auto w-full max-w-md px-4 pb-24 pt-5">{children}</main>
        <MobileNav />
      </div>
    </MobileProviders>
  );
}

