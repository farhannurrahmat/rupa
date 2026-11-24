"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Statistik" },
  { href: "/admin/curators", label: "Verifikasi Curator" },
  { href: "/admin/users", label: "Pengguna" },
  { href: "/admin/categories", label: "Kategori" },
  { href: "/admin/moderation", label: "Moderasi" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto flex max-w-5xl gap-6 overflow-x-auto px-4 text-sm">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap border-b-2 py-3 transition ${
                active
                  ? "border-accent font-medium text-white"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}