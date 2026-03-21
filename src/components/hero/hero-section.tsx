'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { SocialLinks } from '@/components/shared/social-links';
import { Container } from '@/components/ui/container';
import { useFirstVisit } from '@/hooks/use-first-visit';
import { GreetingClock } from './greeting-clock';

const Hero3dScene = lazy(() =>
  import('./hero-3d-scene').then((m) => ({ default: m.Hero3dScene })),
);

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const isFirstVisit = useFirstVisit();
  const [showWelcome, setShowWelcome] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isFirstVisit) return;
    setShowWelcome(true);
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, [isFirstVisit]);

  // Animate-driven entrance: hidden state on server + first client render,
  // visible state after mount. `initial={false}` ensures Motion renders at
  // the current `animate` value without applying separate initial styles,
  // which eliminates hydration mismatches (server can't detect reduced motion).
  const hidden = { opacity: 0, y: 20 };
  const hiddenScale = { opacity: 0, scale: 0.9 };
  const visible = { opacity: 1, y: 0 };
  const visibleScale = { opacity: 1, scale: 1 };
  const visibleFade = { opacity: 1 };

  const shouldAnimate = mounted && !prefersReducedMotion;

  const entrance = (delay: number, duration = 0.5) =>
    shouldAnimate ? { delay, duration } : { duration: 0 };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >

      <Container className="relative z-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT: Text content ── */}
          <div className="space-y-6">

            {/* First-visit welcome pill */}
            <AnimatePresence>
              {showWelcome && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-700 dark:text-primary-300 text-sm font-medium">
                    Welcome! Thanks for visiting.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Availability badge */}
            <motion.div
              initial={false}
              animate={mounted ? visible : hidden}
              transition={entrance(0.1)}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm font-mono font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" aria-hidden="true" />
                Available for work
              </span>
            </motion.div>

            {/* Name — clean, bold, gradient */}
            <motion.h1
              className="text-fluid-hero font-medium text-surface-900 dark:text-white leading-[var(--leading-hero)] tracking-[var(--tracking-display)] font-display"
              initial={false}
              animate={mounted ? visible : { opacity: 0, y: 30 }}
              transition={entrance(0.2, 0.6)}
            >
              Hello, I&apos;m{' '}
              <span className="font-extrabold text-gradient">Ganesh Bhatt</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={false}
              animate={mounted ? visible : hidden}
              transition={entrance(0.4)}
            >
              <p className="font-mono text-sm uppercase tracking-[var(--tracking-caps)] text-primary-600 dark:text-primary-300 font-medium">
                Full-Stack Developer
              </p>
            </motion.div>

            {/* Bio tagline */}
            <motion.p
              className="text-fluid-body-lg text-surface-600 dark:text-surface-400 leading-relaxed max-w-lg"
              initial={false}
              animate={mounted ? visible : hidden}
              transition={entrance(0.5)}
            >
              Core engineer on{' '}
              <span className="text-surface-800 dark:text-surface-200 font-medium">Spectra Blocks</span> — built the architecture and key features
              for the Gutenberg blocks plugin powering{' '}
              <span className="text-surface-800 dark:text-surface-200 font-medium">1M+ WordPress sites</span>.
              Building at{' '}
              <span className="text-surface-700 dark:text-surface-300 font-medium">Brainstorm Force</span>.
            </motion.p>

            {/* Location */}
            <motion.div
              className="flex items-center gap-1.5 text-surface-500 text-sm"
              initial={false}
              animate={mounted ? visibleFade : { opacity: 0 }}
              transition={entrance(0.6)}
            >
              <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{SITE_CONFIG.location}</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-3 pt-2"
              initial={false}
              animate={mounted ? visible : hidden}
              transition={entrance(0.7)}
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-50 dark:focus-visible:ring-offset-surface-950"
              >
                View My Work
                <ArrowRight
                  className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm border border-surface-300 dark:border-surface-700 hover:border-primary-500 dark:hover:border-primary-500 text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold rounded-lg transition-all duration-200 hover:bg-primary-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-50 dark:focus-visible:ring-offset-surface-950"
              >
                Get in Touch
              </Link>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={false}
              animate={mounted ? visibleFade : { opacity: 0 }}
              transition={entrance(0.85)}
            >
              <SocialLinks
                className="text-surface-500"
                linkClassName="hover:bg-surface-200/60 dark:hover:bg-surface-800/60 hover:text-primary-600 dark:hover:text-primary-400"
              />
            </motion.div>
          </div>

          {/* ── RIGHT: Greeting Clock + 3D Floating Geometry ── */}
          <motion.div
            className="relative w-full max-w-lg mx-auto lg:mx-0"
            initial={false}
            animate={mounted ? visibleScale : hiddenScale}
            transition={shouldAnimate ? { delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } : { duration: 0 }}
          >
            {/* 3D scene — floats behind the clock card */}
            {!prefersReducedMotion && mounted && (
              <div
                className="absolute -inset-8 pointer-events-none opacity-60 dark:opacity-40"
                aria-hidden="true"
              >
                <Suspense fallback={null}>
                  <Hero3dScene />
                </Suspense>
              </div>
            )}
            <div className="relative w-full h-full rounded-2xl overflow-hidden ring-1 ring-surface-200/50 dark:ring-surface-800/50">
              <GreetingClock />
            </div>
          </motion.div>

        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        aria-hidden="true"
        animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
        transition={prefersReducedMotion ? undefined : { repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <div className="w-6 h-10 border-2 border-surface-300 dark:border-surface-700 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary-500 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
