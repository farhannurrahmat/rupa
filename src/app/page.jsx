import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/actions/auth";

export default async function Home() {
  const user = await getSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 text-white">
      <h1 className="text-3xl font-bold">Rupa</h1>
      {user ? (
        <>
          <p>Halo, {user.display_name} ({user.role})</p>
          <form action={logoutAction}>
            <button className="rounded-full border border-neutral-600 px-6 py-2">Keluar</button>
          </form>
        </>
      ) : (
        <div className="flex gap-4">
          <Link href="/login">Masuk</Link>
          <Link href="/register">Daftar</Link>
        </div>
      )}
    </main>
  );
}