"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Photo from "@/components/ui/Photo";

// Posisi tiap panel di ruang 3D: x/y (%), w (vw), z (kedalaman px), ry (rotasi Y), d (parallax)
const SLOTS = [
  { x: 48, y: 12, w: 14.5, z: -120, ry: -12, d: 1.1, ratio: "aspect-[4/5]" },
  { x: 64, y: 11, w: 15, z: -300, ry: -18, d: 0.9, ratio: "aspect-[4/3]" },
  { x: 79, y: 26, w: 14.5, z: -480, ry: -22, d: 0.8, ratio: "aspect-[4/5]" },
  { x: 66, y: 48, w: 13.5, z: -660, ry: -14, d: 0.65, ratio: "aspect-[3/4]" },
  { x: 51, y: 50, w: 13.5, z: -860, ry: 10, d: 0.55, ratio: "aspect-square" },
  { x: 62, y: 24, w: 14, z: -1080, ry: -16, d: 0.45, ratio: "aspect-[4/5]" },
  { x: 76, y: 52, w: 13, z: -1280, ry: -18, d: 0.35, ratio: "aspect-square" },
  { x: 54, y: 22, w: 13.5, z: -1480, ry: 12, d: 0.25, ratio: "aspect-[3/4]" },
];

const FALLBACKS = [
  "linear-gradient(160deg, #d9774a, #3a1d12)",
  "radial-gradient(circle at 40% 40%, #9bb08a, #181512)",
  "linear-gradient(200deg, #f0c9a0, #5a3422)",
  "linear-gradient(120deg, #5a3422, #d9774a)",
];

export default function HeroTunnel({ items = [], ctaHref, ctaText }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;

    function updateScroll() {
      rafId = 0;
      const rect = hero.getBoundingClientRect();
      const maxScroll = Math.max(1, hero.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / maxScroll));

      hero.style.setProperty("--p", progress.toFixed(4));
      hero.classList.toggle("tn-far", progress > 0.42);
    }

    function onScroll() {
      if (!rafId) rafId = requestAnimationFrame(updateScroll);
    }

    function onPointerMove(e) {
      if (reduce || e.pointerType === "touch") return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      hero.style.setProperty("--mx", nx.toFixed(3));
      hero.style.setProperty("--my", ny.toFixed(3));
      hero.style.setProperty("--lx", (66 + nx * 14).toFixed(1));
      hero.style.setProperty("--ly", (46 + ny * 12).toFixed(1));
    }

    function onPointerLeave() {
      hero.style.setProperty("--mx", "0");
      hero.style.setProperty("--my", "0");
    }

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <section ref={heroRef} className="tn-hero border-b border-line">
      <div className="tn-sticky">
        <div className="tn-copy">
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
            Setiap karya punya <span className="text-accent">rupa</span>-nya sendiri.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Satu tempat untuk memamerkan karya, mengikuti challenge, dan menemukan kreator baru.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={ctaHref}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
            >
              {ctaText}
            </Link>
            <Link
              href="#galeri"
              className="rounded-full border border-line px-6 py-2.5 text-sm transition hover:border-accent"
            >
              Jelajahi galeri
            </Link>
          </div>
        </div>

        <div className="tn-scene">
          {SLOTS.map((slot, i) => {
            const item = items.length > 0 ? items[i % items.length] : null;
            const style = {
              "--x": slot.x,
              "--y": slot.y,
              "--w": slot.w,
              "--z": slot.z,
              "--ry": slot.ry,
              "--d": slot.d,
            };

            const card = (
              <>
                <span className={`tn-pi border border-line ${slot.ratio}`}>
                  {item ? (
                    <Photo
                      src={item.file_url}
                      alt={item.title}
                      sizes="260px"
                      priority={i < 2}
                      className="h-full w-full"
                    />
                  ) : (
                    <span
                      className="block h-full w-full"
                      style={{ background: FALLBACKS[i % FALLBACKS.length] }}
                    />
                  )}
                </span>
                <span className="tn-lb">
                  <b>{item ? item.title : "Karyamu di sini"}</b>
                  {item ? item.creator_name : "Rupa Showcase"}
                </span>
              </>
            );

            return item ? (
              <Link
                key={`${slot.z}-${i}`}
                href={`/artworks/${item.id}`}
                data-src={item.file_url}
                className="tn-pn group"
                style={style}
              >
                {card}
              </Link>
            ) : (
              <div key={`${slot.z}-${i}`} className="tn-pn" style={style}>
                {card}
              </div>
            );
          })}
        </div>

        <p className="tn-hint">Gulir untuk masuk ke galeri ↓</p>
      </div>
    </section>
  );
}