import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getArtworkDetail } from "@/lib/queries/artworks";
import { getInteractionState, getComments } from "@/lib/queries/interactions";
import InteractionBar from "@/components/artwork/InteractionBar";
import CommentForm from "@/components/artwork/CommentForm";
import CommentList from "@/components/artwork/CommentList";
import ReportForm from "@/components/artwork/ReportForm";
import Photo from "@/components/ui/Photo";

export default async function ArtworkDetailPage({ params }) {
  const { id } = await params;
  const artworkId = Number(id);
  if (!Number.isInteger(artworkId)) notFound();

  const artwork = await getArtworkDetail(artworkId);
  if (!artwork) notFound();

  const user = await getSession();
  const isMember = user?.role === "member";
  const state = isMember ? await getInteractionState(artworkId, user.id) : null;
  const comments = await getComments(artworkId);
  const tags = artwork.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const isOwner = isMember && user.id === artwork.creator_id;

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-10">
        <Photo
          src={artwork.file_url}
          alt={artwork.title}
          fit="contain"
          priority
          sizes="(max-width: 1024px) 100vw, 800px"
          className="h-[70vh] w-full rounded-2xl border border-neutral-800"
        />
        <section className="space-y-5">
          <h2 className="text-xl font-semibold">
            Komentar ({comments.length})
          </h2>
          {isMember && <CommentForm artworkId={artworkId} />}
          <CommentList comments={comments} currentUserId={user?.id} />
        </section>
      </div>

      <aside className="space-y-5">
        <div>
          <p className="text-sm text-cyan-300">{artwork.category_name}</p>
          <h1 className="text-3xl font-bold">{artwork.title}</h1>
        </div>

        <Link
          href={`/creators/${artwork.creator_id}`}
          className="flex items-center gap-3"
        >
          {artwork.avatar_url ? (
            <Photo
              src={artwork.avatar_url}
              alt=""
              sizes="44px"
              className="h-11 w-11 shrink-0 rounded-full"
            />
          ) : (
            <span className="h-11 w-11 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400" />
          )}
          <span>
            <span className="block font-medium">{artwork.creator_name}</span>
            <span className="text-sm text-neutral-400">Lihat profil</span>
          </span>
        </Link>

        <p className="whitespace-pre-line text-neutral-300">
          {artwork.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-neutral-700 px-3 py-1 text-sm text-neutral-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-neutral-400">
          {artwork.like_count} suka · diunggah{" "}
          {new Date(artwork.created_at).toLocaleDateString("id-ID", {
            dateStyle: "long",
          })}
        </p>

        {isMember && (
          <>
            <InteractionBar
              artworkId={artworkId}
              liked={state.liked}
              favorited={state.favorited}
              likeCount={artwork.like_count}
            />
            {!isOwner && (
              <ReportForm
                artworkId={artworkId}
                alreadyReported={state.reported}
              />
            )}
          </>
        )}

        {!user && (
          <div className="space-y-3 rounded-xl border border-line bg-surface p-4">
            <p className="text-sm text-muted">
              Masuk untuk menyukai, menyimpan, berkomentar, atau melaporkan
              karya ini.
            </p>
            <div className="flex gap-2">
              <Link
                href="/login"
                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-black"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-line px-5 py-2 text-sm"
              >
                Daftar
              </Link>
            </div>
          </div>
        )}
        {user && !isMember && (
          <p className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-300">
            Hanya Member yang dapat berinteraksi dengan karya.
          </p>
        )}
      </aside>
    </main>
  );
}
