"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitArtworkAction } from "@/actions/submissions";

export default function SubmitWorkForm({ challengeId, artworks }) {
  const [state, formAction, pending] = useActionState(submitArtworkAction, null);

  if (artworks.length === 0) {
    return (
      <p className="text-neutral-300">
        Kamu belum punya karya.{" "}
        <Link href="/member/artworks/new" className="text-violet-400">Unggah karya dulu</Link>.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <input type="hidden" name="challengeId" value={challengeId} />
      <label htmlFor="artworkId" className="font-medium">Pilih satu karya dari portofoliomu</label>
      <select
        id="artworkId"
        name="artworkId"
        defaultValue=""
        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3"
      >
        <option value="" disabled>Pilih karya</option>
        {artworks.map((a) => (
          <option key={a.id} value={a.id}>{a.title}</option>
        ))}
      </select>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button disabled={pending} className="rounded-full bg-violet-500 px-6 py-3 font-semibold text-black disabled:opacity-50">
        {pending ? "Mengirim..." : "Submit Your Work"}
      </button>
    </form>
  );
}