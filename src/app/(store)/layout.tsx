import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col items-stretch">
      <Navbar />
      <main className="relative w-full min-w-0 flex-1 overflow-x-clip">{children}</main>
      <Footer />
    </div>
  );
}
