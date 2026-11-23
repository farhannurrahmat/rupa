import Link from "next/link";
import Photo from "@/components/ui/Photo";
import { toggleLikeAction, toggleFavoriteAction } from "@/actions/interactions";
import Tilt from "../ui/Tilt";

function QuickButton({ action, artworkId, active, onText, offText }) {
  return (
    <form action={action}>
      <input type="hidden" name="artworkId" value={artworkId} />
      <button
        className={`rounded-full border px-3 py-1 text-xs transition ${
          active
            ? "border-accent bg-accent text-black"
            : "border-line text-neutral-300 hover:border-accent"
        }`}
      >
        {active ? onText : offText}
      </button>
    </form>
  );
}

// interactive = true hanya untuk Member yang sedang login
export default function ArtworkCard({
  artwork,
  showCreator = true,
  badge = null,
  interactive = false,
}) {
  return (
    <li className="group relative overflow-hidden rounded-2xl border border-line bg-surface transition-shadow duration-300 hover:border-accent/60 hover:shadow-[0_24px_40px_-24px_rgba(217,119,74,0.45)]">
      {" "}
      {badge && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-400 px-3 py-1 text-sm font-semibold text-black">
          {badge}
        </span>
      )}
      <Link href={`/artworks/${artwork.id}`} className="block">
        <Photo
          src={artwork.file_url}
          alt={artwork.title}
          zoom
          className="h-56 w-full"
        />
      </Link>
      <div className="space-y-1 p-4">
        <Link
          href={`/artworks/${artwork.id}`}
          className="block font-display font-semibold"
        >
          {artwork.title}
        </Link>
        {showCreator && (
          <Link
            href={`/creators/${artwork.creator_id}`}
            className="block text-sm text-neutral-300"
          >
            {artwork.creator_name}
          </Link>
        )}
        <p className="text-sm text-neutral-400">
          {artwork.category_name} · {artwork.like_count} suka
        </p>
        {interactive && (
          <div className="flex gap-2 pt-2">
            <QuickButton
              action={toggleLikeAction}
              artworkId={artwork.id}
              active={artwork.liked}
              onText="Disukai"
              offText="Suka"
            />
            <QuickButton
              action={toggleFavoriteAction}
              artworkId={artwork.id}
              active={artwork.favorited}
              onText="Tersimpan"
              offText="Simpan"
            />
            <Link
              href={`/artworks/${artwork.id}#komentar`}
              className="rounded-full border border-line px-3 py-1 text-xs text-neutral-300 hover:border-accent"
            >
              Komentar
            </Link>
          </div>
        )}
      </div>
    </li>
  );
}
