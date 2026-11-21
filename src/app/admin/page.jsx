import Link from "next/link";
import { getPlatformStats } from "@/lib/queries/admin";

function StatCard({ label, value, href }) {
  const content = (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="mt-2 text-4xl font-bold">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default async function AdminDashboardPage() {
  const s = await getPlatformStats();

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <h1 className="text-3xl font-bold">Statistik Platform</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Pengguna per peran</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Admin" value={s.admins} />
          <StatCard label="Member" value={s.members} />
          <StatCard label="Curator" value={s.curators} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total karya" value={s.artworks} />
        <StatCard label="Laporan belum diproses" value={s.pending_reports} href="/admin/moderation" />
        <StatCard label="Challenge aktif" value={s.active_challenges} />
        <StatCard label="Curator menunggu" value={s.pending_curators} href="/admin/curators" />
      </section>
    </main>
  );
}