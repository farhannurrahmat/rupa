import Link from "next/link";
import { getAllChallenges } from "@/lib/queries/challenges";
import ChallengeCard from "@/components/challenge/ChallengeCard";

const FILTERS = [
  { value: "", label: "Semua" },
  { value: "active", label: "Berlangsung" },
  { value: "upcoming", label: "Akan Datang" },
  { value: "ended", label: "Selesai" },
];

export default async function ChallengesListPage({ searchParams }) {
  const { status } = await searchParams;
  const filter = ["active", "upcoming", "ended"].includes(status) ? status : "";
  const challenges = await getAllChallenges(filter);

  const tab = (active) =>
    `border-b-2 pb-2 text-sm font-medium transition ${
      active ? "border-accent text-white" : "border-transparent text-muted hover:text-white"
    }`;

  return (
    <main className="mx-auto max-w-[1360px] space-y-8 px-6 py-12 sm:px-10">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.22em] text-accent">KOMPETISI TERKURASI</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Daftar Challenge</h1>
        <p className="max-w-xl text-sm text-muted">
          Ikuti challenge dari para Curator Rupa, kirimkan karya terbaikmu, dan raih gelar juara.
        </p>
      </div>

      <nav className="flex flex-wrap gap-6 border-b border-line/60">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/challenges?status=${f.value}` : "/challenges"}
            className={tab(filter === f.value)}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {challenges.length === 0 ? (
        <p className="text-sm text-muted">Belum ada challenge pada kategori ini.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </ul>
      )}
    </main>
  );
}