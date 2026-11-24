"use client";

import { useState, useActionState } from "react";
import { updateCategoryAction, deleteCategoryAction } from "@/actions/categories";

export default function CategoryRow({ category }) {
  const [editing, setEditing] = useState(false);

  const [updateState, updateAction, updating] = useActionState(async (prev, formData) => {
    const result = await updateCategoryAction(prev, formData);
    if (result?.success) setEditing(false);
    return result;
  }, null);

  const [deleteState, deleteAction, deleting] = useActionState(deleteCategoryAction, null);

  function handleDelete(e) {
    if (!confirm(`Hapus kategori "${category.name}"?`)) {
      e.preventDefault();
    }
  }

  return (
    <tr className="transition hover:bg-ink/40">
      {editing ? (
        <td colSpan={3} className="px-6 py-4">
          <form action={updateAction} className="flex flex-wrap items-center gap-2.5">
            <input type="hidden" name="id" value={category.id} />
            <input
              name="name"
              defaultValue={category.name}
              aria-label="Nama kategori"
              autoFocus
              className="min-w-48 flex-1 rounded-full border border-line bg-ink px-4 py-1.5 text-sm text-white focus:border-accent focus:outline-none"
            />
            <button
              disabled={updating}
              className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
            >
              {updating ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-line bg-ink px-4 py-1.5 text-xs font-medium text-muted transition hover:text-white"
            >
              Batal
            </button>
          </form>
          {updateState?.error && (
            <p className="mt-2 text-xs text-red-400">{updateState.error}</p>
          )}
        </td>
      ) : (
        <>
          <td className="px-6 py-4 font-medium text-white">
            {category.name}
            {deleteState?.error && (
              <p className="mt-1 text-xs font-normal text-red-400">{deleteState.error}</p>
            )}
          </td>
          <td className="px-6 py-4 text-muted">{category.artwork_count} karya</td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-full border border-line bg-ink px-3.5 py-1 text-xs font-medium text-white transition hover:border-accent hover:text-accent"
              >
                Edit
              </button>
              <form action={deleteAction} onSubmit={handleDelete}>
                <input type="hidden" name="id" value={category.id} />
                <button
                  disabled={deleting}
                  className="rounded-full border border-red-500/30 bg-red-950/30 px-3.5 py-1 text-xs font-medium text-red-300 transition hover:bg-red-950/70 disabled:opacity-50"
                >
                  {deleting ? "Menghapus..." : "Hapus"}
                </button>
              </form>
            </div>
          </td>
        </>
      )}
    </tr>
  );
}