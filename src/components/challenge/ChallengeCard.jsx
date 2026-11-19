import Link from "next/link";

export default function ChallengeCard({ challenge }) {
  const end = new Date(challenge.end_date).toLocaleDateString("id-ID", { dateStyle: "medium" });

  return (
    <li className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
      <Link href={`/challenges/${challenge.id}`}>
        <img src={challenge.banner_url} alt={challenge.title} className="h-36 w-full object-cover" />
        <div className="space-y-1 p-4">
          <h3 className="font-semibold">{challenge.title}</h3>
          <p className="text-sm text-neutral-400">
            Oleh {challenge.curator_name} · berakhir {end}
          </p>
        </div>
      </Link>
    </li>
  );
}