'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useReducedMotion } from 'motion/react';

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);

  const rawX = useRef(0);
  const rawY = useRef(0);

  const springConfig = { stiffness: 500, damping: 35, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    // Only enable on fine-pointer (mouse) devices
    const mql = window.matchMedia('(pointer: fine)');
    setIsPointerFine(mql.matches);
    if (!mql.matches) return;

    function onMove(e: MouseEvent) {
      rawX.current = e.clientX;
      rawY.current = e.clientY;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    }

    function onEnter() {
      setVisible(true);
    }

    function onLeave() {
      setVisible(false);
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, label');
      setHovering(!!isInteractive);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseover', onMouseOver);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover', onMouseOver);
    };
  }, [x, y, visible]);

  // Don't render on touch devices or with reduced motion
  if (!isPointerFine || prefersReducedMotion) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x, y }}
      >
        <motion.div
          className="rounded-full border border-primary-500/60 dark:border-primary-400/60"
          animate={{
            width: hovering ? 40 : 28,
            height: hovering ? 40 : 28,
            x: hovering ? -20 : -14,
            y: hovering ? -20 : -14,
            opacity: visible ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x, y }}
      >
        <motion.div
          className="rounded-full bg-primary-500 dark:bg-primary-400"
          animate={{
            width: hovering ? 6 : 5,
            height: hovering ? 6 : 5,
            x: hovering ? -3 : -2.5,
            y: hovering ? -3 : -2.5,
            opacity: visible ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        />
      </motion.div>
    </>
  );
}
