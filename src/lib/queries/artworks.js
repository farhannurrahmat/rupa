import { query } from "@/lib/db";
import { escapeLike } from "@/lib/sql";

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

export async function getArtworkForEdit(id, userId) {
  const { rows } = await query(
    `SELECT id, title, description, category_id, tags, file_url
     FROM artworks
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return rows[0] ?? null;
}

// Galeri umum
export async function getArtworks({ q = "", categoryId = null, sort = "latest", page = 1, limit = 12, viewerId = null } = {}) {
  const orderBy = sort === "popular" ? "like_count DESC, a.created_at DESC" : "a.created_at DESC";

  const { rows } = await query(
    `SELECT a.id, a.title, a.file_url, a.created_at,
            c.name AS category_name,
            u.id AS creator_id, u.display_name AS creator_name,
            (SELECT COUNT(*)::int FROM likes l WHERE l.artwork_id = a.id) AS like_count,
            EXISTS (SELECT 1 FROM likes x WHERE x.artwork_id = a.id AND x.user_id = $5::int) AS liked,
            EXISTS (SELECT 1 FROM favorites f WHERE f.artwork_id = a.id AND f.user_id = $5::int) AS favorited
     FROM artworks a
     JOIN categories c ON c.id = a.category_id
     JOIN users u ON u.id = a.user_id
     WHERE ($1::text = ''
            OR a.title ILIKE '%' || $1 || '%'
            OR u.display_name ILIKE '%' || $1 || '%'
            OR a.tags ILIKE '%' || $1 || '%')
       AND ($2::int IS NULL OR a.category_id = $2)
     ORDER BY ${orderBy}
     LIMIT $3 OFFSET $4`,
    [escapeLike(q), categoryId, limit + 1, (page - 1) * limit, viewerId]
  );

  return { items: rows.slice(0, limit), hasMore: rows.length > limit };
}
export async function getArtworkDetail(id) {
  const { rows } = await query(
    `SELECT a.id, a.title, a.description, a.tags, a.file_url, a.created_at,
            c.name AS category_name,
            u.id AS creator_id, u.display_name AS creator_name, u.avatar_url,
            (SELECT COUNT(*)::int FROM likes l WHERE l.artwork_id = a.id) AS like_count
     FROM artworks a
     JOIN categories c ON c.id = a.category_id
     JOIN users u ON u.id = a.user_id
     WHERE a.id = $1`,
    [id]
  );
  return rows[0] ?? null;
}