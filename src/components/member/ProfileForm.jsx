"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/actions/profile";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-400">{message}</p>;
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
    "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white";

  return (
    <form action={formAction} className="space-y-4">
      <h2 className="text-xl font-semibold">Profil publik</h2>

      {state?.success && (
        <p className="rounded-lg bg-green-950 px-4 py-3 text-sm text-green-300">Profil berhasil diperbarui.</p>
      )}

      <div className="flex items-center gap-4">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="Foto profil" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400" />
        )}
        <div className="flex-1">
          <label htmlFor="avatar">Foto profil (opsional)</label>
          <input id="avatar" name="avatar" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className={inputClass} />
          <FieldError message={errors.avatar} />
        </div>
      </div>

      <div>
        <label htmlFor="displayName">Nama tampilan</label>
        <input id="displayName" name="displayName" defaultValue={v.displayName} className={inputClass} />
        <FieldError message={errors.displayName} />
      </div>

      <div>
        <label htmlFor="bio">Bio</label>
        <textarea id="bio" name="bio" rows={3} defaultValue={v.bio} className={inputClass} />
        <FieldError message={errors.bio} />
      </div>

      <div>
        <label htmlFor="instagram">Instagram</label>
        <input id="instagram" name="instagram" placeholder="https://instagram.com/..." defaultValue={v.instagram} className={inputClass} />
        <FieldError message={errors.instagram} />
      </div>

      <div>
        <label htmlFor="behance">Behance</label>
        <input id="behance" name="behance" placeholder="https://behance.net/..." defaultValue={v.behance} className={inputClass} />
        <FieldError message={errors.behance} />
      </div>

      <div>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" placeholder="https://..." defaultValue={v.website} className={inputClass} />
        <FieldError message={errors.website} />
      </div>

      <button disabled={pending} className="w-full rounded-full bg-violet-500 py-3 font-semibold text-black disabled:opacity-50">
        {pending ? "Menyimpan..." : "Simpan profil"}
      </button>
    </form>
  );
}