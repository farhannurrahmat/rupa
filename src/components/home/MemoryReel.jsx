"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Photo from "@/components/ui/Photo";

const SHAPES = [
  { size: "h-[46vh] w-[62vw] sm:w-[26vw]", lift: "-translate-y-[4vh]" },
  { size: "h-[56vh] w-[70vw] sm:w-[30vw]", lift: "translate-y-[6vh]" },
  { size: "h-[42vh] w-[78vw] sm:w-[34vw]", lift: "-translate-y-[8vh]" },
];

function Heading() {
  return (
    <div>
      <p className="text-sm tracking-widest text-accent">LORONG KENANGAN</p>
      <h2 className="mt-2 text-4xl font-bold sm:text-5xl">Momen yang baru tersimpan</h2>
    </div>
  );
}

function Caption({ item }) {
  return (
    <div className="pt-3">
      <p className="text-xs tracking-widest text-accent">{item.date}</p>
      <p className="font-display text-lg font-semibold">{item.title}</p>
      <p className="text-sm text-muted">{item.creator_name} · {item.category_name}</p>
    </div>
  );
}

function Frame({ item, shape, progress, index }) {
  const tilt = useTransform(progress, [0, 1], [16, -16]);
  const shift = useTransform(progress, [0, 1], [-40 - index * 6, 40 + index * 6]);

  return (
    <motion.div className={`shrink-0 ${shape.lift}`} style={{ rotateY: tilt, transformPerspective: 1100 }}>
      <Link href={`/artworks/${item.id}`} className={`relative block overflow-hidden rounded-2xl border border-line ${shape.size}`}>
        <motion.div className="absolute -inset-x-12 inset-y-0" style={{ x: shift }}>
          <Photo src={item.file_url} alt={item.title} sizes="40vw" className="h-full w-full" />
        </motion.div>
      </Link>
      <Caption item={item} />
    </motion.div>
  );
}

function Animated({ items }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const distRef = useRef(0);
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * distRef.current);

  useEffect(() => {
    function measure() {
      if (!trackRef.current) return;
      distRef.current = Math.max(0, trackRef.current.scrollWidth - window.innerWidth);
      setDist(distRef.current);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items.length]);

  return (
    <section ref={sectionRef} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="absolute left-[8vw] top-24 z-10">
          <Heading />
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-center gap-[6vw] px-[8vw] pt-24">
          {items.map((item, i) => (
            <Frame key={item.id} item={item} shape={SHAPES[i % SHAPES.length]} progress={scrollYProgress} index={i} />
          ))}
        </motion.div>

        <p className="absolute bottom-14 left-[8vw] text-xs text-muted">Gulir untuk berjalan</p>
        <div className="absolute inset-x-[8vw] bottom-10 h-px bg-line">
          <motion.div className="h-full origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}

function Static({ items }) {
  return (
    <section className="space-y-6 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <Heading />
      </div>
      <ul className="flex gap-6 overflow-x-auto px-4 pb-4">
        {items.map((item) => (
          <li key={item.id} className="w-64 shrink-0">
            <Link href={`/artworks/${item.id}`} className="block overflow-hidden rounded-2xl border border-line">
              <Photo src={item.file_url} alt={item.title} sizes="256px" className="aspect-[4/5] w-full" />
            </Link>
            <Caption item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// Pengguna yang mematikan animasi mendapat deretan yang bisa digeser biasa
export default function MemoryReel({ items }) {
  const reduce = useReducedMotion();
  return reduce ? <Static items={items} /> : <Animated items={items} />;
}