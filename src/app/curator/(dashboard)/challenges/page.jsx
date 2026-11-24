import Link from "next/link";
import { getSession } from "@/lib/session";
import { getChallengesByCurator } from "@/lib/queries/challenges";
import DeleteChallengeButton from "@/components/challenge/DeleteChallengeButton";
import Photo from "@/components/ui/Photo";

const STATUS_LABEL = {
  upcoming: {
    text: "Akan datang",
    className: "border border-amber-500/40 bg-amber-950/70 text-amber-200",
  },
  active: {
    text: "Berlangsung",
    className: "border border-accent/40 bg-accent/15 text-accent",
  },
  ended: {
    text: "Berakhir",
    className: "border border-line bg-ink text-muted",
  },
};

function formatDate(date) {
  return new Date(date).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function CuratorChallengesPage() {
  const user = await getSession();
  const challenges = await getChallengesByCurator(user.id);

  return (
    <main className="w-full space-y-6 px-6 py-10 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Challenge Saya</h1>
          <p className="mt-1 text-sm text-muted">
            {challenges.length} challenge dikelola
          </p>
        </div>
        <Link
          href="/curator/challenges/new"
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
        >
          + Buat challenge
        </Link>
      </div>

      {challenges.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-sm text-muted">
            Belum ada challenge. Buat challenge pertamamu untuk mulai mengumpulkan karya.
          </p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c) => {
            const status = STATUS_LABEL[c.status] ?? STATUS_LABEL.ended;
            return (
              <li
                key={c.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-neutral-700"
              >
                <Link href={`/challenges/${c.id}`} className="block overflow-hidden">
                  <Photo
                    src={c.banner_url}
                    alt={c.title}
                    className="h-44 w-full transition duration-300 group-hover:scale-105"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/challenges/${c.id}`}
                        className="font-semibold text-white transition hover:text-accent"
                      >
                        {c.title}
                      </Link>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                      >
                        {status.text}
                      </span>
                    </div>

                    <p className="text-xs text-muted">
                      {formatDate(c.start_date)} – {formatDate(c.end_date)}
                    </p>
                    <p className="text-sm font-medium text-neutral-300">
                      {c.submission_count} karya masuk
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/curator/challenges/${c.id}/submissions`}
                        className="rounded-full bg-accent/15 px-3.5 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent hover:text-black"
                      >
                        Kelola submisi
                      </Link>
                      <Link
                        href={`/curator/challenges/${c.id}/edit`}
                        className="rounded-full border border-line bg-ink px-3.5 py-1.5 text-xs font-medium text-white transition hover:border-accent hover:text-accent"
                      >
                        Edit
                      </Link>
                    </div>

                    <DeleteChallengeButton id={c.id} />
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