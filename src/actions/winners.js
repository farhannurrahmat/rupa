"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function setPlacementAction(prevState, formData) {
  const user = await requireRole("curator"); // wajib di baris pertama

  const submissionId = Number(formData.get("submissionId"));
  const rawPlacement = String(formData.get("placement") ?? "").trim();
  const placement = rawPlacement === "" ? null : Number(rawPlacement);

  if (!Number.isInteger(submissionId)) {
    return { error: "Submisi tidak valid." };
  }
  if (placement !== null && ![1, 2, 3].includes(placement)) {
    return { error: "Peringkat hanya boleh Juara 1, 2, atau 3." };
  }

  try {
    // Kepemilikan challenge dan waktu berakhir (NOW() > end_date) divalidasi di SQL
    const result = await query(
      `UPDATE challenge_submissions s
       SET placement = $1
       FROM challenges c
       WHERE s.challenge_id = c.id
         AND s.id = $2
         AND c.curator_id = $3
         AND NOW() > c.end_date
       RETURNING c.id AS challenge_id`,
      [placement, submissionId, user.id]
    );

    if (result.rowCount === 0) {
      return { error: "Pemenang hanya bisa dipilih oleh Curator pemilik setelah challenge berakhir." };
    }

    const challengeId = result.rows[0].challenge_id;
    revalidatePath(`/curator/challenges/${challengeId}/submissions`);
    revalidatePath(`/challenges/${challengeId}`);
    return { success: true };
  } catch (err) {
    // 23505 = pelanggaran UNIQUE (challenge_id, placement)
    if (err.code === "23505") {
      return { error: `Juara ${placement} sudah dipilih untuk karya lain di challenge ini.` };
    }
    throw err;
  }
}