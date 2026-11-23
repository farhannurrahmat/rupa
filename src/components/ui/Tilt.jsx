"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

export default function Tilt({ children, className = "", max = 6 }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 150, damping: 20 });

  function onMove(e) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <li style={{ perspective: 900 }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div
        className={`will-change-transform ${className}`}
        style={reduce ? undefined : { rotateX, rotateY }}
      >
        {children}
      </motion.div>
    </li>
  );
}