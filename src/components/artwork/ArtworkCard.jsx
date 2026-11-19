import Link from "next/link";

export default function ArtworkCard({ artwork, showCreator = true }) {
  return (
    <li className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
      <Link href={`/artworks/${artwork.id}`}>
        <img src={artwork.file_url} alt={artwork.title} className="h-56 w-full object-cover" />
      </Link>
      <div className="space-y-1 p-4">
        <Link href={`/artworks/${artwork.id}`} className="block font-semibold">
          {artwork.title}
        </Link>
        {showCreator && (
          <Link href={`/creators/${artwork.creator_id}`} className="block text-sm text-neutral-300">
            {artwork.creator_name}
          </Link>
        )}
        <p className="text-sm text-neutral-400">
          {artwork.category_name} · {artwork.like_count} suka
        </p>
      </div>
    </li>
  );
}