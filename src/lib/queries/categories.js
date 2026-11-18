import { query } from "@/lib/db";

// Daftar kategori beserta jumlah karya di tiap kategori
export async function getCategoriesWithCount() {
  const { rows } = await query(
    `SELECT c.id, c.name, COUNT(a.id)::int AS artwork_count
     FROM categories c
     LEFT JOIN artworks a ON a.category_id = c.id
     GROUP BY c.id
     ORDER BY c.name`
  );
  return rows;
}

export async function getAllCategories() {
  const { rows } = await query("SELECT id, name FROM categories ORDER BY name");
  return rows;
}