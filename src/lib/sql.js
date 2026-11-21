export function escapeLike(text) {
  return text.replace(/[\\%_]/g, "\\$&");
}

export const CHALLENGE_STATUS_SQL = `CASE
  WHEN NOW() < c.start_date THEN 'upcoming'
  WHEN NOW() <= c.end_date THEN 'active'
  ELSE 'ended' END`;