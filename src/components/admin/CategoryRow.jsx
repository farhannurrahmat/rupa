"use client";

import { useState, useActionState } from "react";
import { updateCategoryAction, deleteCategoryAction } from "@/actions/categories";

export default function CategoryRow({ category }) {
  const [editing, setEditing] = useState(false);

  // Setelah simpan berhasil, tutup mode edit
  const [updateState, updateAction, updating] = useActionState(async (prev, formData) => {
    const result = await updateCategoryAction(prev, formData);
    if (result?.success) setEditing(false);
    return result;
  }, null);

  const [deleteState, deleteAction, deleting] = useActionState(deleteCategoryAction, null);

  return (
    <li className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      {editing ? (
        <form action={updateAction} className="flex gap-3">
          <input type="hidden" name="id" value={category.id} />
          <input
            name="name"
            defaultValue={category.name}
            aria-label="Nama kategori"
            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2"
          />
          <button disabled={updating} className="rounded-full bg-violet-500 px-4 text-black">
            Simpan
          </button>
          <button type="button" onClick={() => setEditing(false)} className="px-2 text-neutral-400">
            Batal
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">{category.name}</span>
            <span className="ml-3 text-sm text-neutral-400">{category.artwork_count} karya</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <button onClick={() => setEditing(true)} className="text-violet-400">Edit</button>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={category.id} />
              <button disabled={deleting} className="text-red-400">Hapus</button>
            </form>
          </div>
        </div>
      )}

      {updateState?.error && <p className="mt-2 text-sm text-red-400">{updateState.error}</p>}
      {deleteState?.error && <p className="mt-2 text-sm text-red-400">{deleteState.error}</p>}
    </li>
  );
}