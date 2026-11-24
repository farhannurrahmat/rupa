"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { createChallengeAction, updateChallengeAction } from "@/actions/challenges";
import Photo from "@/components/ui/Photo";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-400">{message}</p>;
}

export default function ChallengeForm({ challenge }) {
  const isEdit = Boolean(challenge);
  const [preview, setPreview] = useState(null);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateChallengeAction : createChallengeAction,
    null
  );

  const errors = state?.errors ?? {};
  const v = state?.values ?? {
    title: challenge?.title ?? "",
    description: challenge?.description ?? "",
    rules: challenge?.rules ?? "",
    prize: challenge?.prize ?? "",
    startDate: challenge?.start_input ?? "",
    endDate: challenge?.end_input ?? "",
  };

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-accent focus:outline-none";

  return (
    <form action={formAction} className="space-y-6">
      {isEdit && <input type="hidden" name="id" value={challenge.id} />}

      {errors.general && (
        <p className="rounded-xl border border-red-500/40 bg-red-950/60 px-4 py-2.5 text-sm text-red-200">
          {errors.general}
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Kolom Kiri: Area Banner Terpisah */}
        <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 lg:col-span-5">
          <div>
            <h2 className="text-base font-bold">Banner Challenge</h2>
            <p className="mt-0.5 text-xs text-muted">
              Format JPG, PNG, WEBP, atau GIF (maks. 15 MB).
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-dashed border-line bg-ink">
            {preview ? (
              <img
                src={preview}
                alt="Preview banner"
                className="aspect-video w-full object-cover"
              />
            ) : isEdit ? (
              <Photo
                src={challenge.banner_url}
                alt="Banner saat ini"
                className="aspect-video w-full"
              />
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center px-4 text-center">
                <p className="text-sm font-medium text-neutral-300">Belum ada gambar dipilih</p>
                <p className="mt-1 text-xs text-muted">Rasio lanskap 16:9 disarankan</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="banner" className="block text-sm font-medium">
              {isEdit ? "Ganti banner (opsional)" : "Pilih file banner"}
            </label>
            <input
              id="banner"
              name="banner"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="mt-1.5 w-full rounded-xl border border-line bg-ink px-3.5 py-2 text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent/20 file:px-3.5 file:py-1 file:text-xs file:font-medium file:text-accent hover:file:bg-accent/30"
            />
            <FieldError message={errors.banner} />
          </div>
        </div>

        {/* Kolom Kanan: Detail Challenge */}
        <div className="space-y-5 rounded-2xl border border-line bg-surface p-6 lg:col-span-7">
          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Judul challenge
            </label>
            <input
              id="title"
              name="title"
              defaultValue={v.title}
              placeholder="Contoh: Eksplorasi Ilustrasi Nusantara"
              className={inputClass}
            />
            <FieldError message={errors.title} />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={v.description}
              placeholder="Jelaskan tema, latar belakang, dan tujuan challenge..."
              className={inputClass}
            />
            <FieldError message={errors.description} />
          </div>

          <div>
            <label htmlFor="rules" className="block text-sm font-medium">
              Aturan
            </label>
            <textarea
              id="rules"
              name="rules"
              rows={3}
              defaultValue={v.rules}
              placeholder="Tuliskan ketentuan karya, format, atau kriteria penilaian..."
              className={inputClass}
            />
            <FieldError message={errors.rules} />
          </div>

          <div>
            <label htmlFor="prize" className="block text-sm font-medium">
              Hadiah
            </label>
            <input
              id="prize"
              name="prize"
              defaultValue={v.prize}
              placeholder="Contoh: Sertifikat & fitur eksklusif di halaman utama"
              className={inputClass}
            />
            <FieldError message={errors.prize} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium">
                Mulai
              </label>
              <input
                id="startDate"
                name="startDate"
                type="datetime-local"
                defaultValue={v.startDate}
                className={inputClass}
              />
              <FieldError message={errors.startDate} />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium">
                Selesai
              </label>
              <input
                id="endDate"
                name="endDate"
                type="datetime-local"
                defaultValue={v.endDate}
                className={inputClass}
              />
              <FieldError message={errors.endDate} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <button
              disabled={pending}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
            >
              {pending ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Buat challenge"}
            </button>
            <Link
              href="/curator/challenges"
              className="rounded-full border border-line bg-ink px-5 py-2.5 text-sm font-medium text-muted transition hover:border-neutral-600 hover:text-white"
            >
              Batal
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}