import { requireRole } from "@/lib/auth";
import DashShell from "@/components/layout/DashShell";

const LINKS = [
  { href: "/admin", label: "Statistik", exact: true },
  { href: "/admin/curators", label: "Verifikasi Curator" },
  { href: "/admin/users", label: "Pengguna" },
  { href: "/admin/categories", label: "Kategori" },
  { href: "/admin/moderation", label: "Moderasi" },
];

export default async function AdminLayout({ children }) {
  const user = await requireRole("admin");
  return <DashShell area="Admin" user={user} links={LINKS}>{children}</DashShell>;
}