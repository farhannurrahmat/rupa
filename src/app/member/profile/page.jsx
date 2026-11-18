import { getSession } from "@/lib/session";
import { getUserProfile } from "@/lib/queries/users";
import ProfileForm from "@/components/member/ProfileForm";
import AccountForm from "@/components/member/AccountForm";

export default async function ProfilePage() {
  const user = await getSession();
  const profile = await getUserProfile(user.id);

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-xl space-y-10">
        <h1 className="text-3xl font-bold">Kelola Profil</h1>
        <ProfileForm profile={profile} />
        <hr className="border-neutral-800" />
        <AccountForm email={profile.email} />
      </div>
    </main>
  );
}