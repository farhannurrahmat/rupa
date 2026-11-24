import Link from "next/link";
import { getSession } from "@/lib/session";
import { getSubmissionsByUser } from "@/lib/queries/challenges";
import { withdrawSubmissionAction } from "@/actions/submissions";
import ConfirmActionButton from "@/components/admin/ConfirmActionButton";
import Photo from "@/components/ui/Photo";

const STATUS_BADGE = {
  upcoming: {
    text: "Akan datang",
    className: "border-amber-500/40 bg-amber-950/80 text-amber-200",
  },
  active: {
    text: "Berlangsung",
    className: "border-accent/40 bg-accent/15 text-accent",
  },
  ended: {
    text: "Berakhir",
    className: "border-line bg-ink text-muted",
  },
};

export default async function MySubmissionsPage() {
  const user = await getSession();
  const submissions = await getSubmissionsByUser(user.id);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Submisi Challenge</h1>
          <p className="mt-1 text-sm text-muted">
            {submissions.length} karya diikutsertakan dalam challenge
          </p>
        </div>
        <Link
          href="/challenges"
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
        >
          Cari Challenge
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-sm text-muted">
            Belum ada karya yang disubmit ke challenge. Jelajahi challenge aktif dan kirimkan karya terbaikmu.
          </p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {submissions.map((s) => {
            const badge = STATUS_BADGE[s.status] ?? STATUS_BADGE.ended;
            return (
              <li
                key={s.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-neutral-700"
              >
                <div className="relative overflow-hidden">
                  <Link href={`/challenges/${s.challenge_id}`} className="block">
                    <Photo
                      src={s.file_url}
                      alt={s.artwork_title}
                      className="h-52 w-full transition duration-300 group-hover:scale-105"
                    />
                  </Link>
                  {s.placement && (
                    <span className="absolute top-3 right-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-black shadow-md">
                      Juara {s.placement}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div className="space-y-1.5">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${badge.className}`}
                    >
                      {badge.text}
                    </span>
                    <p className="truncate font-semibold text-white">{s.artwork_title}</p>
                    <Link
                      href={`/challenges/${s.challenge_id}`}
                      className="block truncate text-sm text-accent hover:underline"
                    >
                      {s.challenge_title}
                    </Link>
                    <p className="text-xs text-neutral-500">
                      Disubmit {new Date(s.submitted_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                    <Link
                      href={`/challenges/${s.challenge_id}`}
                      className="rounded-full border border-line bg-ink px-4 py-1.5 text-xs font-medium text-white transition hover:border-accent hover:text-accent"
                    >
                      Lihat Challenge
                    </Link>

                    {s.status !== "ended" && (
                      <ConfirmActionButton
                        action={withdrawSubmissionAction}
                        id={s.challenge_id}
                        label="Tarik Submisi"
                        confirmText="Tarik submisi karya ini dari challenge?"
                        className="rounded-full px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-950/60"
                      />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}