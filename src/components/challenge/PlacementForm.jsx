"use client";

import { useActionState } from "react";
import { setPlacementAction } from "@/actions/winners";

export default function PlacementForm({ submissionId, placement }) {
  const [state, formAction, pending] = useActionState(setPlacementAction, null);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="submissionId" value={submissionId} />
      <div className="flex gap-2">
        <select
          name="placement"
          defaultValue={placement ?? ""}
          aria-label="Peringkat"
          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2"
        >
          <option value="">Bukan pemenang</option>
          <option value="1">Juara 1</option>
          <option value="2">Juara 2</option>
          <option value="3">Juara 3</option>
        </select>
        <button disabled={pending} className="rounded-full bg-violet-500 px-4 text-sm font-semibold text-black disabled:opacity-50">
          Simpan
        </button>
      </div>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-400">Tersimpan.</p>}
    </form>
  );
}