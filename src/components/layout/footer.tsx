import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG, NAV_ITEMS } from '@/lib/constants';
import { SocialLinks } from '@/components/shared/social-links';
import { Container } from '@/components/ui/container';
import { LogoMark } from './logo';
import { cn } from '@/lib/utils';

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer
      className={cn(
        'bg-surface-50 dark:bg-surface-950',
        'border-t border-surface-200 dark:border-surface-800',
      )}
      aria-label="Site footer"
    >
      {/* ── Main footer grid ── */}
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {/* ── Col 1: Brand ── */}
          <div className="flex flex-col gap-5">
            {/* Logo mark + name */}
            <Link
              href="/"
              className={cn(
                'self-start flex items-center gap-3',
                'rounded-lg',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                'focus-visible:ring-offset-surface-50 dark:focus-visible:ring-offset-surface-950',
                'transition-opacity duration-200 hover:opacity-80',
              )}
              aria-label="Ganesh Bhatt — home"
            >
              <LogoMark size={36} className="shrink-0" />
              <span className="font-display font-bold text-surface-900 dark:text-surface-50 leading-tight">
                Ganesh Bhatt
                <span className="block text-xs font-normal text-surface-500 dark:text-surface-400 tracking-wide">
                  Full-Stack Developer
                </span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-400 max-w-xs"> {/* [UX-FIX] surface-500 on surface-50 = borderline WCAG AA */}
              Full-stack developer building software that reaches millions.
              Currently at Brainstorm Force, core engineer on Spectra v3.
            </p>

            {/* Social links */}
            <SocialLinks size={18} />
          </div>

          {/* ── Col 2: Navigation ── */}
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-surface-500 dark:text-surface-500"> {/* [UX-FIX] surface-400 = 2.37:1 on surface-50 — WCAG AA fail */}
              Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-2" role="list">
                {NAV_ITEMS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'inline-flex items-center gap-1.5',
                        'text-sm text-surface-600 dark:text-surface-400',
                        'hover:text-primary-600 dark:hover:text-primary-400',
                        'transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:underline',
                        'group',
                      )}
                    >
                      <span
                        className={cn(
                          'w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600',
                          'group-hover:bg-primary-500 dark:group-hover:bg-primary-400',
                          'transition-colors duration-150 shrink-0',
                        )}
                        aria-hidden="true"
                      />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Col 3: Contact ── */}
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-surface-500 dark:text-surface-500"> {/* [UX-FIX] surface-400 = 2.37:1 on surface-50 — WCAG AA fail */}
              Get In Touch
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {/* Email */}
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className={cn(
                    'flex items-center gap-3 group',
                    'text-sm text-surface-600 dark:text-surface-400',
                    'hover:text-primary-600 dark:hover:text-primary-400',
                    'transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:underline',
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
                      'bg-surface-100 dark:bg-surface-800',
                      'group-hover:bg-primary-100 dark:group-hover:bg-primary-950',
                      'transition-colors duration-150',
                    )}
                    aria-hidden="true"
                  >
                    <Mail
                      size={14}
                      className="text-surface-500 dark:text-surface-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                    />
                  </span>
                  <span className="truncate">{SITE_CONFIG.email}</span>
                </a>
              </li>

              {/* Location */}
              <li>
                <span
                  className={cn(
                    'flex items-center gap-3',
                    'text-sm text-surface-600 dark:text-surface-400',
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
                      'bg-surface-100 dark:bg-surface-800',
                    )}
                    aria-hidden="true"
                  >
                    <MapPin size={14} className="text-surface-500 dark:text-surface-400" />
                  </span>
                  <span>{SITE_CONFIG.location}</span>
                </span>
              </li>
            </ul>

            {/* Contact CTA */}
            <Link
              href="/contact"
              className={cn(
                'mt-1 self-start inline-flex items-center gap-1.5',
                'text-sm font-medium',
                'text-primary-600 dark:text-primary-400',
                'hover:text-primary-700 dark:hover:text-primary-300',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:underline',
                'group',
              )}
            >
              Send a message
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </Container>

      {/* ── Bottom bar ── */}
      <div className="border-t border-surface-200 dark:border-surface-800">
        <Container className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Copyright */}
            <p className="text-xs text-surface-500 dark:text-surface-500 text-center sm:text-left"> {/* [UX-FIX] surface-400 fails WCAG AA at small text sizes */}
              &copy; {CURRENT_YEAR}{' '}
              <span className="text-surface-600 dark:text-surface-400 font-medium">
                {SITE_CONFIG.name}
              </span>
              . All rights reserved.
            </p>

            {/* Available for work badge */}
            <div
              className={cn(
                'inline-flex items-center gap-2',
                'px-3 py-1.5 rounded-full',
                'bg-green-50 dark:bg-green-950/50',
                'border border-green-200 dark:border-green-800/60',
              )}
              role="status"
              aria-label="Employment status: available for work"
            >
              <span
                className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                Available for work
              </span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
