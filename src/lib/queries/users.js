import { query } from "@/lib/db";

export async function getUserProfile(userId) {
  const { rows } = await query(
    `SELECT email, display_name, bio, avatar_url,
            link_instagram, link_behance, link_website
     FROM users WHERE id = $1`,
    [userId]
  );
  return rows[0];
}

export async function getUsers(role) {
  const { rows } = await query(
    `SELECT id, email, role, curator_status, display_name, created_at
     FROM users
     WHERE ($1::text = '' OR role = $1)
     ORDER BY created_at DESC`,
    [role]
  );
  return rows;
}

export async function getPendingCurators() {
  const { rows } = await query(
    `SELECT id, email, display_name, created_at
     FROM users
     WHERE role = 'curator' AND curator_status = 'pending'
     ORDER BY created_at ASC`
  );
  return rows;
}

export async function getCreatorProfile(id) {
  const { rows } = await query(
    `SELECT id, display_name, bio, avatar_url, link_instagram, link_behance, link_website
     FROM users WHERE id = $1 AND role = 'member'`,
    [id]
  );
  return rows[0] ?? null;
}

export async function getMemberStats(userId) {
  const { rows } = await query(
    `SELECT
       (SELECT COUNT(*)::int FROM artworks WHERE user_id = $1) AS artworks,
       (SELECT COUNT(*)::int FROM likes l JOIN artworks a ON a.id = l.artwork_id WHERE a.user_id = $1) AS likes_received,
       (SELECT COUNT(*)::int FROM favorites WHERE user_id = $1) AS favorites,
       (SELECT COUNT(*)::int FROM challenge_submissions WHERE user_id = $1) AS submissions`,
    [userId]
  );
  return rows[0];
}

export async function getCreators() {
  const { rows } = await query(
    `SELECT u.id, u.display_name, u.avatar_url, u.bio, COUNT(a.id)::int AS artwork_count
     FROM users u
     LEFT JOIN artworks a ON a.user_id = u.id
     WHERE u.role = 'member'
     GROUP BY u.id
     HAVING COUNT(a.id) > 0
     ORDER BY artwork_count DESC, u.display_name`
  );
  return rows;
}