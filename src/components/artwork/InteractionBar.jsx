import { toggleLikeAction, toggleFavoriteAction } from "@/actions/interactions";

export default function InteractionBar({ artworkId, liked, favorited, likeCount }) {
  return (
    <div className="flex gap-3">
      <form action={toggleLikeAction} className="flex-1">
        <input type="hidden" name="artworkId" value={artworkId} />
        <button
          className={`w-full rounded-full py-3 font-semibold ${
            liked ? "bg-violet-500 text-black" : "border border-neutral-600"
          }`}
        >
          {liked ? "Disukai" : "Suka"} · {likeCount}
        </button>
      </form>

      <form action={toggleFavoriteAction} className="flex-1">
        <input type="hidden" name="artworkId" value={artworkId} />
        <button
          className={`w-full rounded-full py-3 font-semibold ${
            favorited ? "bg-cyan-400 text-black" : "border border-neutral-600"
          }`}
        >
          {favorited ? "Tersimpan" : "Simpan"}
        </button>
      </form>
    </div>
  );
}