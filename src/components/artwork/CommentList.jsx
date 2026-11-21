import Link from "next/link";
import { deleteCommentAction } from "@/actions/interactions";
import Photo from "@/components/ui/Photo";

export default function CommentList({ comments, currentUserId }) {
  if (comments.length === 0) {
    return <p className="text-neutral-400">Belum ada komentar.</p>;
  }

  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <li key={c.id} className="flex gap-3">
          {c.avatar_url ? (
            <Photo src={c.avatar_url} alt="" sizes="36px" className="h-9 w-9 shrink-0 rounded-full" />
          ) : (
            <span className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400" />
          )}
          <div className="flex-1">
            <p className="text-sm">
              <Link href={`/creators/${c.user_id}`} className="font-medium">{c.display_name}</Link>
              <span className="ml-2 text-neutral-500">
                {new Date(c.created_at).toLocaleDateString("id-ID", { dateStyle: "medium" })}
              </span>
            </p>
            <p className="whitespace-pre-line text-neutral-300">{c.content}</p>
            {c.user_id === currentUserId && (
              <form action={deleteCommentAction}>
                <input type="hidden" name="id" value={c.id} />
                <button className="text-xs text-red-400">Hapus</button>
              </form>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}