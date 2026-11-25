import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/actions/auth";

export default async function Navbar() {
  const user = await getSession();

  let dashboardHref = null;
  if (user?.role === "admin") dashboardHref = "/admin";
  if (user?.role === "member") dashboardHref = "/member";
  if (user?.role === "curator") {
    dashboardHref = user.curator_status === "approved" ? "/curator/challenges" : "/curator/pending";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1360px] items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-white">
          RUPA<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-6 text-sm">
          {user ? (
            <>
              {user.role === "member" && (
                <Link href="/challenges" className="text-muted transition hover:text-white">
                  Challenge
                </Link>
              )}
              <Link href={dashboardHref} className="text-muted transition hover:text-white">
                Dashboard
              </Link>
              <form action={logoutAction}>
                <button className="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-white transition hover:border-accent hover:text-accent">
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/artworks" className="text-muted transition hover:text-white">
                Karya
              </Link>
              <Link href="/login" className="text-muted transition hover:text-white">
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-black transition hover:brightness-110"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}