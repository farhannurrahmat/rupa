"use client";

import { useActionState } from "react";
import { deleteArtworkAction } from "@/actions/artworks";

export default function DeleteArtworkButton({ id }) {
  const [state, action, pending] = useActionState(deleteArtworkAction, null);

  function handleSubmit(e) {
    if (!confirm("Hapus karya ini secara permanen?")) {
      e.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={id} />
      <button
        disabled={pending}
        className="rounded-full px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-950/60 disabled:opacity-50"
      >
        {pending ? "Menghapus..." : "Hapus"}
      </button>
      {state?.error && <p className="mt-1 text-xs text-red-400">{state.error}</p>}
    </form>
  );
}