"use client";

import { useActionState } from "react";
import { addCommentAction } from "@/actions/interactions";

export default function CommentForm({ artworkId }) {
  const [state, formAction, pending] = useActionState(addCommentAction, null);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="artworkId" value={artworkId} />
      <textarea
        name="content"
        rows={3}
        placeholder="Tulis komentar"
        aria-label="Tulis komentar"
        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white"
      />
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button disabled={pending} className="rounded-full bg-violet-500 px-6 py-2 font-semibold text-black disabled:opacity-50">
        {pending ? "Mengirim..." : "Kirim komentar"}
      </button>
    </form>
  );
}