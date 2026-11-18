"use client";

import { deleteArtworkAction } from "@/actions/artworks";

export default function DeleteArtworkButton({ id }) {
  return (
    <form
      action={deleteArtworkAction}
      onSubmit={(e) => {
        // Batalkan  kalau pengguna menekan "Batal" di dialog
        if (!confirm("Hapus karya ini? Tindakan tidak bisa dibatalkan.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="text-sm text-red-400">Hapus</button>
    </form>
  );
}