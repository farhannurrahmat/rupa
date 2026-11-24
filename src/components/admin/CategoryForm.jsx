"use client";

import { useActionState } from "react";
import { createCategoryAction } from "@/actions/categories";

export default function CategoryForm() {
  const [state, formAction, pending] = useActionState(createCategoryAction, null);

  return (
    <form action={formAction} className="w-full space-y-1.5 sm:w-auto">
      <div className="flex items-center gap-2.5">
        <input
          name="name"
          placeholder="Nama kategori baru"
          defaultValue={state?.name}
          aria-label="Nama kategori baru"
          className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-accent focus:outline-none sm:w-64"
        />
        <button
          disabled={pending}
          className="shrink-0 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
        >
          {pending ? "..." : "+ Tambah"}
        </button>
      </div>
      {state?.error && <p className="px-2 text-xs text-red-400">{state.error}</p>}
    </form>
  );
}