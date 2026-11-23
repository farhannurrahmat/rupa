import Link from "next/link";
import Photo from "@/components/ui/Photo";

export default function FeaturedSlats({ items }) {
  return (
    <ul className="flex h-[26rem] snap-x gap-3 overflow-x-auto md:overflow-visible">
      {items.map((a) => (
        <li
          key={a.id}
          className="group relative h-full min-w-[72%] snap-center overflow-hidden rounded-2xl border border-line md:min-w-0 md:flex-1 md:transition-[flex] md:duration-500 md:hover:flex-[4] md:focus-within:flex-[4]"
        >
          <Link href={`/artworks/${a.id}`} className="block h-full">
            <Photo
              src={a.file_url}
              alt={a.title}
              zoom
              sizes="(max-width: 768px) 72vw, 45vw"
              className="h-full w-full"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
              <p className="text-xs tracking-widest text-accent">
                {a.best_placement ? `JUARA ${a.best_placement}` : a.category_name.toUpperCase()}
              </p>
              <div className="transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                <p className="font-display text-lg font-semibold">{a.title}</p>
                <p className="text-sm text-neutral-300">{a.creator_name}</p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}