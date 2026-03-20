'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-primary-500"
      style={{
        scaleX: prefersReducedMotion ? scrollYProgress : smoothProgress,
      }}
    />
  );
}

export default ScrollProgress;
