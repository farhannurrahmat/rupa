"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashNav({ links }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition lg:border-l-2 ${
              active
                ? "bg-white/5 text-white lg:border-accent"
                : "text-muted hover:bg-white/5 hover:text-white lg:border-transparent"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-accent" : "bg-neutral-600"}`} />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}