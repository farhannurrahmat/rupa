"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  const inputClass =
    "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white";

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <form action={formAction} className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold">Masuk ke Rupa</h1>

        {state?.error && (
          <p className="rounded-lg bg-red-950 px-4 py-3 text-sm text-red-300">{state.error}</p>
        )}

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" defaultValue={state?.values?.email} className={inputClass} />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className={inputClass} />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-violet-500 py-3 font-semibold text-black disabled:opacity-50"
        >
          {pending ? "Memproses..." : "Masuk"}
        </button>

        <p className="text-center text-sm text-neutral-400">
          Belum punya akun? <Link href="/register" className="text-violet-400">Daftar</Link>
        </p>
      </form>
    </main>
  );
}