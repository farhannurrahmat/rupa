"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Photo from "@/components/ui/Photo";
import { toggleLikeAction, toggleFavoriteAction } from "@/actions/interactions";

function IconAction({ action, artworkId, active, label, children }) {
  return (
    <form action={action}>
      <input type="hidden" name="artworkId" value={artworkId} />
      <button
        type="submit"
        aria-label={label}
        className={`inline-flex items-center gap-1.5 text-xs transition ${
          active ? "font-medium text-accent" : "text-muted hover:text-white"
        }`}
      >
        {children}
      </button>
    </form>
  );
}

export default function ArtworkCard({
  artwork,
  showCreator = true,
  badge = null,
  interactive = false,
  onRatio,
  uniform = false,
}) {
  const linkRef = useRef(null);

  useEffect(() => {
    const img = linkRef.current?.querySelector("img");
    if (img && img.complete && img.naturalWidth && img.naturalHeight) {
      onRatio?.(artwork.id, img.naturalHeight / img.naturalWidth);
    }
  }, [artwork.id, artwork.file_url, onRatio]);

  return (
    <li className="group flex flex-col">
      <Link
        ref={linkRef}
        href={`/artworks/${artwork.id}`}
        data-src={artwork.file_url}
        onLoadCapture={(e) => {
          const img = e.target;
          if (img?.naturalWidth && img?.naturalHeight) {
            onRatio?.(artwork.id, img.naturalHeight / img.naturalWidth);
          }
        }}
        className={`pm relative block w-full overflow-hidden rounded-sm border border-line bg-surface ${
          uniform ? "flex aspect-[4/3] items-center justify-center p-2" : ""
        }`}
      >
        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded-sm bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-black shadow-md">
            {badge}
          </span>
        )}
        <Photo
          src={artwork.file_url}
          alt={artwork.title}
          natural
          zoom
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          className="block h-auto w-full"
        />
      </Link>

      <div className="pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <Link
            href={`/artworks/${artwork.id}`}
            className="truncate font-display text-[15px] font-semibold text-white transition group-hover:text-accent"
          >
            {artwork.title}
          </Link>
          <span className="shrink-0 text-[11px] uppercase tracking-wider text-muted">
            {artwork.category_name}
          </span>
        </div>

        {showCreator && (
          <Link
            href={`/creators/${artwork.creator_id}`}
            className="mt-0.5 block truncate text-xs text-muted transition hover:text-white"
          >
            {artwork.creator_name}
          </Link>
        )}

        <div className="mt-2.5 flex items-center justify-between border-t border-line/60 pt-2 text-xs text-muted">
          {interactive ? (
            <div className="flex items-center gap-4">
              <IconAction
                action={toggleLikeAction}
                artworkId={artwork.id}
                active={artwork.liked}
                label={artwork.liked ? "Batal suka" : "Suka"}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={artwork.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                <span>{artwork.like_count}</span>
              </IconAction>

              <IconAction
                action={toggleFavoriteAction}
                artworkId={artwork.id}
                active={artwork.favorited}
                label={artwork.favorited ? "Hapus simpan" : "Simpan"}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={artwork.favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
                <span>{artwork.favorited ? "Tersimpan" : "Simpan"}</span>
              </IconAction>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {artwork.like_count}
            </span>
          )}

          <Link
            href={`/artworks/${artwork.id}#komentar`}
            className="inline-flex items-center gap-1 text-muted transition hover:text-accent"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
            </svg>
            <span>Komentar</span>
          </Link>
        </div>
      </div>
    </li>
  );
}