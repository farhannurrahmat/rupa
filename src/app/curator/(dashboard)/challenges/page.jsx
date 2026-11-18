import Link from "next/link";
import { getSession } from "@/lib/session";
import { getChallengesByCurator } from "@/lib/queries/challenges";
import DeleteChallengeButton from "@/components/challenge/DeleteChallengeButton";

const STATUS_LABEL = {
  upcoming: { text: "Akan datang", className: "bg-amber-900 text-amber-200" },
  active: { text: "Berlangsung", className: "bg-green-900 text-green-200" },
  ended: { text: "Berakhir", className: "bg-neutral-800 text-neutral-300" },
};

function formatDate(date) {
  return new Date(date).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

export default async function CuratorChallengesPage() {
  const user = await getSession();
  const challenges = await getChallengesByCurator(user.id);

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Challenge Saya</h1>
          <Link href="/curator/challenges/new" className="rounded-full bg-violet-500 px-6 py-2 font-semibold text-black">
            Buat challenge
          </Link>
        </div>

        {challenges.length === 0 ? (
          <p className="text-neutral-400">Belum ada challenge. Buat challenge pertamamu.</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2">
            {challenges.map((c) => {
              const status = STATUS_LABEL[c.status];
              return (
                <li key={c.id} className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
                  <img src={c.banner_url} alt={c.title} className="h-40 w-full object-cover" />
                  <div className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-semibold">{c.title}</h2>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs ${status.className}`}>{status.text}</span>
                    </div>
                    <p className="text-sm text-neutral-400">
                      {formatDate(c.start_date)} sampai {formatDate(c.end_date)}
                    </p>
                    <p className="text-sm text-neutral-400">{c.submission_count} karya masuk</p>
                    <div className="flex items-center gap-4 pt-2">
                      <Link href={`/curator/challenges/${c.id}/edit`} className="text-sm text-violet-400">Edit</Link>
                      <DeleteChallengeButton id={c.id} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}