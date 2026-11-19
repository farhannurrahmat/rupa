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