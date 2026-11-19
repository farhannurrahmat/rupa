import Link from "next/link";
import { getArtworks } from "@/lib/queries/artworks";
import { getChallenges } from "@/lib/queries/challenges";
import { getAllCategories } from "@/lib/queries/categories";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import ChallengeCard from "@/components/challenge/ChallengeCard";

// Membuat alamat dengan parameter pencarian
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

  // Semua nilai dari URL dibersihkan dulu
  const q = String(params.q ?? "").trim().slice(0, 100);
  const rawCategory = Number(params.category);
  const categoryId = Number.isInteger(rawCategory) && rawCategory > 0 ? rawCategory : null;
  const rawPage = Number(params.page);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const searching = q !== "" || categoryId !== null;
  const categories = await getAllCategories();

  let results = null;
  let popular = null;
  let latest = null;
  let challenges = null;

  if (searching) {
    results = await getArtworks({ q, categoryId, sort: "latest", page, limit: 12 });
    // Pencarian teks juga mencari challenge berdasarkan judul
    challenges = q ? await getChallenges({ q, limit: 6 }) : [];
  } else {
    popular = (await getArtworks({ sort: "popular", limit: 8 })).items;
    latest = (await getArtworks({ sort: "latest", limit: 8 })).items;
    challenges = await getChallenges({ activeOnly: true, limit: 6 });
  }

  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-10">
      <section className="space-y-6">
        <h1 className="text-4xl font-bold">Tempat karya menemukan penontonnya.</h1>

        {/* Form GET biasa: pencarian muncul di alamat URL */}
        <form action="/" method="get" className="flex max-w-xl gap-3">
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari karya, kreator, atau challenge"
            aria-label="Cari"
            className="flex-1 rounded-full border border-neutral-700 bg-neutral-900 px-5 py-3"
          />
          {categoryId && <input type="hidden" name="category" value={categoryId} />}
          <button className="rounded-full bg-violet-500 px-6 font-semibold text-black">Cari</button>
        </form>

        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref({ q })}
            className={`rounded-full px-4 py-2 text-sm ${
              categoryId === null ? "bg-white text-black" : "border border-neutral-700 text-neutral-300"
            }`}
          >
            Semua
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={buildHref({ q, category: c.id })}
              className={`rounded-full px-4 py-2 text-sm ${
                categoryId === c.id ? "bg-white text-black" : "border border-neutral-700 text-neutral-300"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {searching ? (
        <>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Hasil pencarian karya</h2>
            {results.items.length === 0 ? (
              <p className="text-neutral-400">Tidak ada karya yang cocok.</p>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {results.items.map((a) => (
                  <ArtworkCard key={a.id} artwork={a} />
                ))}
              </ul>
            )}

            <div className="flex gap-3">
              {page > 1 && (
                <Link href={buildHref({ q, category: categoryId, page: page - 1 })} className="rounded-full border border-neutral-600 px-5 py-2">
                  Sebelumnya
                </Link>
              )}
              {results.hasMore && (
                <Link href={buildHref({ q, category: categoryId, page: page + 1 })} className="rounded-full border border-neutral-600 px-5 py-2">
                  Berikutnya
                </Link>
              )}
            </div>
          </section>

          {q && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Challenge yang cocok</h2>
              {challenges.length === 0 ? (
                <p className="text-neutral-400">Tidak ada challenge yang cocok.</p>
              ) : (
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {challenges.map((c) => (
                    <ChallengeCard key={c.id} challenge={c} />
                  ))}
                </ul>
              )}
            </section>
          )}
        </>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Populer</h2>
            {popular.length === 0 ? (
              <p className="text-neutral-400">Belum ada karya.</p>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {popular.map((a) => (
                  <ArtworkCard key={a.id} artwork={a} />
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Terbaru</h2>
            {latest.length === 0 ? (
              <p className="text-neutral-400">Belum ada karya.</p>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {latest.map((a) => (
                  <ArtworkCard key={a.id} artwork={a} />
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Challenge berlangsung</h2>
            {challenges.length === 0 ? (
              <p className="text-neutral-400">Belum ada challenge yang sedang berlangsung.</p>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {challenges.map((c) => (
                  <ChallengeCard key={c.id} challenge={c} />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}