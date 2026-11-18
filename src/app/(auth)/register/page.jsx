"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/actions/auth";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-400">{message}</p>;
}

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, null);
  const errors = state?.errors ?? {};
  const values = state?.values ?? {};

  const inputClass =
    "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white";

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <form action={formAction} className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold">Daftar di Rupa</h1>

        <div>
          <label htmlFor="displayName">Nama tampilan</label>
          <input id="displayName" name="displayName" defaultValue={values.displayName} className={inputClass} />
          <FieldError message={errors.displayName} />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" defaultValue={values.email} className={inputClass} />
          <FieldError message={errors.email} />
        </div>

        <div>
          <label htmlFor="role">Daftar sebagai</label>
          <select id="role" name="role" defaultValue={values.role ?? "member"} className={inputClass}>
            <option value="member">Member (kreator)</option>
            <option value="curator">Curator (butuh persetujuan Admin)</option>
          </select>
          <FieldError message={errors.role} />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className={inputClass} />
          <FieldError message={errors.password} />
        </div>

        <div>
          <label htmlFor="confirmPassword">Konfirmasi password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" className={inputClass} />
          <FieldError message={errors.confirmPassword} />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-violet-500 py-3 font-semibold text-black disabled:opacity-50"
        >
          {pending ? "Memproses..." : "Daftar"}
        </button>

        <p className="text-center text-sm text-neutral-400">
          Sudah punya akun? <Link href="/login" className="text-violet-400">Masuk</Link>
        </p>
      </form>
    </main>
  );
}