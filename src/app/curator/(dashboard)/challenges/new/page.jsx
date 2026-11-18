import ChallengeForm from "@/components/challenge/ChallengeForm";

export default function NewChallengePage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-3xl font-bold">Buat Challenge</h1>
        <ChallengeForm />
      </div>
    </main>
  );
}