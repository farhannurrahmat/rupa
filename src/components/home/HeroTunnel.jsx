"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Photo from "@/components/ui/Photo";

export default function HeroTunnel({ items = [], ctaHref, ctaText }) {
  const heroRef = useRef(null);
  const [active, setActive] = useState(0);
  const last = items.length - 1;
  const current = items[active];

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || last < 1) return;
    let rafId = 0;

    function update() {
      rafId = 0;
      const maxScroll = Math.max(1, hero.offsetHeight - window.innerHeight);
      const progress = Math.max(
        0,
        Math.min(1, -hero.getBoundingClientRect().top / maxScroll),
      );
      hero.style.setProperty("--pos", (progress * last).toFixed(3));
      setActive(Math.round(progress * last));
    }

    function onScroll() {
      if (!rafId) rafId = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [last]);

  function goTo(i) {
    const hero = heroRef.current;
    if (!hero || last < 1) return;
    const clamped = Math.max(0, Math.min(last, i));
    const maxScroll = hero.offsetHeight - window.innerHeight;
    const heroTop = window.scrollY + hero.getBoundingClientRect().top;
    window.scrollTo({
      top: heroTop + (clamped / last) * maxScroll,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    if (last < 1) return;
    function onKeyDown(e) {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      const hero = heroRef.current;
      if (!hero || hero.getBoundingClientRect().bottom < 0) return;
      if (e.key === "ArrowLeft") goTo(active - 1);
      if (e.key === "ArrowRight") goTo(active + 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, last]);

  function onCardClick(e, i) {
    if (i === active) return;
    e.preventDefault();
    goTo(i);
  }

  const arrow =
    "relative z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line bg-ink text-white transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:text-white";

  return (
    <section
      ref={heroRef}
      className="lr-hero border-b border-line"
      style={{ "--n": Math.max(0, last) }}
    >
      <div className="lr-sticky">
        <div className="mx-auto w-full max-w-[1360px] px-6 sm:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-6xl">
              Setiap karya punya{" "}
              <span className="whitespace-nowrap text-accent">rupa-nya</span>{" "}
              sendiri
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted sm:mt-5">
              Satu tempat untuk memamerkan karya, mengikuti challenge, dan
              menemukan kreator baru.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8">
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

          {items.length > 0 && (
            <>
              <div className="lr-walk -mx-6 mt-6 sm:mx-0 sm:mt-8">
                <div className="lr-floor" />
                {items.map((item, i) => (
                  <Link
                    key={item.id}
                    href={`/artworks/${item.id}`}
                    draggable={false}
                    aria-label={`${item.title}, ${item.creator_name}`}
                    aria-current={i === active}
                    onClick={(e) => onCardClick(e, i)}
                    className={`lr-card ${Math.abs(i - active) > 2 ? "pointer-events-none" : ""}`}
                    style={{ "--i": i }}
                  >
                    <Photo
                      src={item.file_url}
                      alt={item.title}
                      sizes="(max-width: 640px) 60vw, 360px"
                      priority={i < 3}
                      className="h-full w-full"
                    />
                  </Link>
                ))}
              </div>

              <div className="relative z-20 mt-5 flex items-center justify-between gap-4">
                <div
                  key={active}
                  className="lr-meta flex min-w-0 items-center gap-4"
                >
                  <span className="font-display text-3xl font-light text-accent">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/artworks/${current.id}`}
                      className="block truncate font-medium text-white hover:text-accent"
                    >
                      {current.title}
                    </Link>
                    <span className="text-sm text-muted">
                      {current.creator_name}
                    </span>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-3 text-sm text-muted">
                  <span className="hidden md:inline">
                    Gulir untuk menjelajah
                  </span>
                  <button
                    type="button"
                    aria-label="Karya sebelumnya"
                    disabled={active === 0}
                    onClick={() => goTo(active - 1)}
                    className={arrow}
                  >
                    ←
                  </button>
                  <span>
                    {active + 1} / {items.length}
                  </span>
                  <button
                    type="button"
                    aria-label="Karya berikutnya"
                    disabled={active === last}
                    onClick={() => goTo(active + 1)}
                    className={arrow}
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="relative z-20 mt-4 h-0.5 bg-line">
                <div
                  className="h-full bg-muted transition-all duration-300"
                  style={{ width: `${((active + 1) / items.length) * 100}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}