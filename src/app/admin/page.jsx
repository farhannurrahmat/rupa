import Link from "next/link";

export default function Page() {
  return (
    <div className="space-y-3 p-8 text-white">
      <h1 className="text-2xl font-bold">Area Admin</h1>
      <Link href="/admin/curators" className="block text-violet-400">Verifikasi Curator</Link>
      <Link href="/admin/users" className="block text-violet-400">Kelola pengguna</Link>
      <Link href="/admin/categories" className="block text-violet-400">Kelola kategori</Link>
    </div>
  );
}