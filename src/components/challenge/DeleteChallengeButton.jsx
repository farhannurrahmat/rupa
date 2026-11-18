"use client";

import { deleteChallengeAction } from "@/actions/challenges";

export default function DeleteChallengeButton({ id }) {
  return (
    <form
      action={deleteChallengeAction}
      onSubmit={(e) => {
        if (!confirm("Hapus challenge ini beserta semua submisinya?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="text-sm text-red-400">Hapus</button>
    </form>
  );
}