import Link from "next/link";
import Photo from "@/components/ui/Photo";

export default function ArtworkCard({ artwork, showCreator = true, badge = null }) {
  return (
    <li className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
      {badge && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-400 px-3 py-1 text-sm font-semibold text-black">
          {badge}
        </span>
      )}
      <Link href={`/artworks/${artwork.id}`} className="block">
        <Photo src={artwork.file_url} alt={artwork.title} className="h-56 w-full" />
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