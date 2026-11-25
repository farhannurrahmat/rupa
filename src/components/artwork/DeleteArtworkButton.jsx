"use client";

import { deleteArtworkAction } from "@/actions/artworks";

export default function DeleteArtworkButton({ id }) {
  return (
    <form
      action={deleteArtworkAction}
      onSubmit={(e) => {
        if (!confirm("Yakin ingin menghapus karya ini?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="cursor-pointer rounded-full border border-red-900/60 bg-red-950/30 px-4 py-1.5 text-xs font-medium text-red-400 transition hover:border-red-500/60 hover:bg-red-950/60 hover:text-red-300"
      >
        Hapus
      </button>
    </form>
  );
}