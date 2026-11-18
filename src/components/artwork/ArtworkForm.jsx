"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createArtworkAction } from "@/actions/artworks";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-400">{message}</p>;
}

export default function ArtworkForm({ categories }) {
  const [state, formAction, pending] = useActionState(createArtworkAction, null);
  const errors = state?.errors ?? {};
  const values = state?.values ?? {};

  const inputClass =
    "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white";

  return (
    <form action={formAction} className="space-y-4">
      {errors.general && (
        <p className="rounded-lg bg-red-950 px-4 py-3 text-sm text-red-300">{errors.general}</p>
      )}

      <div>
        <label htmlFor="title">Judul</label>
        <input id="title" name="title" defaultValue={values.title} className={inputClass} />
        <FieldError message={errors.title} />
      </div>

      <div>
        <label htmlFor="description">Deskripsi</label>
        <textarea id="description" name="description" rows={4} defaultValue={values.description} className={inputClass} />
        <FieldError message={errors.description} />
      </div>

      <div>
        <label htmlFor="categoryId">Kategori</label>
        <select id="categoryId" name="categoryId" defaultValue={values.categoryId ?? ""} className={inputClass}>
          <option value="" disabled>Pilih kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <FieldError message={errors.categoryId} />
      </div>

      <div>
        <label htmlFor="tags">Tags (pisahkan dengan koma)</label>
        <input id="tags" name="tags" placeholder="neon, cyberpunk, blender" defaultValue={values.tags} className={inputClass} />
        <FieldError message={errors.tags} />
      </div>

      <div>
        <label htmlFor="file">File karya (JPG, PNG, WEBP, GIF, maks 5 MB)</label>
        <input id="file" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className={inputClass} />
        <FieldError message={errors.file} />
      </div>

      <div className="flex gap-3">
        <button disabled={pending} className="flex-1 rounded-full bg-violet-500 py-3 font-semibold text-black disabled:opacity-50">
          {pending ? "Mengunggah..." : "Unggah karya"}
        </button>
        <Link href="/member/artworks" className="rounded-full border border-neutral-600 px-6 py-3">Batal</Link>
      </div>
    </form>
  );
}