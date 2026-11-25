import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const MAX_SIZE = 15 * 1024 * 1024;

export function validateImage(file) {
  if (!file || typeof file === "string" || file.size === 0) return "File karya wajib diunggah.";
  if (!ALLOWED[file.type]) return "Format file harus JPG, PNG, WEBP, atau GIF.";
  if (file.size > MAX_SIZE) return "Ukuran file maksimal 15 MB.";
  return null;
}

export async function saveImage(file, folder = "artworks") {
  const filename = crypto.randomUUID() + ALLOWED[file.type];
  const dir = path.join(process.cwd(), "public", "uploads", folder);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

  return `/uploads/${folder}/${filename}`;
}

export async function deleteImage(fileUrl) {
  if (!fileUrl.startsWith("/uploads/") || fileUrl.includes("..")) return;
  await fs.unlink(path.join(process.cwd(), "public", fileUrl)).catch(() => {});
}