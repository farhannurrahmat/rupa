"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/actions/profile";
import Photo from "@/components/ui/Photo";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-400">{message}</p>;
}

export default function ProfileForm({ profile }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, null);
  const errors = state?.errors ?? {};
  const v = state?.values ?? {
    displayName: profile.display_name,
    bio: profile.bio ?? "",
    instagram: profile.link_instagram ?? "",
    behance: profile.link_behance ?? "",
    website: profile.link_website ?? "",
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-accent focus:outline-none";

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-line bg-surface p-6 sm:p-8"
    >
      <div className="border-b border-line pb-4">
        <h2 className="text-lg font-bold">Profil Publik</h2>
        <p className="mt-0.5 text-xs text-muted">
          Informasi ini tampil di halaman portofolio kreator.
        </p>
      </div>

      {state?.success && (
        <p className="rounded-xl border border-emerald-500/40 bg-emerald-950/60 px-4 py-2.5 text-sm text-emerald-200">
          Profil berhasil diperbarui.
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {profile.avatar_url ? (
          <Photo
            src={profile.avatar_url}
            alt="Foto profil"
            sizes="80px"
            className="h-20 w-20 shrink-0 rounded-full border border-accent/60"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-accent/60 bg-accent/15 font-display text-2xl font-bold text-accent">
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <label htmlFor="avatar" className="block text-sm font-medium">
            Foto profil (opsional)
          </label>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="mt-1.5 w-full rounded-xl border border-line bg-ink px-3.5 py-2 text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent/20 file:px-3.5 file:py-1 file:text-xs file:font-medium file:text-accent hover:file:bg-accent/30"
          />
          <FieldError message={errors.avatar} />
        </div>
      </div>

      <div>
        <label htmlFor="displayName" className="block text-sm font-medium">
          Nama tampilan
        </label>
        <input id="displayName" name="displayName" defaultValue={v.displayName} className={inputClass} />
        <FieldError message={errors.displayName} />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium">
          Bio
        </label>
        <textarea id="bio" name="bio" rows={3} defaultValue={v.bio} className={inputClass} />
        <FieldError message={errors.bio} />
      </div>

      <div className="space-y-4 border-t border-line pt-4">
        <p className="text-xs font-semibold tracking-[0.18em] text-muted">TAUTAN SOSIAL</p>

        <div>
          <label htmlFor="instagram" className="block text-sm font-medium">
            Instagram
          </label>
          <input id="instagram" name="instagram" placeholder="https://instagram.com/..." defaultValue={v.instagram} className={inputClass} />
          <FieldError message={errors.instagram} />
        </div>

        <div>
          <label htmlFor="behance" className="block text-sm font-medium">
            Behance
          </label>
          <input id="behance" name="behance" placeholder="https://behance.net/..." defaultValue={v.behance} className={inputClass} />
          <FieldError message={errors.behance} />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium">
            Website
          </label>
          <input id="website" name="website" placeholder="https://..." defaultValue={v.website} className={inputClass} />
          <FieldError message={errors.website} />
        </div>
      </div>

      <button
        disabled={pending}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
      >
        {pending ? "Menyimpan..." : "Simpan profil"}
      </button>
    </form>
  );
}