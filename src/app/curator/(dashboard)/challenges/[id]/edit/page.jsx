import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getChallengeForEdit } from "@/lib/queries/challenges";
import ChallengeForm from "@/components/challenge/ChallengeForm";

export default async function EditChallengePage({ params }) {
  const { id } = await params;
  const challengeId = Number(id);
  if (!Number.isInteger(challengeId)) notFound();

  const user = await getSession();
  const challenge = await getChallengeForEdit(challengeId, user.id);
  if (!challenge) notFound();

  return (
    <main className="w-full space-y-6 px-6 py-10 sm:px-10">
      <div>
        <h1 className="text-3xl font-bold">Edit Challenge</h1>
        <p className="mt-1 text-sm text-muted">
          Perbarui informasi, jadwal, atau banner challenge.
        </p>
      </div>
      <ChallengeForm challenge={challenge} />
    </main>
  );
}