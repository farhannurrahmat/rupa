"use client";

import { useActionState } from "react";
import { createCategoryAction } from "@/actions/categories";

export default function CategoryForm() {
  const [state, formAction, pending] = useActionState(createCategoryAction, null);

  return (
    <form action={formAction} className="space-y-2">
      <div className="flex gap-3">
        <input
          name="name"
          placeholder="Nama kategori baru"
          defaultValue={state?.name}
          aria-label="Nama kategori baru"
          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3"
        />
        <button
          disabled={pending}
          className="rounded-full bg-violet-500 px-6 font-semibold text-black disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "Tambah"}
        </button>
      </div>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}