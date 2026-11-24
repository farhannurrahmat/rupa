import Link from "next/link";
import Photo from "@/components/ui/Photo";
import { toggleLikeAction, toggleFavoriteAction } from "@/actions/interactions";

const SHAPES = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[3/2]"];

function TextAction({ action, artworkId, active, label }) {
  return (
    <form action={action}>
      <input type="hidden" name="artworkId" value={artworkId} />
      <button className={`transition hover:text-accent ${active ? "text-accent" : ""}`}>{label}</button>
    </form>
  );
}

export default function ArtworkCard({ artwork, showCreator = true, badge = null, interactive = false }) {
  const shape = SHAPES[artwork.id % SHAPES.length];

  return (
    <li className="break-inside-avoid pb-10">
      <Link
        href={`/artworks/${artwork.id}`}
        data-src={artwork.file_url}
        className={`pm relative block w-full overflow-hidden rounded-sm border border-line ${shape}`}
      >
        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-black">
            {badge}
          </span>
        )}
        <span className="pm-img">
          <Photo
            src={artwork.file_url}
            alt={artwork.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="h-full w-full"
          />
        </span>
      </Link>

      <div className="flex items-start justify-between gap-3 pt-3">
        <div className="min-w-0">
          <Link href={`/artworks/${artwork.id}`} className="block truncate font-display font-semibold">
            {artwork.title}
          </Link>
          {showCreator && (
            <Link href={`/creators/${artwork.creator_id}`} className="block truncate text-sm text-muted hover:text-white">
              {artwork.creator_name}
            </Link>
          )}
        </div>
        <span className="shrink-0 text-xs text-muted">{artwork.category_name}</span>
      </div>

      <div className="flex gap-4 pt-2 text-sm text-muted">
        {interactive ? (
          <>
            <TextAction action={toggleLikeAction} artworkId={artwork.id} active={artwork.liked} label={`${artwork.liked ? "Disukai" : "Suka"} ${artwork.like_count}`} />
            <TextAction action={toggleFavoriteAction} artworkId={artwork.id} active={artwork.favorited} label={artwork.favorited ? "Tersimpan" : "Simpan"} />
            <Link href={`/artworks/${artwork.id}#komentar`} className="transition hover:text-accent">Komentar</Link>
          </>
        ) : (
          <span>{artwork.like_count} suka</span>
        )}
      </div>
    </li>
  );
}