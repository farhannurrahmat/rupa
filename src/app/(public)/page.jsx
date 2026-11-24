import Link from "next/link";
import { getSession } from "@/lib/session";
import { getArtworks } from "@/lib/queries/artworks";
import { getChallenges } from "@/lib/queries/challenges";
import { getAllCategories } from "@/lib/queries/categories";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import ChallengeBanner from "@/components/home/ChallengeBanner";
import HeroTunnel from "@/components/home/HeroTunnel";
import GalleryFx from "@/components/home/GalleryFx";
import Reveal from "@/components/ui/Reveal";

function buildHref({ q, category, page }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", String(category));
  if (page > 1) params.set("page", String(page));
  const text = params.toString();
  return text ? `/?${text}` : "/";
}

export default async function HomePage({ searchParams }) {
  const params = await searchParams;

  const q = String(params.q ?? "").trim().slice(0, 100);
  const rawCategory = Number(params.category);
  const categoryId = Number.isInteger(rawCategory) && rawCategory > 0 ? rawCategory : null;
  const rawPage = Number(params.page);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const user = await getSession();
  const viewerId = user?.role === "member" ? user.id : null;
  const interactive = viewerId !== null;
  const searching = q !== "" || categoryId !== null;
  const categories = await getAllCategories();

  let results = null;
  let popular = [];
  let latest = [];
  let challenges = [];

  if (searching) {
    results = await getArtworks({ q, categoryId, page, limit: 12, viewerId });
    challenges = q ? await getChallenges({ q, limit: 6 }) : [];
  } else {
    popular = (await getArtworks({ sort: "popular", limit: 9, viewerId })).items;
    latest = (await getArtworks({ sort: "latest", limit: 8, viewerId })).items;
    challenges = await getChallenges({ activeOnly: true, limit: 6 });
  }

  const heroItems = [...popular, ...latest.filter((l) => !popular.some((p) => p.id === l.id))]
    .slice(0, 8)
    .map(({ id, title, file_url, creator_name }) => ({ id, title, file_url, creator_name }));

  const ctaHref = !user ? "/register" : user.role === "member" ? "/member/artworks/new" : "/challenges";
  const ctaText = !user ? "Pamerkan karyamu" : user.role === "member" ? "Unggah karyamu" : "Lihat challenge";

  const tab = (active) =>
    `border-b-2 pb-1.5 text-sm font-medium transition ${
      active ? "border-accent text-white" : "border-transparent text-muted hover:text-white"
    }`;

  const gallery = searching ? results.items : popular;

  return (
    <>
      <GalleryFx />
      {!searching && <HeroTunnel items={heroItems} ctaHref={ctaHref} ctaText={ctaText} />}

      <div id="galeri" className="mx-auto max-w-[1360px] scroll-mt-16 space-y-6 px-6 py-12 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-bold sm:text-4xl">{searching ? "Hasil pencarian" : "Populer"}</h2>
          <form action="/" method="get" className="w-full sm:w-72">
            <input
              name="q"
              defaultValue={q}
              placeholder="Cari karya atau kreator"
              aria-label="Cari"
              className="w-full border-b border-line bg-transparent pb-1.5 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
            />
            {categoryId && <input type="hidden" name="category" value={categoryId} />}
          </form>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line/60">
          <Link href={buildHref({ q })} className={tab(categoryId === null)}>Semua</Link>
          {categories.map((c) => (
            <Link key={c.id} href={buildHref({ q, category: c.id })} className={tab(categoryId === c.id)}>
              {c.name}
            </Link>
          ))}
        </nav>

        {gallery.length === 0 ? (
          <p className="text-sm text-neutral-400">{searching ? "Tidak ada karya yang cocok." : "Belum ada karya."}</p>
        ) : (
          <ul className="columns-1 gap-6 sm:columns-2 md:columns-3 lg:columns-4">
            {gallery.map((a) => (
              <ArtworkCard key={a.id} artwork={a} interactive={interactive} />
            ))}
          </ul>
        )}

        {searching && (
          <div className="flex gap-3">
            {page > 1 && (
              <Link href={buildHref({ q, category: categoryId, page: page - 1 })} className="rounded-full border border-line px-4 py-1.5 text-sm">
                Sebelumnya
              </Link>
            )}
            {results.hasMore && (
              <Link href={buildHref({ q, category: categoryId, page: page + 1 })} className="rounded-full border border-line px-4 py-1.5 text-sm">
                Berikutnya
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-[1360px] space-y-12 px-6 py-12 sm:px-10">
        {searching ? (
          q && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Challenge yang cocok</h2>
              {challenges.length === 0 ? (
                <p className="text-sm text-neutral-400">Tidak ada challenge yang cocok.</p>
              ) : (
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {challenges.map((c) => (
                    <ChallengeCard key={c.id} challenge={c} />
                  ))}
                </ul>
              )}
            </section>
          )
        ) : (
          <>
            {challenges.length > 0 ? (
              <Reveal>
                <ChallengeBanner challenge={challenges[0]} extra={latest.slice(0, 2)} />
              </Reveal>
            ) : (
              <p className="text-sm text-neutral-400">Belum ada challenge yang sedang berlangsung.</p>
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
          </>
        )}
      </div>
    </>
  );
}