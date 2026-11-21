import { query } from "@/lib/db";

// Statistik platform: satu query dengan beberapa agregasi
export async function getPlatformStats() {
  const { rows } = await query(
    `SELECT
       COUNT(*) FILTER (WHERE role = 'admin')::int   AS admins,
       COUNT(*) FILTER (WHERE role = 'member')::int  AS members,
       COUNT(*) FILTER (WHERE role = 'curator')::int AS curators,
       COUNT(*) FILTER (WHERE role = 'curator' AND curator_status = 'pending')::int AS pending_curators,
       (SELECT COUNT(*)::int FROM artworks) AS artworks,
       (SELECT COUNT(*)::int FROM artwork_reports WHERE status = 'pending') AS pending_reports,
       (SELECT COUNT(*)::int FROM challenges WHERE NOW() >= start_date AND NOW() <= end_date) AS active_challenges
     FROM users`
  );
  return rows[0];
}

// Antrian moderasi: karya yang punya laporan belum diproses
export async function getModerationQueue() {
  const { rows } = await query(
    `SELECT a.id, a.title, a.file_url,
            u.display_name AS creator_name,
            COUNT(r.id)::int AS report_count,
            STRING_AGG(DISTINCT r.reason, ', ') AS reasons,
            MIN(r.created_at) AS first_reported
     FROM artwork_reports r
     JOIN artworks a ON a.id = r.artwork_id
     JOIN users u ON u.id = a.user_id
     WHERE r.status = 'pending'
     GROUP BY a.id, u.id
     ORDER BY report_count DESC, first_reported ASC`
  );
  return rows;
}