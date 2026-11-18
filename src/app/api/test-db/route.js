import { query } from "@/lib/db";

export async function GET() {
  const { rows } = await query("SELECT id, name FROM categories ORDER BY id");
  return Response.json(rows);
}