import { requireRole } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";

export default async function MemberLayout({ children }) {
  await requireRole("member");
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      {children}
    </div>
  );
}