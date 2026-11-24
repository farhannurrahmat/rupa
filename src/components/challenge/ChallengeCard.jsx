import Link from "next/link";
import Photo from "@/components/ui/Photo";

const STATUS = { active: "Berlangsung", upcoming: "Segera", ended: "Selesai" };

export default function ChallengeCard({ challenge }) {
  const end = new Date(challenge.end_date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <li>
      <Link
        href={`/challenges/${challenge.id}`}
        className="block overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-accent/60"
      >
        <div className="relative">
          <Photo src={challenge.banner_url} alt={challenge.title} zoom className="h-40 w-full" />
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs backdrop-blur">
            {STATUS[challenge.status] ?? ""}
          </span>
        </div>
        <div className="space-y-1 p-4">
          <h3 className="font-display text-lg font-semibold">{challenge.title}</h3>
          <p className="text-sm text-muted">Oleh {challenge.curator_name} · berakhir {end}</p>
        </div>
      </Link>
    </li>
  );
}