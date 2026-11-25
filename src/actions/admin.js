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
  if (!Number.isInteger(id) || id === admin.id) return;

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

  // Karya, challenge, like, komentar, dan sesinya ikut terhapus (cascade)
  await query("DELETE FROM users WHERE id = $1 AND role IN ('member', 'curator')", [id]);

  for (const file of files.rows) await deleteImage(file.url);
  if (target.rows[0].avatar_url) await deleteImage(target.rows[0].avatar_url);

  revalidatePath("/admin/users");
}

// Dismiss: semua laporan yang belum diproses untuk karya itu ditolak
export async function dismissReportsAction(formData) {
  await requireRole("admin");

  const artworkId = Number(formData.get("id"));
  if (!Number.isInteger(artworkId)) return;

  await query(
    "UPDATE artwork_reports SET status = 'dismissed' WHERE artwork_id = $1 AND status = 'pending'",
    [artworkId]
  );
  revalidatePath("/admin/moderation");
  revalidatePath("/admin");
}

// Take Down: karya dihapus (laporan ikut terhapus lewat cascade)
export async function takeDownArtworkAction(formData) {
  await requireRole("admin");

  const artworkId = Number(formData.get("id"));
  if (!Number.isInteger(artworkId)) return;

  // Hanya karya yang memang punya laporan pending yang bisa di-take down
  const { rows } = await query(
    `DELETE FROM artworks
     WHERE id = $1
       AND EXISTS (SELECT 1 FROM artwork_reports WHERE artwork_id = $1 AND status = 'pending')
     RETURNING file_url`,
    [artworkId]
  );
  if (rows.length > 0) await deleteImage(rows[0].file_url);

  revalidatePath("/admin/moderation");
  revalidatePath("/admin");
  revalidatePath("/");
}