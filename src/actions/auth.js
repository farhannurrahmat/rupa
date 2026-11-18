"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { validateRegister } from "@/lib/validators";
import { createSession, destroySession, getSession } from "@/lib/session";

export async function registerAction(prevState, formData) {
  const input = {
    displayName: String(formData.get("displayName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
    role: String(formData.get("role") ?? ""),
  };
  const values = { displayName: input.displayName, email: input.email, role: input.role };

  // Validasi di backend
  const errors = validateRegister(input);
  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  // Email harus belum terdaftar
  const existing = await query("SELECT id FROM users WHERE email = $1", [input.email]);
  if (existing.rows.length > 0) {
    return { errors: { email: "Email sudah terdaftar." }, values };
  }

  // Hash password, lalu simpan. Curator baru berstatus pending.
  const passwordHash = await bcrypt.hash(input.password, 10);
  const curatorStatus = input.role === "curator" ? "pending" : null;

  const { rows } = await query(
    `INSERT INTO users (email, password_hash, role, curator_status, display_name)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [input.email, passwordHash, input.role, curatorStatus, input.displayName]
  );

  // Langsung login, lalu arahkan sesuai peran
  await createSession(rows[0].id);
  redirect(input.role === "curator" ? "/curator/pending" : "/");
}

export async function loginAction(prevState, formData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi.", values: { email } };
  }

  const { rows } = await query(
    "SELECT id, password_hash, role, curator_status FROM users WHERE email = $1",
    [email]
  );
  const user = rows[0];

  // Pesan error 
  const passwordOk = user ? await bcrypt.compare(password, user.password_hash) : false;
  if (!passwordOk) {
    return { error: "Email atau password salah.", values: { email } };
  }

  await createSession(user.id);

  // Arahkan sesuai peran
  if (user.role === "admin") redirect("/admin");
  if (user.role === "curator") {
    redirect(user.curator_status === "approved" ? "/curator/challenges" : "/curator/pending");
  }
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function deleteAccountAction() {
  const user = await getSession();

  // Hanya Curator yang ditolak yang boleh menghapus akunnya lewat halaman ini
  if (!user || user.role !== "curator" || user.curator_status !== "rejected") {
    redirect("/");
  }

  await query("DELETE FROM users WHERE id = $1", [user.id]); // sesinya ikut terhapus (CASCADE)
  await destroySession();
  redirect("/login");
}