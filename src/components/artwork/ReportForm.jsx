"use client";

import { useState, useActionState } from "react";
import { reportArtworkAction } from "@/actions/interactions";
import { REPORT_REASONS } from "@/lib/constants";

export default function ReportForm({ artworkId, alreadyReported }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(reportArtworkAction, null);

  if (alreadyReported || state?.success) {
    return <p className="text-sm text-neutral-500">Kamu sudah melaporkan karya ini.</p>;
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm text-neutral-400 underline">
        Laporkan karya
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <input type="hidden" name="artworkId" value={artworkId} />
      <label htmlFor="reason" className="text-sm">Alasan laporan</label>
      <select
        id="reason"
        name="reason"
        defaultValue=""
        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2"
      >
        <option value="" disabled>Pilih alasan</option>
        {REPORT_REASONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <div className="flex gap-3">
        <button disabled={pending} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50">
          {pending ? "Mengirim..." : "Kirim laporan"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-neutral-400">Batal</button>
      </div>
    </form>
  );
}