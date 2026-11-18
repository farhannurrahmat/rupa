import { query } from "@/lib/db";

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