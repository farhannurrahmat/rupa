import Link from "next/link";
import { getSession } from "@/lib/session";
import { getFavoritesByUser } from "@/lib/queries/interactions";
import { toggleFavoriteAction } from "@/actions/interactions";
import Photo from "@/components/ui/Photo";

export default async function FavoritesPage() {
  const user = await getSession();
  const artworks = await getFavoritesByUser(user.id);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Favorit Saya</h1>
          <p className="mt-1 text-sm text-muted">
            {artworks.length} karya tersimpan
          </p>
        </div>
        <Link
          href="/#galeri"
          className="rounded-full border border-line bg-surface px-5 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
        >
          Jelajahi galeri
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-sm text-muted">
            Belum ada karya yang disimpan. Klik tombol Simpan pada karya di galeri untuk mengumpulkannya di sini.
          </p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artworks.map((a) => (
            <li
              key={a.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-neutral-700"
            >
              <Link href={`/artworks/${a.id}`} className="block overflow-hidden">
                <Photo
                  src={a.file_url}
                  alt={a.title}
                  className="h-52 w-full transition duration-300 group-hover:scale-105"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between p-4">
                <div className="space-y-1">
                  <Link
                    href={`/artworks/${a.id}`}
                    className="block truncate font-semibold transition hover:text-accent"
                  >
                    {a.title}
                  </Link>
                  <p className="truncate text-sm text-muted">
                    oleh{" "}
                    <Link
                      href={`/creators/${a.creator_id}`}
                      className="text-neutral-300 transition hover:text-accent"
                    >
                      {a.creator_name}
                    </Link>
                  </p>
                  <p className="text-xs text-neutral-500">
                    {a.category_name} · {a.like_count} suka
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <Link
                    href={`/artworks/${a.id}`}
                    className="rounded-full border border-line bg-ink px-4 py-1.5 text-xs font-medium text-white transition hover:border-accent hover:text-accent"
                  >
                    Lihat Karya
                  </Link>

                  <form action={toggleFavoriteAction}>
                    <input type="hidden" name="artworkId" value={a.id} />
                    <button
                      type="submit"
                      className="rounded-full px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-950/60"
                    >
                      Hapus
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}