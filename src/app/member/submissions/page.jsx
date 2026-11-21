import Link from "next/link";
import { getSession } from "@/lib/session";
import { getSubmissionsByUser } from "@/lib/queries/challenges";
import { withdrawSubmissionAction } from "@/actions/submissions";
import ConfirmActionButton from "@/components/admin/ConfirmActionButton";
import Photo from "@/components/ui/Photo";

const STATUS_TEXT = { upcoming: "Akan datang", active: "Berlangsung", ended: "Berakhir" };

export default async function MySubmissionsPage() {
  const user = await getSession();
  const submissions = await getSubmissionsByUser(user.id);

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Submisi Saya</h1>

      {submissions.length === 0 ? (
        <p className="text-neutral-400">Belum ada karya yang disubmit ke challenge.</p>
      ) : (
        <ul className="space-y-3">
          {submissions.map((s) => (
            <li key={s.id} className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <Photo src={s.file_url} alt={s.artwork_title} sizes="80px" className="h-20 w-20 shrink-0 rounded-lg" />
              <div className="flex-1">
                <p className="font-semibold">{s.artwork_title}</p>
                <Link href={`/challenges/${s.challenge_id}`} className="text-sm text-violet-400">
                  {s.challenge_title}
                </Link>
                <p className="text-sm text-neutral-400">
                  {STATUS_TEXT[s.status]} · disubmit {new Date(s.submitted_at).toLocaleDateString("id-ID")}
                </p>
              </div>
              {s.placement && (
                <span className="rounded-full bg-amber-400 px-3 py-1 text-sm font-semibold text-black">
                  Juara {s.placement}
                </span>
              )}
              {s.status !== "ended" && (
                <ConfirmActionButton
                  action={withdrawSubmissionAction}
                  id={s.challenge_id}
                  label="Withdraw"
                  confirmText="Tarik submisi ini?"
                  className="text-sm text-red-400"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}