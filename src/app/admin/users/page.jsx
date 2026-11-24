import Link from "next/link";
import { getUsers } from "@/lib/queries/users";
import { deleteUserAction } from "@/actions/admin";
import ConfirmActionButton from "@/components/admin/ConfirmActionButton";

const FILTERS = [
  { value: "", label: "Semua" },
  { value: "member", label: "Member" },
  { value: "curator", label: "Curator" },
  { value: "admin", label: "Admin" },
];
const STATUS = { pending: "Menunggu", approved: "Disetujui", rejected: "Ditolak" };

export default async function UsersPage({ searchParams }) {
  const { role } = await searchParams;
  // Nilai dari URL divalidasi, selain tiga peran ini dianggap "semua"
  const filter = ["member", "curator", "admin"].includes(role) ? role : "";
  const users = await getUsers(filter);

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Kelola Pengguna</h1>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value ? `/admin/users?role=${f.value}` : "/admin/users"}
              className={`rounded-full px-4 py-2 text-sm ${
                filter === f.value ? "bg-white text-black" : "border border-neutral-700 text-neutral-300"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Peran</th>
                <th className="px-4 py-3">Terdaftar</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-neutral-800">
                  <td className="px-4 py-3">{u.display_name}</td>
                  <td className="px-4 py-3 text-neutral-300">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.role}
                    {u.curator_status && (
                      <span className="ml-2 text-xs text-neutral-400">({STATUS[u.curator_status]})</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {new Date(u.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    {u.role === "admin" ? (
                      <span className="text-neutral-500">Tidak dapat dihapus</span>
                    ) : (
                      <ConfirmActionButton
                        action={deleteUserAction}
                        id={u.id}
                        label="Hapus"
                        confirmText={`Hapus ${u.display_name} beserta seluruh datanya?`}
                        className="rounded-full border border-red-500/30 bg-red-950/30 px-3.5 py-1 text-xs font-medium text-red-300 transition hover:bg-red-950/70"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}