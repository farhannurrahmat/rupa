import { requireRole } from "@/lib/auth";

export default async function CuratorDashboardLayout({ children }) {
  await requireRole("curator");
  return children;
}