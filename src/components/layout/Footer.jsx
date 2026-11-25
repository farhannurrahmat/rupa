import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line/80 bg-ink">
      <div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-6 px-6 py-10 text-xs text-muted sm:flex-row sm:items-center sm:px-10">
        <div className="space-y-1">
          <Link href="/" className="font-display text-base font-bold tracking-tight text-white">
            RUPA<span className="text-accent">.</span>
          </Link>
          <p>Ruang pamer digital untuk karya visual, fotografi, dan eksplorasi kreator.</p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Link href="/artworks" className="transition hover:text-white">
            Karya
          </Link>
          <Link href="/challenges" className="transition hover:text-white">
            Challenge
          </Link>
          <Link href="/register" className="transition hover:text-white">
            Gabung Kreator
          </Link>
          <span className="text-line">|</span>
          <span>© {new Date().getFullYear()} RUPA.</span>
        </div>
      </div>
    </footer>
  );
}