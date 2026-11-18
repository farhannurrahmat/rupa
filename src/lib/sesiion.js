import { cookies } from "next/headers";
import crypto from "crypto";
import { query } from "@/lib/db";

const COOKIE_NAME = "rupa_session";
const SESSION_DAYS = 7;

// Dipanggil setelah login/register berhasil
export async function createSession(userId) {
  // Token acak 64 karakter, sulit ditebak
  const token = crypto.randomBytes(32).toString("hex");

  // Waktu kedaluwarsa dihitung oleh PostgreSQL agar jamnya konsisten
  await query(
    `INSERT INTO sessions (token, user_id, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '${SESSION_DAYS} days')`,
    [token, userId]
  );

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,                                  // tidak bisa dibaca JavaScript di browser
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

// Mengembalikan data pengguna yang sedang login, atau null
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const { rows } = await query(
    `SELECT u.id, u.email, u.role, u.curator_status, u.display_name, u.avatar_url
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > NOW()`,
    [token]
  );
  return rows[0] ?? null;
}

// Dipanggil saat logout
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await query("DELETE FROM sessions WHERE token = $1", [token]);
  }
  cookieStore.delete(COOKIE_NAME);
}