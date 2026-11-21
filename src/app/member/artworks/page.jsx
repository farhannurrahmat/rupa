import Link from "next/link";
import { getSession } from "@/lib/session";
import { getArtworksByUser } from "@/lib/queries/artworks";
import DeleteArtworkButton from "@/components/artwork/DeleteArtworkButton";
import Photo from "@/components/ui/Photo";

export default async function MyArtworksPage() {
  const user = await getSession();
  const artworks = await getArtworksByUser(user.id);

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Karya Saya</h1>
          <Link
            href="/member/artworks/new"
            className="rounded-full bg-violet-500 px-6 py-2 font-semibold text-black"
          >
            Unggah karya
          </Link>
        </div>

        {artworks.length === 0 ? (
          <p className="text-neutral-400">
            Belum ada karya. Unggah karya pertamamu.
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((a) => (
              <li
                key={a.id}
                className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900"
              >
                <Photo src={a.file_url} alt={a.title} className="h-56 w-full rounded-xl" />
                <div className="space-y-1 p-4">
                  <h2 className="font-semibold">{a.title}</h2>
                  <p className="text-sm text-neutral-400">
                    {a.category_name} · {a.like_count} suka
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(a.created_at).toLocaleDateString("id-ID")}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <Link
                      href={`/member/artworks/${a.id}/edit`}
                      className="text-sm text-violet-400"
                    >
                      Edit
                    </Link>
                    <DeleteArtworkButton id={a.id} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
