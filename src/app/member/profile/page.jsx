import Link from "next/link";
import { getSession } from "@/lib/session";
import { getCreatorProfile } from "@/lib/queries/users";
import ProfileForm from "@/components/member/ProfileForm";

export default async function MemberProfilePage() {
  const user = await getSession();
  const profile = await getCreatorProfile(user.id);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profil & Akun</h1>
          <p className="mt-1 text-sm text-muted">
            Atur identitas kreator yang tampil di publik dan keamanan akunmu.
          </p>
        </div>
        <Link
          href={`/creators/${user.id}`}
          className="rounded-full border border-line bg-surface px-5 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
        >
          Lihat Profil Publik →
        </Link>
      </div>

      <ProfileForm user={user} profile={profile} />
    </main>
  );
}