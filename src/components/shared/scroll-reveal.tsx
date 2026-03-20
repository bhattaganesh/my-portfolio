'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  duration?: number;
  /**
   * Fraction of the element that must be visible before the animation fires.
   * Defaults to 0 (any pixel visible).
   */
  amount?: number;
}

const OFFSET = 30;

function getInitialOffset(direction: Direction): { x?: number; y?: number } {
  switch (direction) {
    case 'up':    return { y: OFFSET };
    case 'down':  return { y: -OFFSET };
    case 'left':  return { x: OFFSET };
    case 'right': return { x: -OFFSET };
    case 'none':  return {};
  }
}

/**
 * Wraps children in a motion.div that fades (+ slides) into view once it
 * enters the viewport. Fires only once per page load.
 * Respects `prefers-reduced-motion`: positional offsets are skipped and
 * only opacity is animated when reduced motion is preferred.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  amount = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-80px 0px',
    amount,
  });

  /*
   * Check prefers-reduced-motion on the client only.
   * During SSR this resolves to false — the real preference is checked after
   * hydration on first render.
   */
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const initialOffset = getInitialOffset(direction);

  const variants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: {
          opacity: 0,
          ...initialOffset,
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
        },
      };

  return (
    <motion.div
      ref={ref}
      suppressHydrationWarning
      className={cn(className)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
