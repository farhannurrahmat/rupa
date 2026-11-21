import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOwnedChallenge, getChallengeSubmissions } from "@/lib/queries/challenges";
import PlacementForm from "@/components/challenge/PlacementForm";
import Photo from "@/components/ui/Photo";

export default async function ManageSubmissionsPage({ params }) {
  const { id } = await params;
  const challengeId = Number(id);
  if (!Number.isInteger(challengeId)) notFound();

  const user = await getSession();
  const challenge = await getOwnedChallenge(challengeId, user.id);
  if (!challenge) notFound(); // bukan challenge milikmu, atau tidak ada

  const submissions = await getChallengeSubmissions(challengeId);
  const ended = challenge.status === "ended";
  const endText = new Date(challenge.end_date).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link href="/curator/challenges" className="text-sm text-neutral-400">← Kembali</Link>
        <h1 className="text-3xl font-bold">{challenge.title}</h1>

        <p className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-neutral-300">
          {ended
            ? "Challenge sudah berakhir. Pilih maksimal 3 pemenang, satu peringkat untuk satu karya."
            : `Pemenang baru dapat dipilih setelah challenge berakhir (${endText}).`}
        </p>

        {submissions.length === 0 ? (
          <p className="text-neutral-400">Belum ada karya yang disubmit.</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {submissions.map((s) => (
              <li key={s.submission_id} className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
                <Link href={`/artworks/${s.id}`}>
                  <Photo src={s.file_url} alt={s.title} className="h-48 w-full" />
                </Link>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-sm text-neutral-400">{s.creator_name}</p>
                  </div>
                  {ended ? (
                    <PlacementForm submissionId={s.submission_id} placement={s.placement} />
                  ) : (
                    <p className="text-sm text-neutral-500">Pemilihan pemenang belum dibuka.</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}