"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 font-display text-2xl font-bold tracking-tight">
        RUPA<span className="text-accent">.</span>
      </Link>

      <div className="w-full max-w-md space-y-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Masuk ke Rupa</h1>
          <p className="text-sm text-muted">
            Lanjutkan mengelola karya atau kurasi challenge kamu.
          </p>
        </div>

        <form action={action} className="space-y-4">
          {state?.error && (
            <p className="rounded-xl border border-red-500/40 bg-red-950/60 px-4 py-2.5 text-sm text-red-200">
              {state.error}
            </p>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nama@email.com"
              className="w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm placeholder:text-neutral-500 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Masukkan password"
              className="w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm placeholder:text-neutral-500 focus:border-accent focus:outline-none"
            />
          </div>

          <button
            disabled={pending}
            className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
          >
            {pending ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-accent hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </main>
  );
}