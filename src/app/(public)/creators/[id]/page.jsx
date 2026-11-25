import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getCreatorProfile } from "@/lib/queries/users";
import { getArtworksByUser } from "@/lib/queries/artworks";
import MasonryGrid from "@/components/artwork/MasonryGrid";
import GalleryFx from "@/components/home/GalleryFx";
import Photo from "@/components/ui/Photo";

export default async function CreatorPage({ params }) {
  const { id } = await params;
  const creatorId = Number(id);
  if (!Number.isInteger(creatorId)) notFound();

  const creator = await getCreatorProfile(creatorId);
  if (!creator) notFound();

  const user = await getSession();
  const viewerId = user?.role === "member" ? user.id : null;
  const interactive = viewerId !== null;

  const artworks = await getArtworksByUser(creatorId, viewerId);

  const links = [
    { label: "Instagram", url: creator.link_instagram },
    { label: "Behance", url: creator.link_behance },
    { label: "Website", url: creator.link_website },
  ].filter((l) => l.url);

  return (
    <>
      <GalleryFx />
      <main className="mx-auto max-w-[1360px] space-y-10 px-6 py-10 sm:px-10">
        <section className="flex flex-col items-center gap-4 border-b border-line pb-8 text-center">
          {creator.avatar_url ? (
            <Photo
              src={creator.avatar_url}
              alt={creator.display_name}
              sizes="112px"
              className="h-28 w-28 rounded-full border border-line"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-line bg-surface font-display text-3xl font-bold text-accent">
              {creator.display_name?.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="font-display text-3xl font-bold">{creator.display_name}</h1>
          {creator.bio && <p className="max-w-xl text-sm text-muted">{creator.bio}</p>}
          {links.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent transition hover:underline"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-semibold">Karya ({artworks.length})</h2>
          {artworks.length === 0 ? (
            <div className="rounded-sm border border-line bg-surface p-12 text-center">
              <p className="text-sm text-muted">Belum ada karya.</p>
            </div>
          ) : (
            <MasonryGrid items={artworks} interactive={interactive} showCreator={false} />
          )}
        </section>
      </main>
    </>
  );
}