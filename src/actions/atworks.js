"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { validateImage, saveImage, deleteImage } from "@/lib/upload";

// Tags: pisah koma, buang yang kosong dan duplikat
function cleanTags(raw) {
  const list = raw.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  return [...new Set(list)];
}

export async function createArtworkAction(prevState, formData) {
  const user = await requireRole("member"); // wajib di baris pertama

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const rawCategory = String(formData.get("categoryId") ?? "");
  const rawTags = String(formData.get("tags") ?? "");
  const categoryId = Number(rawCategory);
  const tagList = cleanTags(rawTags);
  const file = formData.get("file");

  const values = { title, description, categoryId: rawCategory, tags: rawTags };

  //  Validasi di backend
  const errors = {};
  if (title.length < 3 || title.length > 150) errors.title = "Judul 3 sampai 150 karakter.";
  if (description.length < 10) errors.description = "Deskripsi minimal 10 karakter.";
  if (tagList.length < 1) errors.tags = "Isi minimal 1 tag, pisahkan dengan koma.";
  else if (tagList.length > 10) errors.tags = "Maksimal 10 tag.";

  const fileError = validateImage(file);
  if (fileError) errors.file = fileError;

  const category = await query("SELECT id FROM categories WHERE id = $1", [categoryId]);
  if (category.rows.length === 0) errors.categoryId = "Pilih kategori yang valid.";

  if (Object.keys(errors).length > 0) return { errors, values };

  // Simpan file, lalu catat di database
  const fileUrl = await saveImage(file);
  try {
    await query(
      `INSERT INTO artworks (user_id, category_id, title, description, tags, file_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.id, categoryId, title, description, tagList.join(", "), fileUrl]
    );
  } catch {
    await deleteImage(fileUrl); // jangan sisakan file yatim kalau database gagal
    return { errors: { general: "Gagal menyimpan karya, coba lagi." }, values };
  }

  revalidatePath("/member/artworks");
  redirect("/member/artworks");
}

export async function deleteArtworkAction(formData) {
  const user = await requireRole("member");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  // "AND user_id = $2" memastikan hanya pemilik yang bisa menghapus
  const { rows } = await query(
    "DELETE FROM artworks WHERE id = $1 AND user_id = $2 RETURNING file_url",
    [id, user.id]
  );
  if (rows.length > 0) await deleteImage(rows[0].file_url);

  revalidatePath("/member/artworks");
}