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
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      <nav className="mx-auto flex max-w-[1360px] items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          RUPA<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          {user ? (
            <>
              <Link href={dashboardHref} className="text-neutral-300 transition hover:text-white">
                Dashboard
              </Link>
              <form action={logoutAction}>
                <button className="rounded-full border border-neutral-700 px-4 py-1.5 transition hover:border-accent">
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-neutral-300 transition hover:text-white">
                Masuk
              </Link>
              <Link href="/register" className="rounded-full bg-accent px-4 py-1.5 font-semibold text-black transition hover:brightness-110">
                Daftar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}