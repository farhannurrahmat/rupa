import { notFound } from "next/navigation";
import { getCreatorProfile } from "@/lib/queries/users";
import { getArtworksByUser } from "@/lib/queries/artworks";
import ArtworkCard from "@/components/artwork/ArtworkCard";

export default async function CreatorPage({ params }) {
  const { id } = await params;
  const creatorId = Number(id);
  if (!Number.isInteger(creatorId)) notFound();

  const creator = await getCreatorProfile(creatorId);
  if (!creator) notFound();

  const artworks = await getArtworksByUser(creatorId);

  const links = [
    { label: "Instagram", url: creator.link_instagram },
    { label: "Behance", url: creator.link_behance },
    { label: "Website", url: creator.link_website },
  ].filter((l) => l.url);

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <section className="flex flex-col items-center gap-4 text-center">
        {creator.avatar_url ? (
          <img src={creator.avatar_url} alt={creator.display_name} className="h-28 w-28 rounded-full object-cover" />
        ) : (
          <div className="h-28 w-28 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400" />
        )}
        <h1 className="text-3xl font-bold">{creator.display_name}</h1>
        {creator.bio && <p className="max-w-xl text-neutral-300">{creator.bio}</p>}
        {links.length > 0 && (
          <div className="flex gap-4 text-sm">
            {links.map((l) => (
              <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" className="text-violet-400">
                {l.label}
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Karya ({artworks.length})</h2>
        {artworks.length === 0 ? (
          <p className="text-neutral-400">Belum ada karya.</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {artworks.map((a) => (
              <ArtworkCard key={a.id} artwork={a} showCreator={false} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}