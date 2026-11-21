import Link from "next/link";

const LINKS = [
  { href: "/admin", label: "Statistik" },
  { href: "/admin/curators", label: "Verifikasi Curator" },
  { href: "/admin/users", label: "Pengguna" },
  { href: "/admin/categories", label: "Kategori" },
  { href: "/admin/moderation", label: "Moderasi" },
];

export default function AdminNav() {
  return (
    <div className="border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto flex max-w-5xl gap-5 overflow-x-auto px-4 py-3 text-sm">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="whitespace-nowrap text-neutral-300">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}