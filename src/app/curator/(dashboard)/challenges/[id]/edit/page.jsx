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
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-3xl font-bold">Edit Challenge</h1>
        <ChallengeForm challenge={challenge} />
      </div>
    </main>
  );
}