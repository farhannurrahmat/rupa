import { requireRole } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }) {
  await requireRole("admin");
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <AdminNav />
      {children}
    </div>
  );
}