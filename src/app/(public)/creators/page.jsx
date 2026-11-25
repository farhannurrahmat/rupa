import Link from "next/link";
import { getCreators } from "@/lib/queries/users";
import Photo from "@/components/ui/Photo";

export default async function CreatorsPage() {
  const creators = await getCreators();

  return (
    <main className="mx-auto max-w-[1360px] space-y-8 px-6 py-10 sm:px-10">
      <div className="space-y-2 border-b border-line pb-6">
        <Link href="/" className="inline-block text-xs text-muted transition hover:text-accent">
          ← Kembali ke beranda
        </Link>
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-bold sm:text-4xl">Kreator</h1>
          <span className="text-xs uppercase tracking-widest text-muted">
            · {creators.length} kreator aktif
          </span>
        </div>
        <p className="text-sm text-muted">
          Kenali para kreator di balik karya fotografi, ilustrasi, dan eksplorasi visual di RUPA.
        </p>
      </div>

      {creators.length === 0 ? (
        <div className="rounded-sm border border-line bg-surface p-12 text-center">
          <p className="text-sm text-muted">Belum ada kreator yang mengunggah karya.</p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((c) => (
            <li key={c.id}>
              <Link
                href={`/creators/${c.id}`}
                className="group flex items-start gap-4 rounded-sm border border-line bg-surface p-5 transition hover:border-accent/60"
              >
                {c.avatar_url ? (
                  <Photo
                    src={c.avatar_url}
                    alt={c.display_name}
                    sizes="56px"
                    className="h-14 w-14 shrink-0 rounded-full border border-line object-cover"
                  />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-display text-xl font-semibold text-accent">
                    {c.display_name.charAt(0).toUpperCase()}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-display text-base font-semibold text-white transition group-hover:text-accent">
                      {c.display_name}
                    </p>
                    <span className="shrink-0 text-xs text-muted transition group-hover:translate-x-0.5 group-hover:text-accent">
                      →
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs uppercase tracking-wider text-muted">
                    {c.artwork_count} karya
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-400">
                    {c.bio || "Kreator visual di galeri RUPA."}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}