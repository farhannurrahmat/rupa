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
      <button className="rounded-full border border-red-500/30 bg-red-950/30 px-3.5 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-950/70">
        Hapus
      </button>
    </form>
  );
}