'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/constants';
import { ThemeToggle } from './theme-toggle';
import { LogoMark } from './logo';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Track scroll position */
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  /* Close mobile menu on Escape key */
  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  /* Focus management for mobile menu */
  useEffect(() => {
    if (mobileOpen) {
      requestAnimationFrame(() => {
        const firstLink = menuRef.current?.querySelector('a');
        firstLink?.focus();
      });
    }
  }, [mobileOpen]);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        'border-b border-surface-200/50 dark:border-surface-800/50',
        scrolled
          ? 'bg-white/90 dark:bg-surface-950/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3 shrink-0',
              'rounded-lg px-1',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              'focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-950',
              'transition-opacity duration-200 hover:opacity-80',
            )}
            aria-label={`${SITE_CONFIG.name} — home`}
          >
            {/* Logo mark */}
            <LogoMark size={32} className="shrink-0" />
            {/* Name — hidden on very small screens */}
            <span className="hidden sm:block font-display font-bold text-surface-900 dark:text-surface-50 text-sm leading-tight">
              Ganesh
              <span className="block font-mono font-normal text-[10px] uppercase tracking-[var(--tracking-caps)] text-surface-500 dark:text-surface-400">
                Full-Stack Developer
              </span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1"
          >
            {NAV_ITEMS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative px-3 py-2 rounded-lg text-sm font-medium tracking-[var(--tracking-nav)]',
                    'transition-all duration-200 ease-in-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    active
                      ? 'text-primary-600 dark:text-primary-400'
                      : [
                          'text-surface-600 dark:text-surface-400',
                          'hover:text-surface-900 dark:hover:text-surface-100',
                          'hover:bg-surface-100 dark:hover:bg-surface-800/60',
                        ],
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                  {/* Active indicator underline */}
                  {active && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop actions ── */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Hire Me CTA — hidden on mobile (shown in mobile menu) */}
            <Link
              href="/contact"
              className={cn(
                'hidden md:inline-flex items-center gap-1.5',
                'h-9 px-4 rounded-lg text-sm font-medium',
                'bg-primary-600 dark:bg-primary-500 text-white',
                'hover:bg-primary-700 dark:hover:bg-primary-600',
                'active:scale-[0.97]',
                'transition-all duration-200 shadow-sm hover:shadow-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                'focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-950',
              )}
            >
              Hire Me
              <span
                className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                aria-hidden="true"
              />
            </Link>

            {/* Mobile hamburger */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className={cn(
                'md:hidden flex items-center justify-center',
                'w-9 h-9 rounded-lg',
                'text-surface-600 dark:text-surface-400',
                'hover:text-surface-900 dark:hover:text-surface-100',
                'hover:bg-surface-100 dark:hover:bg-surface-800',
                'transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              )}
            >
              {mobileOpen ? (
                <X size={20} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Menu size={20} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'md:hidden',
              'border-t border-surface-200/80 dark:border-surface-800/80',
              'bg-white/95 dark:bg-surface-950/95 backdrop-blur-md',
            )}
            aria-label="Mobile navigation"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map(({ label, href }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center px-4 py-2.5 rounded-lg text-sm font-medium',
                      'transition-all duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      active
                        ? [
                            'bg-primary-50 dark:bg-primary-950/50',
                            'text-primary-700 dark:text-primary-300',
                          ]
                        : [
                            'text-surface-700 dark:text-surface-300',
                            'hover:bg-surface-100 dark:hover:bg-surface-800',
                            'hover:text-surface-900 dark:hover:text-surface-100',
                          ],
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {/* Active indicator */}
                    <span
                      className={cn(
                        'w-1 h-4 rounded-full mr-3 transition-colors duration-150',
                        active
                          ? 'bg-primary-500'
                          : 'bg-transparent',
                      )}
                      aria-hidden="true"
                    />
                    {label}
                  </Link>
                );
              })}

              {/* Mobile CTA */}
              <div className="mt-3 pt-3 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between gap-3">
                <Link
                  href="/contact"
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2',
                    'h-10 px-5 rounded-lg text-sm font-medium',
                    'bg-primary-600 dark:bg-primary-500 text-white',
                    'hover:bg-primary-700 dark:hover:bg-primary-600',
                    'transition-all duration-200 shadow-sm',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  )}
                >
                  Hire Me
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
