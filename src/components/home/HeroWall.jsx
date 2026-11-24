import Link from "next/link";
import Photo from "@/components/ui/Photo";

const HEIGHTS = ["h-52", "h-72", "h-60", "h-80"];
const FALLBACK = [
  "linear-gradient(160deg,#d9774a,#3a1d12)",
  "radial-gradient(circle at 40% 40%,#9bb08a,#0f0d0b)",
  "linear-gradient(200deg,#f0c9a0,#5a3422)",
  "linear-gradient(120deg,#5a3422,#d9774a)",
];

// Setiap kolom memakai urutan karya yang digeser, diulang agar cukup panjang
function buildColumn(items, offset) {
  if (items.length === 0) return FALLBACK.map((bg) => ({ bg }));
  const base = items.map((_, i) => items[(i + offset) % items.length]);
  const list = [];
  while (list.length < 4) list.push(...base);
  return list;
}

export default function HeroWall({ artworks }) {
  const columns = [0, 1, 2].map((c) => buildColumn(artworks, c * 2));

  return (
    <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-6">
        <p className="text-xs tracking-[0.3em] text-accent">FOTO · ILUSTRASI · DESAIN · SENI DIGITAL</p>
        <h1 className="text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
          Karya yang membuatmu <span className="text-accent">berhenti</span> scroll.
        </h1>
        <p className="max-w-md text-muted">
          Satu tempat untuk memamerkan karya, mengikuti challenge, dan menemukan kreator baru.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="rounded-full bg-accent px-7 py-3 font-semibold text-black transition hover:brightness-110">
            Pamerkan karyamu
          </Link>
          <Link href="/challenges" className="rounded-full border border-line px-7 py-3 transition hover:border-accent">
            Lihat challenge
          </Link>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative h-[28rem] overflow-hidden sm:h-[34rem]"
        style={{ maskImage: "linear-gradient(transparent, black 14%, black 86%, transparent)" }}
      >
        <div className="grid h-full grid-cols-3 gap-3">
          {columns.map((col, c) => (
            <div key={c} className={c === 1 ? "drift-down" : "drift-up"}>
              {[...col, ...col].map((item, i) => (
                <div key={i} className="pb-3">
                  {item.id ? (
                    <Link href={`/artworks/${item.id}`} tabIndex={-1}>
                      <Photo
                        src={item.file_url}
                        alt=""
                        sizes="200px"
                        className={`${HEIGHTS[(i + c) % HEIGHTS.length]} w-full rounded-2xl border border-line`}
                      />
                    </Link>
                  ) : (
                    <div
                      className={`${HEIGHTS[(i + c) % HEIGHTS.length]} w-full rounded-2xl border border-line`}
                      style={{ background: item.bg }}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}