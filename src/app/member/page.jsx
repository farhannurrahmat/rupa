import Link from "next/link";
import { getSession } from "@/lib/session";
import { getMemberStats } from "@/lib/queries/users";
import { getArtworksByUser } from "@/lib/queries/artworks";
import Photo from "@/components/ui/Photo";

export default async function MemberHome() {
  const user = await getSession();
  const [stats, artworks] = await Promise.all([getMemberStats(user.id), getArtworksByUser(user.id)]);

  const cards = [
    { label: "Karya", value: stats.artworks, note: "Karya yang kamu unggah" },
    { label: "Suka diterima", value: stats.likes_received, note: "Dari semua karyamu" },
    { label: "Favorit tersimpan", value: stats.favorites, note: "Karya yang kamu simpan" },
    {
      label: "Submisi challenge",
      value: stats.submissions,
      note: stats.submissions === 0 ? "Belum ikut, yuk mulai" : "Karya di challenge",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Selamat datang kembali</p>
          <h1 className="text-3xl font-bold sm:text-4xl">{user.display_name}</h1>
        </div>
        <Link
          href="/member/artworks/new"
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black shadow-[0_8px_24px_-8px_rgba(217,119,74,0.7)] transition hover:brightness-110"
        >
          + Unggah karya
        </Link>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5 transition hover:border-accent/60">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-2 font-display text-4xl font-bold">{c.value}</p>
            <p className="mt-1 text-xs text-muted">{c.note}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Karya terbaru</h2>
          <Link href="/member/artworks" className="text-sm text-accent">Lihat semua</Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {artworks.slice(0, 3).map((a) => (
            <li key={a.id}>
              <Link href={`/artworks/${a.id}`} className="card group block overflow-hidden transition hover:border-accent/60">
                <div className="relative">
                  <Photo src={a.file_url} alt={a.title} sizes="280px" zoom className="aspect-[4/3] w-full" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs backdrop-blur">
                    {a.category_name}
                  </span>
                </div>
                <div className="p-4">
                  <p className="truncate font-medium">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{a.like_count} suka</p>
                </div>
              </Link>
            </li>
          ))}

          <li>
            <Link
              href="/member/artworks/new"
              className="flex h-full min-h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line text-muted transition hover:border-accent hover:text-accent"
            >
              <span className="text-3xl leading-none">+</span>
              <span className="text-sm">Tambah karya berikutnya</span>
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}