import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl space-y-3 px-4 py-10">
      <h1 className="text-2xl font-bold">Dashboard Member</h1>
      <Link href="/member/artworks" className="block text-violet-400">Karya saya</Link>
      <Link href="/member/favorites" className="block text-violet-400">Favorit saya</Link>
      <Link href="/member/profile" className="block text-violet-400">Kelola profil</Link>
      <Link href="/member/submissions" className="block text-violet-400">Submisi saya</Link>
    </div>
  );
}