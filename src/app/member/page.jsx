import Link from "next/link";

export default function Page() {
  return (
    <div className="space-y-3 p-8 text-white">
      <h1 className="text-2xl font-bold">Area Member</h1>
      <Link href="/member/artworks" className="text-violet-400">Karya saya</Link>
    </div>
  );
}