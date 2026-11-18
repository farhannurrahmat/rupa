import { Pool } from "pg";

// Satu pool koneksi dipakai bersama, supaya tidak membuka koneksi baru
// setiap kali file disimpan saat development.
const pool = globalThis.pgPool ?? new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") globalThis.pgPool = pool;

export function query(text, params) {
  return pool.query(text, params);
}