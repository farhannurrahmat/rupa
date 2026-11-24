"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/actions/auth";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 font-display text-2xl font-bold tracking-tight">
        RUPA<span className="text-accent">.</span>
      </Link>

      <div className="w-full max-w-md space-y-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Buat akun baru</h1>
          <p className="text-sm text-muted">
            Bergabung untuk memamerkan karya atau mengurasi challenge.
          </p>
        </div>

        <form action={action} className="space-y-4">
          {state?.error && (
            <p className="rounded-xl border border-red-500/40 bg-red-950/60 px-4 py-2.5 text-sm text-red-200">
              {state.error}
            </p>
          )}

          <div>
            <label htmlFor="displayName" className="mb-1.5 block text-sm font-medium">
              Nama tampilan
            </label>
            <input
              id="displayName"
              name="displayName"
              required
              maxLength={80}
              placeholder="Contoh: Farhan Nurrahmat"
              className="w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm placeholder:text-neutral-500 focus:border-accent focus:outline-none"
            />
          </div>

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
            <span className="mb-1.5 block text-sm font-medium">Daftar sebagai</span>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="member"
                  defaultChecked
                  className="peer sr-only"
                />
                <div className="h-full rounded-xl border border-line bg-ink p-3 transition hover:border-neutral-600 peer-checked:border-accent peer-checked:bg-accent/10">
                  <p className="text-sm font-semibold text-white">Member</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">
                    Unggah karya & ikut challenge
                  </p>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="curator"
                  className="peer sr-only"
                />
                <div className="h-full rounded-xl border border-line bg-ink p-3 transition hover:border-neutral-600 peer-checked:border-accent peer-checked:bg-accent/10">
                  <p className="text-sm font-semibold text-white">Curator</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">
                    Buat challenge, perlu izin Admin
                  </p>
                </div>
              </label>
            </div>
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
              minLength={8}
              placeholder="Minimal 8 karakter"
              className="w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm placeholder:text-neutral-500 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
              Konfirmasi password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              placeholder="Ulangi password"
              className="w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm placeholder:text-neutral-500 focus:border-accent focus:outline-none"
            />
          </div>

          <button
            disabled={pending}
            className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
          >
            {pending ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}