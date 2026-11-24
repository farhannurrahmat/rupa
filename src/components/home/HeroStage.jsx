"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Photo from "@/components/ui/Photo";

// Panggung 520x520 px. z = kedalaman, speed = kecepatan parallax saat scroll
const SLOTS = [
  { left: 0, top: 50, w: 220, h: 280, z: 60, r: -4, speed: 0.12 },
  { left: 190, top: 0, w: 210, h: 150, z: 20, r: 3, speed: 0.2 },
  { left: 250, top: 190, w: 230, h: 300, z: 110, r: 5, speed: 0.06 },
  { left: 30, top: 340, w: 190, h: 140, z: -30, r: -6, speed: 0.28 },
  { left: 340, top: 70, w: 150, h: 190, z: -70, r: 8, speed: 0.34 },
];

const FALLBACKS = [
  "linear-gradient(160deg,#d9774a,#3a1d12)",
  "linear-gradient(200deg,#f0c9a0,#5a3422)",
  "radial-gradient(circle at 40% 40%,#9bb08a,#181512)",
  "linear-gradient(120deg,#5a3422,#d9774a)",
  "radial-gradient(circle at 60% 30%,#e69066,#181512)",
];

function Card({ slot, item, index, scrollY, reduce }) {
  const y = useTransform(scrollY, [0, 600], [0, -600 * slot.speed]);

  const inner = (
    <div className="relative h-full w-full">
      {item ? (
        <Photo src={item.file_url} alt={item.title} sizes="240px" priority={index === 2} className="h-full w-full" />
      ) : (
        <div className="h-full w-full" style={{ background: FALLBACKS[index] }} />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
        <p className="truncate text-xs font-semibold">{item ? item.title : "Karyamu di sini"}</p>
        {item && <p className="truncate text-[11px] text-neutral-300">{item.creator_name}</p>}
      </div>
    </div>
  );

  return (
    <motion.div
      className="absolute overflow-hidden rounded-lg border border-line shadow-2xl"
      style={{ left: slot.left, top: slot.top, width: slot.w, height: slot.h, z: slot.z, rotate: slot.r, y: reduce ? 0 : y }}
    >
      {item ? (
        <Link href={`/artworks/${item.id}`} className="block h-full w-full transition hover:brightness-110">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </motion.div>
  );
}

export default function HeroStage({ items, ctaHref, ctaText }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rx = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]), { stiffness: 80, damping: 18 });
  const ry = useSpring(useTransform(rawX, [-0.5, 0.5], [-14, 14]), { stiffness: 80, damping: 18 });
  const textY = useTransform(scrollY, [0, 500], [0, 80]);

  function onMove(e) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  const pick = (i) => (items.length ? items[i % items.length] : null);

  return (
    <section onMouseMove={onMove} onMouseLeave={onLeave} className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-20 top-10 h-[34rem] w-[34rem] rounded-full bg-accent/15 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-8 px-4 py-12 lg:grid-cols-[1.05fr_1fr]">
        <motion.div style={reduce ? undefined : { y: textY }}>
          <h1 className="text-5xl font-bold leading-[0.98] sm:text-6xl lg:text-7xl">
            Karya yang membuatmu berhenti scroll.
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            Rupa menyimpan momen dan kenangan lewat karya. Pamerkan karyamu, ikuti challenge, dan temukan kreator baru.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={ctaHref} className="rounded-full bg-accent px-7 py-3 font-semibold text-black transition hover:brightness-110">
              {ctaText}
            </Link>
            <Link href="#galeri" className="rounded-full border border-line px-7 py-3 transition hover:border-accent">
              Jelajahi galeri
            </Link>
          </div>
          <p className="mt-12 text-sm text-muted">Gulir untuk masuk ke galeri ↓</p>
        </motion.div>

        <div className="mx-auto h-[380px] w-[380px] sm:h-[520px] sm:w-[520px]">
          <div className="h-[520px] w-[520px] origin-top-left scale-[0.73] sm:scale-100" style={{ perspective: 1200 }}>
            <motion.div
              className="h-full w-full"
              style={{ transformStyle: "preserve-3d", rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry }}
            >
              {SLOTS.map((slot, i) => (
                <Card key={i} slot={slot} item={pick(i)} index={i} scrollY={scrollY} reduce={reduce} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}