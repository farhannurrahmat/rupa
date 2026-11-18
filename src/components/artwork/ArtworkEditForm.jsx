"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateArtworkAction } from "@/actions/artworks";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-400">{message}</p>;
}

export default function ArtworkEditForm({ artwork, categories }) {
  const [state, formAction, pending] = useActionState(updateArtworkAction, null);
  const errors = state?.errors ?? {};
  const v = state?.values ?? {
    title: artwork.title,
    description: artwork.description,
    categoryId: String(artwork.category_id),
    tags: artwork.tags,
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={artwork.id} />

      {errors.general && (
        <p className="rounded-lg bg-red-950 px-4 py-3 text-sm text-red-300">{errors.general}</p>
      )}

      <div>
        <img src={artwork.file_url} alt={artwork.title} className="h-56 w-full rounded-xl object-cover" />
        <p className="mt-2 text-sm text-neutral-400">
          File karya tidak dapat diganti. Untuk mengganti file, hapus karya lalu unggah ulang.
        </p>
      </div>

      <div>
        <label htmlFor="title">Judul</label>
        <input id="title" name="title" defaultValue={v.title} className={inputClass} />
        <FieldError message={errors.title} />
      </div>

      <div>
        <label htmlFor="description">Deskripsi</label>
        <textarea id="description" name="description" rows={4} defaultValue={v.description} className={inputClass} />
        <FieldError message={errors.description} />
      </div>

      <div>
        <label htmlFor="categoryId">Kategori</label>
        <select id="categoryId" name="categoryId" defaultValue={v.categoryId} className={inputClass}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <FieldError message={errors.categoryId} />
      </div>

      <div>
        <label htmlFor="tags">Tags (pisahkan dengan koma)</label>
        <input id="tags" name="tags" defaultValue={v.tags} className={inputClass} />
        <FieldError message={errors.tags} />
      </div>

      <div className="flex gap-3">
        <button disabled={pending} className="flex-1 rounded-full bg-violet-500 py-3 font-semibold text-black disabled:opacity-50">
          {pending ? "Menyimpan..." : "Simpan perubahan"}
        </button>
        <Link href="/member/artworks" className="rounded-full border border-neutral-600 px-6 py-3">Batal</Link>
      </div>
    </form>
  );
}