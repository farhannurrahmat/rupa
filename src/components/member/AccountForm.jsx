"use client";

import { useActionState } from "react";
import { updateAccountAction } from "@/actions/profile";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-400">{message}</p>;
}

export default function AccountForm({ email }) {
  const [state, formAction, pending] = useActionState(updateAccountAction, null);
  const errors = state?.errors ?? {};

  const inputClass =
    "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white";

  return (
    <form action={formAction} className="space-y-4">
      <h2 className="text-xl font-semibold">Akun</h2>

      {state?.success && (
        <p className="rounded-lg bg-green-950 px-4 py-3 text-sm text-green-300">Akun berhasil diperbarui.</p>
      )}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" defaultValue={state?.values?.email ?? email} className={inputClass} />
        <FieldError message={errors.email} />
      </div>

      <div>
        <label htmlFor="newPassword">Password baru (kosongkan jika tidak diganti)</label>
        <input id="newPassword" name="newPassword" type="password" className={inputClass} />
        <FieldError message={errors.newPassword} />
      </div>

      <div>
        <label htmlFor="confirmPassword">Konfirmasi password baru</label>
        <input id="confirmPassword" name="confirmPassword" type="password" className={inputClass} />
        <FieldError message={errors.confirmPassword} />
      </div>

      <div>
        <label htmlFor="currentPassword">Password saat ini (wajib untuk menyimpan)</label>
        <input id="currentPassword" name="currentPassword" type="password" className={inputClass} />
        <FieldError message={errors.currentPassword} />
      </div>

      <button disabled={pending} className="w-full rounded-full border border-neutral-600 py-3 disabled:opacity-50">
        {pending ? "Menyimpan..." : "Simpan akun"}
      </button>
    </form>
  );
}