import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/actions/auth";

const LINKS = [
  { href: "/artworks", label: "Karya" },
  { href: "/challenges", label: "Challenge" },
  { href: "/creators", label: "Kreator" },
];

function Items({ user, dashboardHref, mobile }) {
  const link = mobile
    ? "rounded-sm px-3 py-2 text-white transition hover:bg-line/60"
    : "text-muted transition hover:text-white";
  const ghost = mobile
    ? "w-full rounded-sm px-3 py-2 text-left text-white transition hover:bg-line/60"
    : "rounded-full border border-line px-4 py-1.5 text-xs font-medium text-white transition hover:border-accent hover:text-accent";
  const primary = mobile
    ? "rounded-sm bg-accent px-3 py-2 text-center font-semibold text-black"
    : "rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-black transition hover:brightness-110";

  return (
    <>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={link}>
          {l.label}
        </Link>
      ))}
      {user ? (
        <>
          <Link href={dashboardHref} className={link}>
            Dashboard
          </Link>
          <form action={logoutAction}>
            <button className={ghost}>Keluar</button>
          </form>
        </>
      ) : (
        <>
          <Link href="/login" className={link}>
            Masuk
          </Link>
          <Link href="/register" className={primary}>
            Daftar
          </Link>
        </>
      )}
    </>
  );
}

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

        {/* Desktop */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          <Items user={user} dashboardHref={dashboardHref} />
        </div>

        {/* Mobile */}
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-full border border-line px-4 py-1.5 text-xs text-white [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 flex w-52 flex-col gap-1 rounded-sm border border-line bg-surface p-2 text-sm shadow-xl">
            <Items user={user} dashboardHref={dashboardHref} mobile />
          </div>
        </details>
      </nav>
    </header>
  );
}