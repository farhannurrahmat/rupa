import { getPendingCurators } from "@/lib/queries/users";
import { approveCuratorAction, rejectCuratorAction } from "@/actions/admin";
import ConfirmActionButton from "@/components/admin/ConfirmActionButton";

export default async function CuratorVerificationPage() {
  const curators = await getPendingCurators();

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">Verifikasi Curator</h1>

        {curators.length === 0 ? (
          <p className="text-neutral-400">Tidak ada pendaftaran Curator yang menunggu.</p>
        ) : (
          <ul className="space-y-3">
            {curators.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                <div>
                  <p className="font-medium">{c.display_name}</p>
                  <p className="text-sm text-neutral-400">
                    {c.email} · mendaftar {new Date(c.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <ConfirmActionButton
                    action={approveCuratorAction}
                    id={c.id}
                    label="Setujui"
                    className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-black"
                  />
                  <ConfirmActionButton
                    action={rejectCuratorAction}
                    id={c.id}
                    label="Tolak"
                    confirmText={`Tolak pendaftaran ${c.display_name}?`}
                    className="rounded-full border border-red-500 px-4 py-2 text-sm text-red-400"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}