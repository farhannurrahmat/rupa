import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import DashNav from "@/components/layout/DashNav";

export default function DashShell({ area, user, links, children }) {
  const initial = (user.display_name || "?").charAt(0).toUpperCase();

  return (
    <div className="dash min-h-screen bg-ink text-white lg:flex">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-4 py-3 lg:flex-col lg:items-start lg:gap-3 lg:px-5 lg:py-6">
          <Link href="/" className="font-display text-xl font-bold">
            RUPA<span className="text-accent">.</span>
          </Link>
          <span className="rounded-full border border-line px-3 py-0.5 text-xs text-muted lg:w-full">{area}</span>
          <form action={logoutAction} className="ml-auto lg:hidden">
            <button className="btn-ghost-sm">Keluar</button>
          </form>
        </div>

        <div className="px-3 pb-3 lg:flex-1 lg:overflow-y-auto">
          <DashNav links={links} />
        </div>

        <div className="hidden border-t border-line p-4 lg:block">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-black">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.display_name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link href="/" className="btn-ghost-sm">Beranda</Link>
            <form action={logoutAction}>
              <button className="btn-ghost-sm">Keluar</button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-10 lg:py-12">{children}</div>
      </div>
    </div>
  );
}