import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="relative flex min-h-screen flex-1 flex-col overflow-auto">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
        >
          <div className="absolute right-0 top-0 h-[min(50vh,28rem)] w-[min(90vw,36rem)] rounded-full bg-primary/5 blur-[100px]" />
        </div>
        <div className="relative mx-auto w-full max-w-5xl p-5 sm:p-7 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
