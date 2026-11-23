"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function ParallaxLayer({ children, speed = 0.1, className = "" }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 500 * speed]);

  return (
    <motion.div className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  );
}