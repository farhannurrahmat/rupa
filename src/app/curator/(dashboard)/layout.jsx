import { requireRole } from "@/lib/auth";
import DashShell from "@/components/layout/DashShell";

const LINKS = [{ href: "/curator/challenges", label: "Challenge saya" }];

export default async function CuratorDashboardLayout({ children }) {
  const user = await requireRole("curator");
  return <DashShell area="Curator" user={user} links={LINKS}>{children}</DashShell>;
}