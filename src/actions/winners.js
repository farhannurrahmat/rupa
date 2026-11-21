"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { CHALLENGE_STATUS_SQL } from "@/lib/sql";

export async function submitArtworkAction(prevState, formData) {
  const user = await requireRole("member"); // wajib di baris pertama

  const challengeId = Number(formData.get("challengeId"));
  const artworkId = Number(formData.get("artworkId"));
  if (!Number.isInteger(challengeId) || !Number.isInteger(artworkId)) {
    return { error: "Pilih karya yang akan disubmit." };
  }

  try {
    // Validasi waktu dan kepemilikan karya ada di dalam query itu sendiri
    const result = await query(
      `INSERT INTO challenge_submissions (challenge_id, artwork_id, user_id)
       SELECT c.id, $2::int, $3::int
       FROM challenges c
       WHERE c.id = $1
         AND NOW() >= c.start_date AND NOW() <= c.end_date
         AND EXISTS (SELECT 1 FROM artworks a WHERE a.id = $2::int AND a.user_id = $3::int)`,
      [challengeId, artworkId, user.id]
    );

    if (result.rowCount === 0) {
      // Tidak ada baris yang masuk: cari tahu alasannya untuk pesan yang jelas
      const info = await query(
        `SELECT ${CHALLENGE_STATUS_SQL} AS status FROM challenges c WHERE c.id = $1`,
        [challengeId]
      );
      const status = info.rows[0]?.status;
      if (!status) return { error: "Challenge tidak ditemukan." };
      if (status === "upcoming") return { error: "Challenge belum dimulai." };
      if (status === "ended") return { error: "Challenge sudah berakhir." };
      return { error: "Karya tidak valid." };
    }
  } catch (err) {
    // 23505 = pelanggaran UNIQUE: sudah pernah submit ke challenge ini
    if (err.code === "23505") return { error: "Kamu sudah mengirim karya ke challenge ini." };
    throw err;
  }

  revalidatePath(`/challenges/${challengeId}`);
  revalidatePath("/member/submissions");
  return { success: true };
}

// Menarik submisi; formulir ini memakai kolom "id" untuk id challenge
export async function withdrawSubmissionAction(formData) {
  const user = await requireRole("member");

  const challengeId = Number(formData.get("id"));
  if (!Number.isInteger(challengeId)) return;

  // Hanya terhapus kalau milik Member ini DAN challenge belum berakhir
  await query(
    `DELETE FROM challenge_submissions s
     USING challenges c
     WHERE s.challenge_id = c.id
       AND c.id = $1 AND s.user_id = $2
       AND NOW() <= c.end_date`,
    [challengeId, user.id]
  );

  revalidatePath(`/challenges/${challengeId}`);
  revalidatePath("/member/submissions");
}