"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createChallengeAction, updateChallengeAction } from "@/actions/challenges";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-400">{message}</p>;
}

export default function ChallengeForm({ challenge }) {
  const isEdit = Boolean(challenge);
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

  const inputClass =
    "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white";

  return (
    <form action={formAction} className="space-y-4">
      {isEdit && <input type="hidden" name="id" value={challenge.id} />}

      {errors.general && (
        <p className="rounded-lg bg-red-950 px-4 py-3 text-sm text-red-300">{errors.general}</p>
      )}

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
        <label htmlFor="rules">Aturan</label>
        <textarea id="rules" name="rules" rows={4} defaultValue={v.rules} className={inputClass} />
        <FieldError message={errors.rules} />
      </div>

      <div>
        <label htmlFor="prize">Hadiah</label>
        <input id="prize" name="prize" defaultValue={v.prize} className={inputClass} />
        <FieldError message={errors.prize} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate">Mulai</label>
          <input id="startDate" name="startDate" type="datetime-local" defaultValue={v.startDate} className={inputClass} />
          <FieldError message={errors.startDate} />
        </div>
        <div>
          <label htmlFor="endDate">Selesai</label>
          <input id="endDate" name="endDate" type="datetime-local" defaultValue={v.endDate} className={inputClass} />
          <FieldError message={errors.endDate} />
        </div>
      </div>

      <div>
        {isEdit && (
          <img src={challenge.banner_url} alt="Banner saat ini" className="mb-3 h-36 w-full rounded-xl object-cover" />
        )}
        <label htmlFor="banner">
          {isEdit ? "Ganti banner (opsional)" : "Gambar banner (JPG, PNG, WEBP, GIF, maks 5 MB)"}
        </label>
        <input id="banner" name="banner" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className={inputClass} />
        <FieldError message={errors.banner} />
      </div>

      <div className="flex gap-3">
        <button disabled={pending} className="flex-1 rounded-full bg-violet-500 py-3 font-semibold text-black disabled:opacity-50">
          {pending ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Buat challenge"}
        </button>
        <Link href="/curator/challenges" className="rounded-full border border-neutral-600 px-6 py-3">Batal</Link>
      </div>
    </form>
  );
}