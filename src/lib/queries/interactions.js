import { query } from "@/lib/db";

export async function getInteractionState(artworkId, userId) {
  const { rows } = await query(
    `SELECT
       EXISTS (SELECT 1 FROM likes WHERE artwork_id = $1 AND user_id = $2) AS liked,
       EXISTS (SELECT 1 FROM favorites WHERE artwork_id = $1 AND user_id = $2) AS favorited,
       EXISTS (SELECT 1 FROM artwork_reports WHERE artwork_id = $1 AND reporter_id = $2) AS reported`,
    [artworkId, userId]
  );
  return rows[0];
}

export async function getComments(artworkId) {
  const { rows } = await query(
    `SELECT c.id, c.content, c.created_at,
            u.id AS user_id, u.display_name, u.avatar_url
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.artwork_id = $1
     ORDER BY c.created_at DESC`,
    [artworkId]
  );
  return rows;
}

export async function getFavoritesByUser(userId) {
  const { rows } = await query(
    `SELECT a.id, a.title, a.file_url, a.created_at,
            c.name AS category_name,
            u.id AS creator_id, u.display_name AS creator_name,
            (SELECT COUNT(*)::int FROM likes l WHERE l.artwork_id = a.id) AS like_count
     FROM favorites f
     JOIN artworks a ON a.id = f.artwork_id
     JOIN categories c ON c.id = a.category_id
     JOIN users u ON u.id = a.user_id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return rows;
}