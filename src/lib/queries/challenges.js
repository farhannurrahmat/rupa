import { query } from "@/lib/db";
import { escapeLike, CHALLENGE_STATUS_SQL } from "@/lib/sql";

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

export async function getChallengeDetail(id) {
  const { rows } = await query(
    `SELECT c.id, c.title, c.description, c.rules, c.prize, c.banner_url,
            c.start_date, c.end_date, u.display_name AS curator_name,
            ${CHALLENGE_STATUS_SQL} AS status
     FROM challenges c
     JOIN users u ON u.id = c.curator_id
     WHERE c.id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

// Hanya mengembalikan challenge milik Curator tersebut
export async function getOwnedChallenge(id, curatorId) {
  const { rows } = await query(
    `SELECT c.id, c.title, c.start_date, c.end_date,
            ${CHALLENGE_STATUS_SQL} AS status
     FROM challenges c
     WHERE c.id = $1 AND c.curator_id = $2`,
    [id, curatorId]
  );
  return rows[0] ?? null;
}

export async function getChallengeSubmissions(challengeId) {
  const { rows } = await query(
    `SELECT s.id AS submission_id, s.placement, s.submitted_at,
            a.id, a.title, a.file_url,
            cat.name AS category_name,
            u.id AS creator_id, u.display_name AS creator_name,
            (SELECT COUNT(*)::int FROM likes l WHERE l.artwork_id = a.id) AS like_count
     FROM challenge_submissions s
     JOIN artworks a ON a.id = s.artwork_id
     JOIN categories cat ON cat.id = a.category_id
     JOIN users u ON u.id = a.user_id
     WHERE s.challenge_id = $1
     ORDER BY s.submitted_at DESC`,
    [challengeId]
  );
  return rows;
}

export async function getMemberSubmission(challengeId, userId) {
  const { rows } = await query(
    `SELECT s.id, a.title
     FROM challenge_submissions s
     JOIN artworks a ON a.id = s.artwork_id
     WHERE s.challenge_id = $1 AND s.user_id = $2`,
    [challengeId, userId]
  );
  return rows[0] ?? null;
}

export async function getSubmissionsByUser(userId) {
  const { rows } = await query(
    `SELECT s.id, s.placement, s.submitted_at,
            a.title AS artwork_title, a.file_url,
            c.id AS challenge_id, c.title AS challenge_title,
            ${CHALLENGE_STATUS_SQL} AS status
     FROM challenge_submissions s
     JOIN artworks a ON a.id = s.artwork_id
     JOIN challenges c ON c.id = s.challenge_id
     WHERE s.user_id = $1
     ORDER BY s.submitted_at DESC`,
    [userId]
  );
  return rows;
}