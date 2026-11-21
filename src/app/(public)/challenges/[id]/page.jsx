import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import {
  getChallengeDetail,
  getChallengeSubmissions,
  getMemberSubmission,
} from "@/lib/queries/challenges";
import { getArtworksByUser } from "@/lib/queries/artworks";
import { withdrawSubmissionAction } from "@/actions/submissions";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import SubmitWorkForm from "@/components/challenge/SubmitWorkForm";
import ConfirmActionButton from "@/components/admin/ConfirmActionButton";
import Photo from "@/components/ui/Photo";

const STATUS_LABEL = {
  upcoming: { text: "Akan datang", className: "bg-amber-900 text-amber-200" },
  active: { text: "Berlangsung", className: "bg-green-900 text-green-200" },
  ended: { text: "Berakhir", className: "bg-neutral-800 text-neutral-300" },
};

function formatDate(date) {
  return new Date(date).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default async function ChallengeDetailPage({ params }) {
  const { id } = await params;
  const challengeId = Number(id);
  if (!Number.isInteger(challengeId)) notFound();

  const challenge = await getChallengeDetail(challengeId);
  if (!challenge) notFound();

  const user = await getSession();
  const submissions = await getChallengeSubmissions(challengeId);
  const winners = submissions
    .filter((s) => s.placement)
    .sort((a, b) => a.placement - b.placement);
  const status = STATUS_LABEL[challenge.status];

  // Panel aksi menyesuaikan peran dan status challenge
  let panel;
  if (!user) {
    panel = (
      <p className="text-neutral-300">
        <Link href="/login" className="text-violet-400">
          Masuk
        </Link>{" "}
        sebagai Member untuk mengikuti challenge ini.
      </p>
    );
  } else if (user.role !== "member") {
    panel = (
      <p className="text-neutral-300">
        Hanya Member yang dapat mengikuti challenge.
      </p>
    );
  } else {
    const mine = await getMemberSubmission(challengeId, user.id);
    if (mine) {
      panel = (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="flex-1">
            Karyamu <span className="font-semibold">{mine.title}</span> sudah
            disubmit.
          </p>
          {challenge.status !== "ended" && (
            <ConfirmActionButton
              action={withdrawSubmissionAction}
              id={challengeId}
              label="Withdraw"
              confirmText="Tarik submisi ini?"
              className="rounded-full border border-red-500 px-5 py-2 text-red-400"
            />
          )}
        </div>
      );
    } else if (challenge.status === "active") {
      const artworks = await getArtworksByUser(user.id);
      panel = <SubmitWorkForm challengeId={challengeId} artworks={artworks} />;
    } else if (challenge.status === "upcoming") {
      panel = <p className="text-neutral-300">Challenge belum dimulai.</p>;
    } else {
      panel = <p className="text-neutral-300">Challenge sudah berakhir.</p>;
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      <Photo
        src={challenge.banner_url}
        alt={challenge.title}
        priority
        sizes="(max-width: 1024px) 100vw, 1000px"
        className="h-64 w-full rounded-2xl"
      />
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">{challenge.title}</h1>
          <span
            className={`rounded-full px-3 py-1 text-sm ${status.className}`}
          >
            {status.text}
          </span>
        </div>
        <p className="text-neutral-400">
          Oleh {challenge.curator_name} · {formatDate(challenge.start_date)}{" "}
          sampai {formatDate(challenge.end_date)}
        </p>
        <p className="whitespace-pre-line text-neutral-300">
          {challenge.description}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
            <h2 className="mb-2 font-semibold">Aturan</h2>
            <p className="whitespace-pre-line text-neutral-300">
              {challenge.rules}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
            <h2 className="mb-2 font-semibold">Hadiah</h2>
            <p className="whitespace-pre-line text-neutral-300">
              {challenge.prize}
            </p>
          </div>
        </div>
      </section>

      <section>{panel}</section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Pemenang</h2>
        {winners.length === 0 ? (
          <p className="text-neutral-400">Pemenang belum diumumkan.</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {winners.map((w) => (
              <ArtworkCard
                key={w.submission_id}
                artwork={w}
                badge={`Juara ${w.placement}`}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Karya peserta ({submissions.length})
        </h2>
        {submissions.length === 0 ? (
          <p className="text-neutral-400">Belum ada karya yang disubmit.</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {submissions.map((s) => (
              <ArtworkCard key={s.submission_id} artwork={s} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
