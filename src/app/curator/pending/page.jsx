import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { logoutAction, deleteAccountAction } from "@/actions/auth";

export default async function PendingCuratorPage() {
  const user = await getSession();

  if (!user) redirect("/login");
  if (user.role !== "curator") redirect("/");
  if (user.curator_status === "approved") redirect("/curator/challenges");

  const rejected = user.curator_status === "rejected";

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-3xl font-bold">
          {rejected ? "Pendaftaran ditolak" : "Akun sedang ditinjau"}
        </h1>
        <p className="text-neutral-400">
          {rejected
            ? "Maaf, pendaftaran Curator kamu ditolak oleh Admin. Kamu dapat menghapus akun ini."
            : "Akun Anda sedang ditinjau. Kamu bisa masuk ke dashboard setelah Admin menyetujui."}
        </p>

        {rejected && (
          <form action={deleteAccountAction}>
            <button className="w-full rounded-full bg-red-500 py-3 font-semibold text-black">
              Hapus akun
            </button>
          </form>
        )}

        <form action={logoutAction}>
          <button className="w-full rounded-full border border-neutral-600 py-3">Keluar</button>
        </form>
      </div>
    </main>
  );
}