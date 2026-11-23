import Link from "next/link";
import { getSession } from "@/lib/session";
import { getChallenges } from "@/lib/queries/challenges";
import { getAllCategories } from "@/lib/queries/categories";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import HeroFan from "@/components/home/HeroFan";
import Reveal from "@/components/ui/Reveal";
import ParallaxLayer from "@/components/home/ParallaxLayer";
import FeaturedSlats from "@/components/home/FeaturedSlats";
import { getArtworks, getFeaturedArtworks } from "@/lib/queries/artworks";

function buildHref({ q, category, page }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", String(category));
  if (page > 1) params.set("page", String(page));
  const text = params.toString();
  return text ? `/?${text}` : "/";
}

function Section({ title, empty, children, hasItems }) {
  return (
    <Reveal>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {hasItems ? children : <p className="text-neutral-400">{empty}</p>}
      </section>
    </Reveal>
  );
}

export default async function HomePage({ searchParams }) {
  const params = await searchParams;

  const q = String(params.q ?? "")
    .trim()
    .slice(0, 100);
  const rawCategory = Number(params.category);
  const categoryId =
    Number.isInteger(rawCategory) && rawCategory > 0 ? rawCategory : null;
  const rawPage = Number(params.page);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const user = await getSession();
  const viewerId = user?.role === "member" ? user.id : null;
  const interactive = viewerId !== null;

  const searching = q !== "" || categoryId !== null;
  const categories = await getAllCategories();

  let results, popular, latest, challenges, featured;
  if (searching) {
    results = await getArtworks({ q, categoryId, page, limit: 12, viewerId });
    challenges = q ? await getChallenges({ q, limit: 6 }) : [];
  } else {
    popular = (await getArtworks({ sort: "popular", limit: 8, viewerId }))
      .items;
    latest = (await getArtworks({ sort: "latest", limit: 8, viewerId })).items;
    challenges = await getChallenges({ activeOnly: true, limit: 6 });
    featured = await getFeaturedArtworks(6);
  }

  const chip = (active) =>
    `rounded-full px-4 py-2 text-sm transition ${
      active
        ? "bg-white text-black"
        : "border border-line text-neutral-300 hover:border-accent"
    }`;

  const grid = (items) => (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((a) => (
        <ArtworkCard key={a.id} artwork={a} interactive={interactive} />
      ))}
    </ul>
  );

  const challengeGrid = (items) => (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <ChallengeCard key={c.id} challenge={c} />
      ))}
    </ul>
  );

  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-8">
      <section className="space-y-6 text-center">
        {!searching && (
          <ParallaxLayer speed={0.1}>
            <HeroFan artworks={popular} />
          </ParallaxLayer>
        )}

        <div className="space-y-3">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Karya yang membuatmu{" "}
            <span className="text-accent">berhenti scroll</span>.
          </h1>
          {!searching && (
            <p className="mx-auto max-w-xl text-muted">
              Foto, ilustrasi, desain, dan karya seni lainnya. Satu tempat untuk
              memamerkan dan menemukan.
            </p>
          )}
        </div>

        <form action="/" method="get" className="mx-auto flex max-w-xl gap-3">
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari karya, kreator, atau challenge"
            aria-label="Cari"
            className="min-w-0 flex-1 rounded-full border border-line bg-surface px-5 py-3"
          />
          {categoryId && (
            <input type="hidden" name="category" value={categoryId} />
          )}
          <button className="rounded-full bg-accent px-6 font-semibold text-black">
            Cari
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-2">
          <Link href={buildHref({ q })} className={chip(categoryId === null)}>
            Semua
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={buildHref({ q, category: c.id })}
              className={chip(categoryId === c.id)}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {searching ? (
        <>
          <Section
            title="Hasil pencarian karya"
            empty="Tidak ada karya yang cocok."
            hasItems={results.items.length > 0}
          >
            {grid(results.items)}
            <div className="flex gap-3 pt-2">
              {page > 1 && (
                <Link
                  href={buildHref({ q, category: categoryId, page: page - 1 })}
                  className="rounded-full border border-line px-5 py-2"
                >
                  Sebelumnya
                </Link>
              )}
              {results.hasMore && (
                <Link
                  href={buildHref({ q, category: categoryId, page: page + 1 })}
                  className="rounded-full border border-line px-5 py-2"
                >
                  Berikutnya
                </Link>
              )}
            </div>
          </Section>
          {q && (
            <Section
              title="Challenge yang cocok"
              empty="Tidak ada challenge yang cocok."
              hasItems={challenges.length > 0}
            >
              {challengeGrid(challenges)}
            </Section>
          )}
        </>
      ) : (
        <>
          {featured.length >= 3 && (
            <Reveal>
              <section className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold">Pilihan Rupa</h2>
                  <p className="text-sm text-muted">
                    Juara challenge dan karya terfavorit.
                  </p>
                </div>
                <FeaturedSlats items={featured} />
              </section>
            </Reveal>
          )}
          <Section
            title="Populer"
            empty="Belum ada karya."
            hasItems={popular.length > 0}
          >
            {grid(popular)}
          </Section>
          <Section
            title="Terbaru"
            empty="Belum ada karya."
            hasItems={latest.length > 0}
          >
            {grid(latest)}
          </Section>
          <Section
            title="Challenge berlangsung"
            empty="Belum ada challenge yang sedang berlangsung."
            hasItems={challenges.length > 0}
          >
            {challengeGrid(challenges)}
          </Section>
        </>
      )}
    </main>
  );
}
