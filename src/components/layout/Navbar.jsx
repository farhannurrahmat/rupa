import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/actions/auth";

export default async function Navbar() {
  const user = await getSession();

  // Tautan dashboard menyesuaikan peran
  let dashboardHref = null;
  if (user?.role === "admin") dashboardHref = "/admin";
  if (user?.role === "member") dashboardHref = "/member";
  if (user?.role === "curator") {
    dashboardHref = user.curator_status === "approved" ? "/curator/challenges" : "/curator/pending";
  }

  return (
    <nav className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
      <Link href="/" className="text-xl font-bold">
        RUPA<span className="text-violet-400">.</span>
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <Link href={dashboardHref} className="text-neutral-300">Dashboard</Link>
            <form action={logoutAction}>
              <button className="rounded-full border border-neutral-600 px-4 py-2">Keluar</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="text-neutral-300">Masuk</Link>
            <Link href="/register" className="rounded-full bg-violet-500 px-4 py-2 font-semibold text-black">
              Daftar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}