import Link from "next/link";
import { getSession } from "@/lib/session";
import { getArtworks } from "@/lib/queries/artworks";
import { getChallenges } from "@/lib/queries/challenges";
import { getAllCategories } from "@/lib/queries/categories";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import ChallengeBanner from "@/components/home/ChallengeBanner";
import HeroTunnel from "@/components/home/HeroTunnel";
import GalleryFx from "@/components/home/GalleryFx";
import Reveal from "@/components/ui/Reveal";

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const sort = params?.sort === "latest" ? "latest" : "popular";

  const user = await getSession();
  const viewerId = user?.role === "member" ? user.id : null;
  const interactive = viewerId !== null;
  const categories = await getAllCategories();

  const popular = (await getArtworks({ sort: "popular", limit: 20, viewerId })).items;
  const latest = (await getArtworks({ sort: "latest", limit: 20, viewerId })).items;
  const challenges = await getChallenges({ activeOnly: true, limit: 6 });

  const activeItems = sort === "latest" ? latest : popular;

  const heroItems = [...popular, ...latest.filter((l) => !popular.some((p) => p.id === l.id))]
    .slice(0, 8)
    .map(({ id, title, file_url, creator_name }) => ({ id, title, file_url, creator_name }));

  const ctaHref = !user ? "/register" : user.role === "member" ? "/member/artworks/new" : "/challenges";
  const ctaText = !user ? "Pamerkan karyamu" : user.role === "member" ? "Unggah karyamu" : "Lihat challenge";

  const pill = (active) =>
    `rounded-full px-4 py-1.5 text-xs font-medium transition ${
      active
        ? "bg-accent font-semibold text-black"
        : "border border-line bg-surface text-muted hover:text-white"
    }`;

  return (
    <>
      <GalleryFx />
      <HeroTunnel items={heroItems} ctaHref={ctaHref} ctaText={ctaText} />

      <div id="galeri" className="mx-auto max-w-[1360px] scroll-mt-16 space-y-6 px-6 py-12 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">
              {sort === "latest" ? "Karya Terbaru" : "Karya Populer"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {sort === "latest"
                ? "Unggahan visual terbaru dari para kreator."
                : "Kurasi karya dengan apresiasi terbanyak dari komunitas."}
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <div className="flex items-center gap-1.5">
              <Link href="/?sort=popular#galeri" scroll={false} className={pill(sort === "popular")}>
                Populer
              </Link>
              <Link href="/?sort=latest#galeri" scroll={false} className={pill(sort === "latest")}>
                Terbaru
              </Link>
            </div>

            <form action="/artworks" method="get" className="w-full sm:w-64">
              <input
                name="q"
                placeholder="Cari karya atau kreator"
                aria-label="Cari"
                className="w-full border-b border-line bg-transparent pb-1.5 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </form>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-line/60 pb-2">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href={sort === "latest" ? "/artworks?sort=latest" : "/artworks"}
              className="text-sm font-medium text-white transition hover:text-accent"
            >
              Semua
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/artworks?category=${c.id}${sort === "latest" ? "&sort=latest" : ""}`}
                className="text-sm font-medium text-muted transition hover:text-white"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <Link
            href={sort === "latest" ? "/artworks?sort=latest" : "/artworks"}
            className="text-sm font-semibold text-accent transition hover:brightness-110"
          >
            Lihat semua karya →
          </Link>
        </nav>

        {activeItems.length === 0 ? (
          <p className="text-sm text-neutral-400">Belum ada karya.</p>
        ) : (
          <div className="relative">
            <div className="max-h-[1200px] overflow-hidden">
              <ArtworkGrid items={activeItems} interactive={interactive} />
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-56 items-end justify-center bg-gradient-to-t from-ink via-ink/90 to-transparent pb-4">
              <Link
                href={sort === "latest" ? "/artworks?sort=latest" : "/artworks"}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-accent/60 bg-surface/95 px-7 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-sm transition hover:border-accent hover:bg-accent hover:text-black"
              >
                <span>Jelajahi seluruh galeri</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-[1360px] space-y-12 px-6 py-12 sm:px-10">
        {challenges.length > 0 ? (
          <Reveal>
            <ChallengeBanner challenge={challenges[0]} extra={latest.slice(0, 2)} />
          </Reveal>
        ) : (
          <div className="flex flex-col items-start justify-between gap-4 rounded-sm border border-line bg-surface px-6 py-8 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <p className="font-display text-base font-semibold text-white">
                Belum ada challenge aktif saat ini
              </p>
              <p className="text-sm text-muted">
                {user?.role === "curator"
                  ? "Buka tema kurasi baru untuk mengundang kreator mengirimkan karya terbaiknya."
                  : "Jelajahi arsip galeri sambil menunggu tema kurasi berikutnya dibuka."}
              </p>
            </div>

            <Link
              href={user?.role === "curator" ? "/curator/challenges/new" : "/artworks"}
              className="shrink-0 rounded-full border border-line px-5 py-2 text-xs font-semibold text-white transition hover:border-accent hover:text-accent"
            >
              {user?.role === "curator" ? "Buat challenge" : "Lihat arsip karya"}
            </Link>
          </div>
        )}

        {challenges.length > 1 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Challenge lainnya</h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {challenges.slice(1).map((c) => (
                <ChallengeCard key={c.id} challenge={c} />
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}