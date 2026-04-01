import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getVerifiedAdminUser } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getVerifiedAdminUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar adminName={user.name} adminEmail={user.email} />
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
