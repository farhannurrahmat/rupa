import { requireRole } from "@/lib/auth";
import DashShell from "@/components/layout/DashShell";

const LINKS = [
  { href: "/member", label: "Ringkasan", exact: true },
  { href: "/member/artworks", label: "Karya saya" },
  { href: "/member/favorites", label: "Favorit" },
  { href: "/member/submissions", label: "Submisi challenge" },
  { href: "/member/profile", label: "Profil dan akun" },
];

export default async function MemberLayout({ children }) {
  const user = await requireRole("member");
  return <DashShell area="Member" user={user} links={LINKS}>{children}</DashShell>;
}