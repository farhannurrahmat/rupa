import Link from "next/link";
import { getModerationQueue } from "@/lib/queries/admin";
import { dismissReportsAction, takeDownArtworkAction } from "@/actions/admin";
import ConfirmActionButton from "@/components/admin/ConfirmActionButton";
import Photo from "@/components/ui/Photo";

export default async function ModerationPage() {
  const queue = await getModerationQueue();

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Antrian Moderasi</h1>

      {queue.length === 0 ? (
        <p className="text-neutral-400">Tidak ada laporan yang menunggu.</p>
      ) : (
        <ul className="space-y-4">
          {queue.map((item) => (
            <li key={item.id} className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:flex-row">
              <Link href={`/artworks/${item.id}`}>
                <Photo src={item.file_url} alt={item.title} sizes="160px" className="h-32 w-full rounded-xl sm:w-40 sm:shrink-0" />
              </Link>

              <div className="flex-1 space-y-1">
                <Link href={`/artworks/${item.id}`} className="font-semibold">{item.title}</Link>
                <p className="text-sm text-neutral-400">Oleh {item.creator_name}</p>
                <p className="text-sm">
                  <span className="rounded-full bg-red-950 px-3 py-1 text-red-300">
                    {item.report_count} laporan
                  </span>
                </p>
                <p className="text-sm text-neutral-300">Alasan: {item.reasons}</p>
              </div>

              <div className="flex items-start gap-3">
                <ConfirmActionButton
                  action={dismissReportsAction}
                  id={item.id}
                  label="Dismiss Report"
                  confirmText="Tolak semua laporan untuk karya ini? Karya tetap tayang."
                  className="rounded-full border border-neutral-600 px-4 py-2 text-sm"
                />
                <ConfirmActionButton
                  action={takeDownArtworkAction}
                  id={item.id}
                  label="Take Down"
                  confirmText="Hapus karya ini dari platform? Tindakan tidak bisa dibatalkan."
                  className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-black"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}