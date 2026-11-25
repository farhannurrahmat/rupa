"use client";

import { useActionState, useEffect, useState } from "react";
import { updateProfileAction } from "@/actions/profile";
import Photo from "@/components/ui/Photo";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-400">{message}</p>;
}

export default function ProfileForm({ profile }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, null);
  const [preview, setPreview] = useState(null);

  const errors = state?.errors ?? {};
  const v = state?.values ?? {
    displayName: profile.display_name,
    bio: profile.bio ?? "",
    instagram: profile.link_instagram ?? "",
    behance: profile.link_behance ?? "",
    website: profile.link_website ?? "",
  };

  useEffect(() => {
    if (state?.success) setPreview(null);
  }, [state?.success]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-accent focus:outline-none";

  return (
    <form action={formAction} className="space-y-6">
      {state?.success && (
        <p className="rounded-xl border border-emerald-500/40 bg-emerald-950/60 px-4 py-2.5 text-sm text-emerald-200">
          Profil berhasil diperbarui.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Bagian 1: Foto & Identitas */}
        <section className="space-y-5 rounded-2xl border border-line bg-surface p-6 lg:col-span-5">
          <div>
            <h2 className="text-base font-bold">1. Foto & Identitas</h2>
            <p className="mt-0.5 text-xs text-muted">
              Tampil sebagai identitas utama di galeri.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 rounded-xl border border-line bg-ink p-5 text-center">
            {preview ? (
              <img
                src={preview}
                alt="Pratinjau foto profil"
                className="h-24 w-24 rounded-full border border-accent object-cover"
              />
            ) : profile.avatar_url ? (
              <Photo
                src={profile.avatar_url}
                alt="Foto profil"
                sizes="96px"
                className="h-24 w-24 rounded-full border border-accent/60"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-accent/60 bg-accent/15 font-display text-3xl font-bold text-accent">
                {profile.display_name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="w-full">
              <label
                htmlFor="avatar"
                className="inline-block cursor-pointer rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/25"
              >
                Pilih foto profil
              </label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onFileChange}
                className="hidden"
              />
              <p className="mt-2 text-[11px] text-muted">JPG, PNG, WEBP, atau GIF</p>
              <FieldError message={errors.avatar} />
            </div>
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium">
              Nama tampilan
            </label>
            <input
              id="displayName"
              name="displayName"
              defaultValue={v.displayName}
              className={inputClass}
            />
            <FieldError message={errors.displayName} />
          </div>
        </section>

        {/* Bagian 2: Bio & Tautan Sosial */}
        <section className="flex flex-col justify-between space-y-5 rounded-2xl border border-line bg-surface p-6 lg:col-span-7">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold">2. Bio & Tautan</h2>
              <p className="mt-0.5 text-xs text-muted">
                Ceritakan singkat tentang karyamu dan hubungkan media sosial.
              </p>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium">
                Bio singkat
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                placeholder="Fotografer, ilustrator, atau desainer visual..."
                defaultValue={v.bio}
                className={inputClass}
              />
              <FieldError message={errors.bio} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium">
                  Instagram
                </label>
                <input
                  id="instagram"
                  name="instagram"
                  placeholder="https://instagram.com/..."
                  defaultValue={v.instagram}
                  className={inputClass}
                />
                <FieldError message={errors.instagram} />
              </div>

              <div>
                <label htmlFor="behance" className="block text-sm font-medium">
                  Behance
                </label>
                <input
                  id="behance"
                  name="behance"
                  placeholder="https://behance.net/..."
                  defaultValue={v.behance}
                  className={inputClass}
                />
                <FieldError message={errors.behance} />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium">
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  placeholder="https://..."
                  defaultValue={v.website}
                  className={inputClass}
                />
                <FieldError message={errors.website} />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-line pt-4">
            <button
              disabled={pending}
              className="cursor-pointer rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
            >
              {pending ? "Menyimpan..." : "Simpan profil"}
            </button>
          </div>
        </section>
      </div>
    </form>
  );
}