import Link from 'next/link';
import { profile } from '@/content/profile';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/constants';

/**
 * Footer with the full navigation, so every page stays reachable without JavaScript.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-5 py-12 md:grid-cols-[1fr_auto_auto] md:px-10">
        <div className="grid content-start gap-2">
          <p className="font-display text-2xl font-bold">{SITE_CONFIG.name}</p>
          <p className="text-muted">{profile.summary}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid gap-1">
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center hover:text-cobalt">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/workspace/" prefetch={false} className="inline-flex min-h-11 items-center hover:text-cobalt">
                Workspace
              </Link>
            </li>
          </ul>
        </nav>
        <ul className="grid content-start gap-1">
          <li>
            <a href={`mailto:${profile.email}`} className="inline-flex min-h-11 items-center hover:text-cobalt">
              {profile.email}
            </a>
          </li>
          {profile.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-cobalt">
                {l.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
