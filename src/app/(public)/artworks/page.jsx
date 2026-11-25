import Link from "next/link";
import { getSession } from "@/lib/session";
import { getArtworks } from "@/lib/queries/artworks";
import { getAllCategories } from "@/lib/queries/categories";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import GalleryFx from "@/components/home/GalleryFx";

function buildHref({ q, category, sort, page }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", String(category));
  if (sort && sort !== "latest") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  const text = params.toString();
  return text ? `/artworks?${text}` : "/artworks";
}

export default async function ArtworksPage({ searchParams }) {
  const params = await searchParams;

  const q = String(params.q ?? "").trim().slice(0, 100);
  const rawCategory = Number(params.category);
  const categoryId = Number.isInteger(rawCategory) && rawCategory > 0 ? rawCategory : null;
  const sort = params.sort === "popular" ? "popular" : "latest";
  const rawPage = Number(params.page);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const user = await getSession();
  const viewerId = user?.role === "member" ? user.id : null;
  const interactive = viewerId !== null;
  const categories = await getAllCategories();

  const results = await getArtworks({
    q,
    categoryId,
    sort,
    page,
    limit: 24,
    viewerId,
  });

  const activeCategory = categories.find((c) => c.id === categoryId);

  const tab = (active) =>
    `border-b-2 pb-2 text-sm font-medium transition ${
      active ? "border-accent text-white" : "border-transparent text-muted hover:text-white"
    }`;

  const pill = (active) =>
    `rounded-full px-3.5 py-1 text-xs font-medium transition ${
      active
        ? "bg-accent font-semibold text-black"
        : "border border-line bg-surface text-muted hover:text-white"
    }`;

  return (
    <>
      <GalleryFx />
      <main className="mx-auto max-w-[1360px] space-y-8 px-6 py-10 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
          <div className="space-y-2">
            <Link href="/" className="inline-block text-xs text-muted transition hover:text-accent">
              ← Kembali ke beranda
            </Link>
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl font-bold sm:text-4xl">
                {activeCategory ? activeCategory.name : "Semua Karya"}
              </h1>
              <span className="text-xs uppercase tracking-widest text-muted">
                · {results.items.length} karya ditampilkan
              </span>
            </div>
            <p className="text-sm text-muted">
              Arsip lengkap karya fotografi, ilustrasi, dan eksplorasi visual dari para kreator RUPA.
            </p>
          </div>

          {/* Pencarian & Urutan */}
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <div className="flex items-center gap-1.5">
              <Link
                href={buildHref({ q, category: categoryId, sort: "latest" })}
                className={pill(sort === "latest")}
              >
                Terbaru
              </Link>
              <Link
                href={buildHref({ q, category: categoryId, sort: "popular" })}
                className={pill(sort === "popular")}
              >
                Populer
              </Link>
            </div>

            <form action="/artworks" method="get" className="w-full sm:w-64">
              <input
                name="q"
                defaultValue={q}
                placeholder="Cari judul atau kreator..."
                aria-label="Cari karya"
                className="w-full rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
              />
              {categoryId && <input type="hidden" name="category" value={categoryId} />}
              {sort !== "latest" && <input type="hidden" name="sort" value={sort} />}
            </form>
          </div>
        </div>

        {/* Tab Kategori */}
        <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-line/60">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href={buildHref({ q, sort })} className={tab(categoryId === null)}>
              Semua
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={buildHref({ q, category: c.id, sort })}
                className={tab(categoryId === c.id)}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {(q || categoryId !== null) && (
            <Link href="/artworks" className="pb-2 text-xs text-accent transition hover:underline">
              Reset filter
            </Link>
          )}
        </nav>

        {/* Grid Karya Seragam */}
        {results.items.length === 0 ? (
          <div className="rounded-sm border border-line bg-surface p-12 text-center">
            <p className="text-sm text-muted">
              {q || categoryId ? "Tidak ada karya yang cocok dengan filter." : "Belum ada karya."}
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {results.items.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                interactive={interactive}
                uniform
              />
            ))}
          </ul>
        )}

        {/* Navigasi Halaman */}
        {(page > 1 || results.hasMore) && (
          <div className="flex items-center justify-between border-t border-line pt-6">
            <span className="text-xs text-muted">Halaman {page}</span>

            <div className="flex items-center gap-3">
              {page > 1 && (
                <Link
                  href={buildHref({ q, category: categoryId, sort, page: page - 1 })}
                  className="rounded-full border border-line bg-surface px-5 py-2 text-xs font-medium text-white transition hover:border-accent"
                >
                  ← Sebelumnya
                </Link>
              )}
              {results.hasMore && (
                <Link
                  href={buildHref({ q, category: categoryId, sort, page: page + 1 })}
                  className="rounded-full border border-line bg-surface px-5 py-2 text-xs font-medium text-white transition hover:border-accent"
                >
                  Berikutnya →
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}