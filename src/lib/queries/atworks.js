import { query } from "@/lib/db";

export async function getArtworksByUser(userId) {
  const { rows } = await query(
    `SELECT a.id, a.title, a.file_url, a.created_at,
            c.name AS category_name,
            (SELECT COUNT(*)::int FROM likes l WHERE l.artwork_id = a.id) AS like_count
     FROM artworks a
     JOIN categories c ON c.id = a.category_id
     WHERE a.user_id = $1
     ORDER BY a.created_at DESC`,
    [userId]
  );
  return rows;
}