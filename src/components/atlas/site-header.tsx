'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/constants';
import { ThemeToggle } from './theme-toggle';

const trim = (path: string) => (path.length > 1 ? path.replace(/\/$/, '') : path);

/**
 * Site header with primary navigation, theme toggle and the optional workspace entry.
 * Below the md breakpoint the navigation collapses into a disclosure menu.
 */
export function SiteHeader() {
  const pathname = trim(usePathname() ?? '/');
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isCurrent = (href: string) => pathname === trim(href) || pathname.startsWith(`${trim(href)}/`);

  const links = (onNavigate?: () => void) =>
    NAV_ITEMS.map(({ label, href }) => (
      <li key={href}>
        <Link
          href={href}
          onClick={onNavigate}
          aria-current={isCurrent(href) ? 'page' : undefined}
          className="motion-colors inline-flex min-h-11 items-center px-1 hover:text-cobalt aria-[current=page]:shadow-[inset_0_-2px_var(--cobalt)]"
        >
          {label}
        </Link>
      </li>
    ));

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-[1240px] items-center gap-6 px-5 py-4 md:px-10">
        <Link href="/" className="flex min-h-11 items-center gap-2.5 font-mono text-sm tracking-wide">
          <span aria-hidden="true" className="grid size-6 place-items-center rounded-full border-[1.5px] border-ink text-[11px] font-bold">
            G
          </span>
          {SITE_CONFIG.name}
        </Link>

        <nav aria-label="Main" className="ml-auto hidden md:block">
          <ul className="flex gap-7 text-[15px]">{links()}</ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <ThemeToggle />
          <Link
            href="/workspace/"
            prefetch={false}
            className="motion-colors hidden min-h-11 items-center rounded-full border-[1.5px] border-ink px-4 text-sm font-semibold hover:bg-ink hover:text-paper sm:inline-flex"
          >
            Enter my workspace
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex min-h-11 items-center rounded-full border border-rule px-4 text-sm font-semibold md:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="site-menu"
          aria-label="Main"
          className="border-t border-rule px-5 pb-4 md:hidden"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false);
              toggleRef.current?.focus();
            }
          }}
        >
          <ul className="grid gap-1 pt-2 text-lg">
            {links(() => setOpen(false))}
            <li>
              <Link href="/workspace/" prefetch={false} onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center px-1">
                Enter my workspace
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
