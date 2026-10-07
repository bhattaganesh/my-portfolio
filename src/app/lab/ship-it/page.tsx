import type { Metadata } from 'next';
import { ShipIt } from '@/components/ship-it/ship-it';
import { ROUNDS } from '@/lab/ship-it/content';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Ship It',
  description: 'A three-round engineering game: choose a fix for a slow page, duplicate payments and a frozen editor, and see what happens.',
  alternates: { canonical: `${SITE_CONFIG.url}/lab/ship-it/` },
};

export default function ShipItPage() {
  return (
    <div className="mx-auto grid max-w-[1000px] gap-8 px-5 pt-14 pb-24 md:px-10 md:pt-20">
      <div className="grid gap-4">
        <p className="eyebrow">Lab · optional</p>
        <h1 className="m-0 text-5xl font-extrabold tracking-[-0.02em] md:text-6xl">Ship It</h1>
        <p className="m-0 max-w-[60ch] text-lg text-muted">
          A short game about the trade-offs I deal with at work. It is entirely optional: everything about my work is on the rest of the site.
        </p>
      </div>
      <ShipIt />
      <noscript>
        <section aria-labelledby="lessons" className="grid gap-3">
          <h2 id="lessons" className="m-0 text-2xl font-bold">
            The game needs JavaScript. Its three lessons:
          </h2>
          <ol className="m-0 grid gap-2 pl-5">
            {ROUNDS.map((r) => (
              <li key={r.id}>
                <strong>{r.title}:</strong> {r.lesson}
              </li>
            ))}
          </ol>
        </section>
      </noscript>
    </div>
  );
}
