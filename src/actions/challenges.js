"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { validateImage, saveImage, deleteImage } from "@/lib/upload";

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function readInput(formData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    rules: String(formData.get("rules") ?? "").trim(),
    prize: String(formData.get("prize") ?? "").trim(),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
  };
}

function validateChallenge(input) {
  const errors = {};
  if (input.title.length < 3 || input.title.length > 150) errors.title = "Judul 3 sampai 150 karakter.";
  if (input.description.length < 10) errors.description = "Deskripsi minimal 10 karakter.";
  if (input.rules.length < 10) errors.rules = "Aturan minimal 10 karakter.";
  if (input.prize.length < 2) errors.prize = "Hadiah wajib diisi.";

  if (!DATE_FORMAT.test(input.startDate)) errors.startDate = "Tanggal mulai wajib diisi.";
  if (!DATE_FORMAT.test(input.endDate)) errors.endDate = "Tanggal selesai wajib diisi.";

  if (!errors.startDate && !errors.endDate && input.endDate <= input.startDate) {
    errors.endDate = "Tanggal selesai harus setelah tanggal mulai.";
  }
  return errors;
}

export async function createChallengeAction(prevState, formData) {
  const user = await requireRole("curator"); 

  const input = readInput(formData);
  const banner = formData.get("banner");

  const errors = validateChallenge(input);
  const bannerError = validateImage(banner);
  if (bannerError) errors.banner = bannerError;
  if (Object.keys(errors).length > 0) return { errors, values: input };

  const bannerUrl = await saveImage(banner, "banners");
  try {
    await query(
      `INSERT INTO challenges
         (curator_id, title, description, rules, prize, start_date, end_date, banner_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [user.id, input.title, input.description, input.rules, input.prize,
       input.startDate, input.endDate, bannerUrl]
    );
  } catch {
    await deleteImage(bannerUrl);
    return { errors: { general: "Gagal menyimpan challenge, coba lagi." }, values: input };
  }

  revalidatePath("/curator/challenges");
  redirect("/curator/challenges");
}

export async function updateChallengeAction(prevState, formData) {
  const user = await requireRole("curator");

  const id = Number(formData.get("id"));
  const input = readInput(formData);
  const banner = formData.get("banner");
  if (!Number.isInteger(id)) return { errors: { general: "Challenge tidak valid." }, values: input };

  const errors = validateChallenge(input);

  const hasBanner = banner && typeof banner !== "string" && banner.size > 0;
  if (hasBanner) {
    const bannerError = validateImage(banner);
    if (bannerError) errors.banner = bannerError;
  }
  if (Object.keys(errors).length > 0) return { errors, values: input };

  const old = await query(
    "SELECT banner_url FROM challenges WHERE id = $1 AND curator_id = $2",
    [id, user.id]
  );
  if (old.rows.length === 0) return { errors: { general: "Challenge tidak ditemukan." }, values: input };

  const newBannerUrl = hasBanner ? await saveImage(banner, "banners") : null;

  await query(
    `UPDATE challenges
     SET title = $1, description = $2, rules = $3, prize = $4,
         start_date = $5, end_date = $6, banner_url = COALESCE($7, banner_url)
     WHERE id = $8 AND curator_id = $9`,
    [input.title, input.description, input.rules, input.prize,
     input.startDate, input.endDate, newBannerUrl, id, user.id]
  );

  if (newBannerUrl) await deleteImage(old.rows[0].banner_url);

  revalidatePath("/curator/challenges");
  redirect("/curator/challenges");
}

export async function deleteChallengeAction(formData) {
  const user = await requireRole("curator");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const { rows } = await query(
    "DELETE FROM challenges WHERE id = $1 AND curator_id = $2 RETURNING banner_url",
    [id, user.id]
  );
  if (rows.length > 0) await deleteImage(rows[0].banner_url);

  revalidatePath("/curator/challenges");
}