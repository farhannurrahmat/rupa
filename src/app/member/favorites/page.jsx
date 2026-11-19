import { getSession } from "@/lib/session";
import { getFavoritesByUser } from "@/lib/queries/interactions";
import ArtworkCard from "@/components/artwork/ArtworkCard";

export default async function FavoritesPage() {
  const user = await getSession();
  const artworks = await getFavoritesByUser(user.id);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Favorit Saya</h1>
      {artworks.length === 0 ? (
        <p className="text-neutral-400">Belum ada karya yang disimpan.</p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {artworks.map((a) => (
            <ArtworkCard key={a.id} artwork={a} />
          ))}
        </ul>
      )}
    </main>
  );
}