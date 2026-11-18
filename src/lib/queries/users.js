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