"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { updateArtworkAction } from "@/actions/artworks";
import Photo from "@/components/ui/Photo";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-400">{message}</p>;
}

export default function ArtworkEditForm({ artwork, categories }) {
  const [state, formAction, pending] = useActionState(updateArtworkAction, null);
  const [form, setForm] = useState({
    title: artwork.title,
    description: artwork.description ?? "",
    categoryId: String(artwork.category_id),
    tags: artwork.tags ?? "",
  });
  const errors = state?.errors ?? {};

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <input type="hidden" name="id" value={artwork.id} />

      <div className="self-start lg:sticky lg:top-8">
        <Photo
          src={artwork.file_url}
          alt={artwork.title}
          fit="contain"
          sizes="(max-width: 1024px) 100vw, 400px"
          className="aspect-[4/5] w-full rounded-2xl border border-line bg-surface"
        />
        <p className="mt-3 text-sm text-muted">
          File karya tidak dapat diganti. Untuk mengganti file, hapus karya lalu unggah ulang.
        </p>
      </div>

      <div className="space-y-5">
        {errors.general && (
          <p className="rounded-lg bg-red-950 px-4 py-3 text-sm text-red-300">{errors.general}</p>
        )}

        <div>
          <label htmlFor="title">Judul</label>
          <input id="title" name="title" value={form.title} onChange={onChange} className="field" />
          <FieldError message={errors.title} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="categoryId">Kategori</label>
            <select id="categoryId" name="categoryId" value={form.categoryId} onChange={onChange} className="field">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <FieldError message={errors.categoryId} />
          </div>

          <div>
            <label htmlFor="tags">Tag</label>
            <input id="tags" name="tags" placeholder="neon, cyberpunk (pisahkan dengan koma)" value={form.tags} onChange={onChange} className="field" />
            <FieldError message={errors.tags} />
          </div>
        </div>

        <div>
          <label htmlFor="description">Deskripsi</label>
          <textarea id="description" name="description" rows={6} value={form.description} onChange={onChange} className="field" />
          <FieldError message={errors.description} />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            disabled={pending}
            className="flex-1 rounded-full bg-accent px-8 py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-50 sm:flex-none"
          >
            {pending ? "Menyimpan..." : "Simpan perubahan"}
          </button>
          <Link href="/member/artworks" className="btn-ghost">Batal</Link>
        </div>
      </div>
    </form>
  );
}