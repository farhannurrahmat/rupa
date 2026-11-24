"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createArtworkAction } from "@/actions/artworks";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-400">{message}</p>;
}

export default function ArtworkForm({ categories }) {
  const [state, formAction, pending] = useActionState(createArtworkAction, null);
  const [form, setForm] = useState({ title: "", categoryId: "", tags: "", description: "" });
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);
  const errors = state?.errors ?? {};

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  // React mengosongkan input file setelah submit gagal, jadi file yang sama dipasang kembali
  useEffect(() => {
    if (!state || !file || !fileRef.current) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    fileRef.current.files = dt.files;
  }, [state, file]);

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="self-start lg:sticky lg:top-8">
        <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-surface transition hover:border-accent">
          {previewUrl ? (
            <img src={previewUrl} alt="Pratinjau karya" className="absolute inset-0 h-full w-full object-contain" />
          ) : (
            <div className="px-6 text-center text-muted">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-line text-2xl text-accent">
                +
              </span>
              <p className="mt-4 font-medium text-white">Tarik gambar ke sini</p>
              <p className="mt-1 text-sm">atau klik untuk memilih file</p>
              <p className="mt-4 text-xs">JPG, PNG, WEBP, GIF · maks 15 MB</p>
            </div>
          )}
          <input
            ref={fileRef}
            id="file"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            aria-label="File karya"
            onChange={(e) => setFile(e.target.files[0] ?? null)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>

        {file && (
          <p className="mt-3 truncate text-sm text-muted">
            {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB · klik gambar untuk mengganti
          </p>
        )}
        <FieldError message={errors.file} />
      </div>

      <div className="space-y-5">
        {errors.general && (
          <p className="rounded-lg bg-red-950 px-4 py-3 text-sm text-red-300">{errors.general}</p>
        )}

        <div>
          <label htmlFor="title">Judul</label>
          <input id="title" name="title" placeholder="Beri judul karyamu" value={form.title} onChange={onChange} className="field" />
          <FieldError message={errors.title} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="categoryId">Kategori</label>
            <select id="categoryId" name="categoryId" value={form.categoryId} onChange={onChange} className="field">
              <option value="" disabled>Pilih kategori</option>
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
          <textarea
            id="description"
            name="description"
            rows={6}
            placeholder="Ceritakan ide, alat, atau proses di balik karya ini"
            value={form.description}
            onChange={onChange}
            className="field"
          />
          <FieldError message={errors.description} />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            disabled={pending}
            className="flex-1 rounded-full bg-accent px-8 py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-50 sm:flex-none"
          >
            {pending ? "Mengunggah..." : "Unggah karya"}
          </button>
          <Link href="/member/artworks" className="btn-ghost">Batal</Link>
        </div>
      </div>
    </form>
  );
}