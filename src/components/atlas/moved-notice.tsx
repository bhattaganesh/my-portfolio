import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Metadata for a page kept only so an old URL still works: not indexed, canonical points at the new URL.
 *
 * @param title Page title.
 * @param to New path, or null when there is no direct replacement.
 * @returns Next.js metadata for the legacy page.
 */
export function movedMetadata(title: string, to: string | null): Metadata {
  return {
    title,
    robots: { index: false, follow: true },
    ...(to ? { alternates: { canonical: `${SITE_CONFIG.url}${to}` } } : {}),
  };
}

interface MovedNoticeProps {
  title: string;
  message: string;
  to?: string;
  links: readonly { label: string; href: string }[];
}

/**
 * Legacy-URL page for GitHub Pages, which has no server redirects. With `to`, it redirects immediately via
 * a meta refresh; either way it shows a visible link, so the page works without JavaScript or redirects.
 */
export function MovedNotice({ title, message, to, links }: MovedNoticeProps) {
  return (
    <section className="mx-auto grid max-w-[720px] gap-5 px-5 py-24 md:px-10">
      {to && <meta httpEquiv="refresh" content={`0; url=${to}`} />}
      <p className="eyebrow">Page moved</p>
      <h1 className="text-4xl font-extrabold md:text-5xl">{title}</h1>
      <p className="text-lg text-muted">{message}</p>
      <ul className="flex flex-wrap gap-3">
        {links.map((l, i) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={`inline-flex min-h-12 items-center rounded-full border-[1.5px] px-5 font-semibold ${i === 0 ? 'border-cobalt bg-cobalt text-on-cobalt' : 'border-ink'}`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
