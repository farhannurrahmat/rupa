"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { validateImage, saveImage, deleteImage } from "@/lib/upload";

function isValidUrl(value) {
  return value.length <= 255 && /^https?:\/\/\S+$/i.test(value);
}

export async function updateProfileAction(prevState, formData) {
  const user = await requireRole("member");

  const displayName = String(formData.get("displayName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "").trim();
  const behance = String(formData.get("behance") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const avatar = formData.get("avatar");

  const values = { displayName, bio, instagram, behance, website };

  const errors = {};
  if (displayName.length < 3 || displayName.length > 100) errors.displayName = "Nama 3 sampai 100 karakter.";
  if (bio.length > 300) errors.bio = "Bio maksimal 300 karakter.";
  if (instagram && !isValidUrl(instagram)) errors.instagram = "Tautan harus diawali http:// atau https://";
  if (behance && !isValidUrl(behance)) errors.behance = "Tautan harus diawali http:// atau https://";
  if (website && !isValidUrl(website)) errors.website = "Tautan harus diawali http:// atau https://";

  const hasAvatar = avatar && typeof avatar !== "string" && avatar.size > 0;
  if (hasAvatar) {
    const avatarError = validateImage(avatar);
    if (avatarError) errors.avatar = avatarError;
  }

  if (Object.keys(errors).length > 0) return { errors, values };

  const old = await query("SELECT avatar_url FROM users WHERE id = $1", [user.id]);
  const newAvatarUrl = hasAvatar ? await saveImage(avatar, "avatars") : null;

  await query(
    `UPDATE users
     SET display_name = $1, bio = $2, link_instagram = $3, link_behance = $4,
         link_website = $5, avatar_url = COALESCE($6, avatar_url)
     WHERE id = $7`,
    [displayName, bio || null, instagram || null, behance || null, website || null, newAvatarUrl, user.id]
  );

  if (newAvatarUrl && old.rows[0]?.avatar_url) await deleteImage(old.rows[0].avatar_url);

  revalidatePath("/member/profile");
  return { success: true, values };
}

export async function updateAccountAction(prevState, formData) {
  const user = await requireRole("member");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const values = { email };

  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Format email tidak valid.";
  if (!currentPassword) errors.currentPassword = "Password saat ini wajib diisi.";
  if (newPassword) {
    if (newPassword.length < 8) errors.newPassword = "Password baru minimal 8 karakter.";
    else if (newPassword !== confirmPassword) errors.confirmPassword = "Konfirmasi password tidak cocok.";
  }
  if (Object.keys(errors).length > 0) return { errors, values };

  // Perubahan akun harus disertai password saat ini
  const { rows } = await query("SELECT password_hash FROM users WHERE id = $1", [user.id]);
  const ok = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!ok) return { errors: { currentPassword: "Password saat ini salah." }, values };

  const dup = await query("SELECT id FROM users WHERE email = $1 AND id <> $2", [email, user.id]);
  if (dup.rows.length > 0) return { errors: { email: "Email sudah dipakai." }, values };

  const newHash = newPassword ? await bcrypt.hash(newPassword, 10) : rows[0].password_hash;
  await query("UPDATE users SET email = $1, password_hash = $2 WHERE id = $3", [email, newHash, user.id]);

  revalidatePath("/member/profile");
  return { success: true, values };
}