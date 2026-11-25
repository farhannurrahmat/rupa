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

const ROLE_LABEL = {
  admin: "Admin",
  curator: "Curator",
  member: "Member",
};

const STATUS = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
};

export default async function UsersPage({ searchParams }) {
  const { role } = await searchParams;
  const filter = ["member", "curator", "admin"].includes(role) ? role : "";
  const users = await getUsers(filter);

  return (
    <main className="w-full space-y-6 px-6 py-10 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Kelola Pengguna</h1>
          <p className="mt-1 text-sm text-muted">{users.length} akun terdaftar</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value ? `/admin/users?role=${f.value}` : "/admin/users"}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                filter === f.value
                  ? "bg-accent font-semibold text-black"
                  : "border border-line bg-surface text-muted hover:text-white"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm border border-line bg-surface">
        {users.length === 0 ? (
          <p className="p-6 text-sm text-muted">Tidak ada pengguna pada filter ini.</p>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-4 font-medium">Nama</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Peran</th>
                <th className="px-6 py-4 font-medium">Terdaftar</th>
                <th className="px-6 py-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => {
                const isElevated = u.role === "admin" || u.role === "curator";

                return (
                  <tr key={u.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium text-white">{u.display_name}</td>
                    <td className="px-6 py-4 text-muted">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 text-xs font-medium ${
                          isElevated
                            ? "border-accent/40 bg-accent/10 text-accent"
                            : "border-line bg-ink/60 text-muted"
                        }`}
                      >
                        <span>{ROLE_LABEL[u.role] ?? u.role}</span>
                        {u.curator_status && (
                          <span className="text-[11px] opacity-80">· {STATUS[u.curator_status]}</span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {new Date(u.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      {u.role === "admin" ? (
                        <span className="text-xs text-muted">Akun utama</span>
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}