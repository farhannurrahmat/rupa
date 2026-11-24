import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getArtworkForEdit } from "@/lib/queries/artworks";
import { getAllCategories } from "@/lib/queries/categories";
import ArtworkEditForm from "@/components/artwork/ArtworkEditForm";

export default async function EditArtworkPage({ params }) {
  const { id } = await params; // params bersifat asinkron di Next.js terbaru
  const artworkId = Number(id);
  if (!Number.isInteger(artworkId)) notFound();

  const user = await getSession();
  const artwork = await getArtworkForEdit(artworkId, user.id);
  if (!artwork) notFound(); // bukan karya milikmu, atau tidak ada

  const categories = await getAllCategories();

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Edit Karya</h1>
        <ArtworkEditForm artwork={artwork} categories={categories} />
      </div>
    </main>
  );
}