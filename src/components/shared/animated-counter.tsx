'use client';

import { useEffect, useRef } from 'react';
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({
  value,
  suffix,
  className,
  duration = 1.5,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(ref, { once: true });

  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;

    if (prefersReducedMotion) {
      motionValue.set(value);
      return;
    }

    // Start from 0 on client, then animate up
    motionValue.set(0);
    if (ref.current) {
      ref.current.textContent = `0${suffix ?? ''}`;
    }

    const controls = animate(motionValue, value, {
      duration,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [inView, value, duration, motionValue, prefersReducedMotion, suffix]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = `${v}${suffix ?? ''}`;
      }
    });

    return () => unsubscribe();
  }, [rounded, suffix]);

  return (
    <span ref={ref} className={cn(className)} suppressHydrationWarning>
      {`${value}${suffix ?? ''}`}
    </span>
  );
}

export default AnimatedCounter;
