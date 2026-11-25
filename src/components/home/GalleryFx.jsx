"use client";

import { useEffect, useRef } from "react";
import { dominantRgb } from "@/lib/color";

export default function GalleryFx() {
  const ambRef = useRef(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const amb = ambRef.current;
    let ticking = false;

    // Foto Parallax
    function parallax() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        document.querySelectorAll(".pm").forEach((m) => {
          const r = m.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) return;
          const v = Math.max(-1, Math.min(1, ((r.top + r.height / 2) / innerHeight - 0.5) * 2));
          m.style.setProperty("--py", v.toFixed(3));
        });
      });
    }

    // Parallax pointer
    function onMove(e) {
      if (e.pointerType === "touch") return;
      const el = e.target.closest?.(".pm");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ty", ((px - 0.5) * 8).toFixed(2) + "deg");
      el.style.setProperty("--tx", ((0.5 - py) * 8).toFixed(2) + "deg");
    }

    function onOut(e) {
      const el = e.target.closest?.(".pm");
      if (!el || el.contains(e.relatedTarget)) return;
      el.style.removeProperty("--tx");
      el.style.removeProperty("--ty");
    }

    // cahaya berubah sesuai warna dominan foto
    function onOver(e) {
      const el = e.target.closest?.("[data-src]");
      if (!el) return;
      dominantRgb(el.dataset.src).then((c) => {
        if (c) amb.style.backgroundColor = `rgb(${c})`;
      });
    }

    parallax();
    addEventListener("scroll", parallax, { passive: true });
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerover", onOver);
    return () => {
      removeEventListener("scroll", parallax);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerover", onOver);
    };
  }, []);

  return <div ref={ambRef} className="tn-amb" aria-hidden="true" />;
}