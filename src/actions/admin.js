"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { deleteImage } from "@/lib/upload";

// Hanya Curator berstatus pending yang bisa diproses
async function setCuratorStatus(formData, status) {
  await requireRole("admin");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await query(
    `UPDATE users SET curator_status = $1
     WHERE id = $2 AND role = 'curator' AND curator_status = 'pending'`,
    [status, id]
  );
  revalidatePath("/admin/curators");
}

export async function approveCuratorAction(formData) {
  await setCuratorStatus(formData, "approved");
}

export async function rejectCuratorAction(formData) {
  await setCuratorStatus(formData, "rejected");
}

export async function deleteUserAction(formData) {
  const admin = await requireRole("admin");

  const id = Number(formData.get("id"));
  // Admin tidak boleh menghapus dirinya sendiri
  if (!Number.isInteger(id) || id === admin.id) return;

  // Hanya Member dan Curator yang boleh dihapus, Admin lain tidak
  const target = await query(
    "SELECT avatar_url FROM users WHERE id = $1 AND role IN ('member', 'curator')",
    [id]
  );
  if (target.rows.length === 0) return;

  // Catat file milik pengguna ini sebelum barisnya hilang
  const files = await query(
    `SELECT file_url AS url FROM artworks WHERE user_id = $1
     UNION ALL
     SELECT banner_url FROM challenges WHERE curator_id = $1`,
    [id]
  );

  // Karya, challenge, like, komentar, dan sesinya ikut terhapus (CASCADE)
  await query("DELETE FROM users WHERE id = $1 AND role IN ('member', 'curator')", [id]);

  for (const file of files.rows) await deleteImage(file.url);
  if (target.rows[0].avatar_url) await deleteImage(target.rows[0].avatar_url);

  revalidatePath("/admin/users");
}