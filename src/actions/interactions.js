"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { REPORT_REASONS } from "@/lib/constants";

async function artworkExists(id) {
  const { rows } = await query("SELECT 1 FROM artworks WHERE id = $1", [id]);
  return rows.length > 0;
}

export async function toggleLikeAction(formData) {
  const user = await requireRole("member");
  const artworkId = Number(formData.get("artworkId"));
  if (!Number.isInteger(artworkId) || !(await artworkExists(artworkId))) return;

  const removed = await query(
    "DELETE FROM likes WHERE user_id = $1 AND artwork_id = $2",
    [user.id, artworkId]
  );
  if (removed.rowCount === 0) {
    await query(
      "INSERT INTO likes (user_id, artwork_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [user.id, artworkId]
    );
  }

  revalidatePath(`/artworks/${artworkId}`);
  revalidatePath("/");
}

export async function toggleFavoriteAction(formData) {
  const user = await requireRole("member");
  const artworkId = Number(formData.get("artworkId"));
  if (!Number.isInteger(artworkId) || !(await artworkExists(artworkId))) return;

  const removed = await query(
    "DELETE FROM favorites WHERE user_id = $1 AND artwork_id = $2",
    [user.id, artworkId]
  );
  if (removed.rowCount === 0) {
    await query(
      "INSERT INTO favorites (user_id, artwork_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [user.id, artworkId]
    );
  }

  revalidatePath(`/artworks/${artworkId}`);
  revalidatePath("/member/favorites"); 
  revalidatePath("/");
}

export async function addCommentAction(prevState, formData) {
  const user = await requireRole("member");
  const artworkId = Number(formData.get("artworkId"));
  const content = String(formData.get("content") ?? "").trim();

  if (!Number.isInteger(artworkId) || !(await artworkExists(artworkId))) {
    return { error: "Karya tidak ditemukan." };
  }
  if (content.length < 1) return { error: "Komentar tidak boleh kosong." };
  if (content.length > 500) return { error: "Komentar maksimal 500 karakter." };

  await query(
    "INSERT INTO comments (artwork_id, user_id, content) VALUES ($1, $2, $3)",
    [artworkId, user.id, content]
  );

  revalidatePath(`/artworks/${artworkId}`);
  return { success: true };
}

export async function deleteCommentAction(formData) {
  const user = await requireRole("member");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  // hanya pemilik komentar yang bisa menghapus
  const { rows } = await query(
    "DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING artwork_id",
    [id, user.id]
  );
  if (rows.length > 0) revalidatePath(`/artworks/${rows[0].artwork_id}`);
}

export async function reportArtworkAction(prevState, formData) {
  const user = await requireRole("member");
  const artworkId = Number(formData.get("artworkId"));
  const reason = String(formData.get("reason") ?? "");

  if (!Number.isInteger(artworkId)) return { error: "Karya tidak valid." };
  if (!REPORT_REASONS.includes(reason)) return { error: "Pilih alasan laporan." };

  const artwork = await query("SELECT user_id FROM artworks WHERE id = $1", [artworkId]);
  if (artwork.rows.length === 0) return { error: "Karya tidak ditemukan." };
  if (artwork.rows[0].user_id === user.id) {
    return { error: "Kamu tidak dapat melaporkan karyamu sendiri." };
  }

  try {
    await query(
      "INSERT INTO artwork_reports (artwork_id, reporter_id, reason) VALUES ($1, $2, $3)",
      [artworkId, user.id, reason]
    );
  } catch (err) {
    // 23505 = pelanggaran unique
    if (err.code === "23505") return { error: "Kamu sudah melaporkan karya ini." };
    throw err;
  }

  revalidatePath(`/artworks/${artworkId}`);
  return { success: true };
}