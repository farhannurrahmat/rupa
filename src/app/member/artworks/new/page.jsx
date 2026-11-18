import { getAllCategories } from "@/lib/queries/categories";
import ArtworkForm from "@/components/artwork/ArtworkForm";

export default async function NewArtworkPage() {
  const categories = await getAllCategories();

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-3xl font-bold">Unggah Karya</h1>
        <ArtworkForm categories={categories} />
      </div>
    </main>
  );
}