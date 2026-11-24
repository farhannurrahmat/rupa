import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export default async function CuratorIndexPage() {
  await requireRole("curator");
  redirect("/curator/challenges");
} 