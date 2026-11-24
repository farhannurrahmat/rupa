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

// depth = seberapa jauh bergerak mengikuti kursor, rise = seberapa cepat naik saat scroll
const SPOTS = [
  { pos: "left-[2%] top-[7%]", w: "w-40", r: -8, depth: 28, rise: 40 },
  { pos: "right-[3%] top-[9%]", w: "w-48", r: 6, depth: 46, rise: 70 },
  { pos: "left-[5%] bottom-[7%]", w: "w-48", r: 5, depth: 64, rise: 110 },
  { pos: "right-[7%] bottom-[9%]", w: "w-44", r: -5, depth: 34, rise: 60 },
  { pos: "-left-[1.5%] top-[46%]", w: "w-28", r: 10, depth: 16, rise: 20 },
  { pos: "-right-[1.5%] top-[40%]", w: "w-28", r: -9, depth: 18, rise: 25 },
];

const FALLBACKS = [
  "linear-gradient(160deg,#d9774a,#3a1d12)",
  "radial-gradient(circle at 40% 40%,#9bb08a,#0f0d0b)",
  "linear-gradient(200deg,#f0c9a0,#5a3422)",
  "linear-gradient(120deg,#5a3422,#d9774a)",
  "linear-gradient(180deg,#c9bfae,#3d362d)",
  "radial-gradient(circle at 60% 30%,#e69066,#181512)",
];

function Frame({ item, bg, rotate, sizes = "260px" }) {
  return (
    <div className="polaroid tape relative p-2 pb-9" style={{ rotate: `${rotate}deg` }}>
      {item ? (
        <Photo src={item.file_url} alt={item.title} sizes={sizes} className="aspect-[4/5] w-full" />
      ) : (
        <div className="aspect-[4/5] w-full" style={{ background: bg }} />
      )}
      <p className="absolute inset-x-0 bottom-2 truncate px-3 text-center font-hand text-xl leading-none text-paper-ink">
        {item ? item.title : "karyamu di sini"}
      </p>
    </div>
  );
}

function Wrapped({ item, ...props }) {
  const frame = <Frame item={item} {...props} />;
  if (!item) return frame;
  return (
    <Link href={`/artworks/${item.id}`} className="block transition duration-300 hover:scale-105">
      {frame}
    </Link>
  );
}

function Floating({ spot, mx, my, scrollY, reduce, children }) {
  const x = useTransform(mx, [-0.5, 0.5], [-spot.depth, spot.depth]);
  const y = useTransform(my, [-0.5, 0.5], [-spot.depth, spot.depth]);
  const rise = useTransform(scrollY, [0, 700], [0, -spot.rise]);

  return (
    <motion.div className={`absolute ${spot.pos} ${spot.w}`} style={reduce ? undefined : { y: rise }}>
      <motion.div style={reduce ? undefined : { x, y }}>{children}</motion.div>
    </motion.div>
  );
}

export default function HeroDesk({ items, ctaHref, ctaText }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });
  const bigY = useTransform(scrollY, [0, 700], [0, 140]);

  const pick = (i) => (items.length ? items[i % items.length] : null);

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

  return (
    <section onMouseMove={onMove} onMouseLeave={onLeave} className="relative overflow-hidden border-b border-line">
      {/* Cahaya lampu */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

      {/* Tulisan raksasa di lapisan paling belakang */}
      <motion.p
        aria-hidden="true"
        style={reduce ? undefined : { y: bigY }}
        className="pointer-events-none absolute inset-x-0 top-[12%] select-none text-center font-display text-[30vw] font-bold leading-none text-white/[0.035]"
      >
        RUPA
      </motion.p>

      <div className="relative mx-auto max-w-7xl">
        {/* Foto tersebar (layar lebar) */}
        <div className="absolute inset-0 hidden lg:block">
          {SPOTS.map((spot, i) => (
            <Floating key={i} spot={spot} mx={mx} my={my} scrollY={scrollY} reduce={reduce}>
              <Wrapped item={pick(i)} bg={FALLBACKS[i]} rotate={spot.r} />
            </Floating>
          ))}
        </div>

        {/* Teks */}
        <div className="relative z-20 mx-auto flex max-w-2xl flex-col items-center px-4 pb-10 pt-20 text-center lg:min-h-[44rem] lg:justify-center lg:py-32">
          <p className="font-hand text-3xl leading-none text-accent">album karya yang terus tumbuh</p>
          <h1 className="mt-3 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Setiap karya punya <em className="text-accent">rupa</em>-nya sendiri.
          </h1>
          <p className="mt-5 max-w-md text-muted">
            Foto, ilustrasi, desain, dan seni digital. Pamerkan, ikuti challenge, dan temukan kreator baru.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={ctaHref} className="rounded-full bg-accent px-7 py-3 font-semibold text-black transition hover:brightness-110">
              {ctaText}
            </Link>
            <Link href="#galeri" className="rounded-full border border-line px-7 py-3 transition hover:border-accent">
              Jelajahi galeri
            </Link>
          </div>
        </div>

        {/* Tiga foto melayang (HP dan tablet) */}
        <div className="flex justify-center -space-x-8 pb-14 lg:hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="float-slow w-32" style={{ animationDelay: `${i * 0.8}s`, zIndex: i === 1 ? 2 : 1 }}>
              <Wrapped item={pick(i)} bg={FALLBACKS[i]} rotate={[-7, 3, 8][i]} sizes="140px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}