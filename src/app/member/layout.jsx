import { requireRole } from "@/lib/auth";

export default async function MemberLayout({ children }) {
  await requireRole("member");
  return children;
}