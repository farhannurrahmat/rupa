import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

// Memastikan pengguna login dengan peran yang benar, kalau tidak langsung dialihkan
export async function requireRole(role) {
  const user = await getSession();

  if (!user) redirect("/login");
  if (user.role !== role) redirect("/");

  // Curator hanya boleh masuk dashboard setelah disetujui Admin
  if (role === "curator" && user.curator_status !== "approved") {
    redirect("/curator/pending");
  }

  return user;
}