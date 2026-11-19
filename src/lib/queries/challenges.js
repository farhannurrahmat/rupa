import { query } from "@/lib/db";
import { escapeLike } from "@/lib/sql";

export async function getChallengesByCurator(curatorId) {
  const { rows } = await query(
    `SELECT c.id, c.title, c.banner_url, c.start_date, c.end_date,
            CASE WHEN NOW() < c.start_date THEN 'upcoming'
                 WHEN NOW() <= c.end_date   THEN 'active'
                 ELSE 'ended' END AS status,
            (SELECT COUNT(*)::int FROM challenge_submissions s WHERE s.challenge_id = c.id) AS submission_count
     FROM challenges c
     WHERE c.curator_id = $1
     ORDER BY c.created_at DESC`,
    [curatorId]
  );
  return rows;
}

export async function getChallengeForEdit(id, curatorId) {
  const { rows } = await query(
    `SELECT id, title, description, rules, prize, banner_url,
            to_char(start_date, 'YYYY-MM-DD"T"HH24:MI') AS start_input,
            to_char(end_date,   'YYYY-MM-DD"T"HH24:MI') AS end_input
     FROM challenges
     WHERE id = $1 AND curator_id = $2`,
    [id, curatorId]
  );
  return rows[0] ?? null;
}

export async function getChallenges({ q = "", activeOnly = false, limit = 6 } = {}) {
  const { rows } = await query(
    `SELECT c.id, c.title, c.banner_url, c.start_date, c.end_date,
            u.display_name AS curator_name,
            CASE WHEN NOW() < c.start_date THEN 'upcoming'
                 WHEN NOW() <= c.end_date   THEN 'active'
                 ELSE 'ended' END AS status
     FROM challenges c
     JOIN users u ON u.id = c.curator_id
     WHERE ($1::text = '' OR c.title ILIKE '%' || $1 || '%')
       AND ($2::boolean = false OR (NOW() >= c.start_date AND NOW() <= c.end_date))
     ORDER BY c.end_date ASC
     LIMIT $3`,
    [escapeLike(q), activeOnly, limit]
  );
  return rows;
}