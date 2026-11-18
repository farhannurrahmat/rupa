"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";

function validateName(name) {
  if (name.length < 2) return "Nama kategori minimal 2 karakter.";
  if (name.length > 50) return "Nama kategori maksimal 50 karakter.";
  return null;
}

export async function createCategoryAction(prevState, formData) {
  await requireRole("admin"); // wajib di baris pertama

  const name = String(formData.get("name") ?? "").trim();
  const error = validateName(name);
  if (error) return { error, name };

  // Nama harus unik, huruf besar/kecil dianggap sama
  const dup = await query("SELECT id FROM categories WHERE LOWER(name) = LOWER($1)", [name]);
  if (dup.rows.length > 0) return { error: "Nama kategori sudah ada.", name };

  await query("INSERT INTO categories (name) VALUES ($1)", [name]);
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategoryAction(prevState, formData) {
  await requireRole("admin");

  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!Number.isInteger(id)) return { error: "Kategori tidak valid." };

  const error = validateName(name);
  if (error) return { error };

  // Cek nama kembar pada kategori LAIN (id berbeda)
  const dup = await query(
    "SELECT id FROM categories WHERE LOWER(name) = LOWER($1) AND id <> $2",
    [name, id]
  );
  if (dup.rows.length > 0) return { error: "Nama kategori sudah ada." };

  await query("UPDATE categories SET name = $1 WHERE id = $2", [name, id]);
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategoryAction(prevState, formData) {
  await requireRole("admin");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "Kategori tidak valid." };

  // Kategori yang masih dipakai karya tidak boleh dihapus
  const used = await query("SELECT COUNT(*)::int AS total FROM artworks WHERE category_id = $1", [id]);
  const total = used.rows[0].total;
  if (total > 0) return { error: `Tidak bisa dihapus, masih dipakai ${total} karya.` };

  await query("DELETE FROM categories WHERE id = $1", [id]);
  revalidatePath("/admin/categories");
  return { success: true };
}