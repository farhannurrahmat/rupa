import Link from "next/link";
import Photo from "@/components/ui/Photo";

// Cadangan kalau belum ada karya
const FALLBACK = [
  "linear-gradient(160deg,#d9774a,#3a1d12)",
  "radial-gradient(circle at 40% 40%,#9bb08a,#0f0d0b)",
  "linear-gradient(200deg,#f0c9a0,#5a3422)",
];

export default function HeroFan({ artworks }) {
  const items = artworks.slice(0, 5);
  const count = items.length || FALLBACK.length;

  return (
    <div
      className="relative mx-auto flex h-[300px] max-w-4xl items-center justify-center overflow-hidden sm:h-[380px]"
      style={{ perspective: "1100px" }}
    >
      <div className="absolute h-64 w-[70%] rounded-full bg-accent/20 blur-3xl" />

      {Array.from({ length: count }).map((_, i) => {
        const offset = i - (count - 1) / 2;
        const abs = Math.abs(offset);
        const art = items[i];

        return (
          <div
            key={i}
            // Kartu di tepi disembunyikan di HP supaya tidak terpotong
            className={`relative -mx-3 h-52 w-36 shrink-0 overflow-hidden rounded-2xl border border-line shadow-2xl sm:-mx-5 sm:h-72 sm:w-52 ${
              abs > 1 ? "hidden sm:block" : ""
            }`}
            style={{
              transform: `rotateY(${-offset * 16}deg) scale(${1 - abs * 0.1})`,
              zIndex: 10 - Math.round(abs * 2),
              background: art ? undefined : FALLBACK[i],
            }}
          >
            {art && (
              <Link href={`/artworks/${art.id}`} aria-label={art.title}>
                <Photo src={art.file_url} alt={art.title} priority={abs <= 0.5} sizes="220px" className="h-full w-full" />
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}