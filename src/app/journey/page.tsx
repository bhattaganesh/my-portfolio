import type { Metadata } from 'next';
import Link from 'next/link';
import { education, roleDates, roles } from '@/content/profile';
import { work } from '@/content/work';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Journey',
  description: 'Career timeline: B.Sc. CSIT, a Laravel internship at Zenlab, three years at ThemeGrill, and joining Brainstorm Force in 2025.',
  alternates: { canonical: `${SITE_CONFIG.url}/journey/` },
};

export default function JourneyPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-5 pt-14 pb-20 md:px-10 md:pt-20">
      <p className="eyebrow">Journey</p>
      <h1 className="mt-4 mb-4 text-5xl font-extrabold tracking-[-0.02em] md:text-7xl">Career journey</h1>
      <p className="mb-12 max-w-[60ch] text-lg text-muted">
        Roles are listed with their actual titles, with links to related work where it&apos;s published.
      </p>
      <ol className="m-0 list-none border-l-2 border-rule p-0">
        {roles.map((role) => {
          const related = work.filter((w) => w.organization === role.organization);
          return (
            <li key={`${role.organization}-${role.start}`} className="relative grid gap-2 pb-12 pl-8">
              <span aria-hidden="true" className="absolute top-2 -left-[7px] size-3 rounded-full border-2 border-orange bg-paper" />
              <p className="m-0 font-mono text-sm text-muted">{roleDates(role)}</p>
              <h2 className="m-0 text-3xl font-bold">{role.organization}</h2>
              <p className="m-0 text-lg">{role.title}</p>
              {related.length > 0 && (
                <ul className="m-0 mt-1 flex list-none flex-wrap gap-2 p-0">
                  {related.map((w) => (
                    <li key={w.slug}>
                      <Link href={`/work/${w.slug}/`} className="inline-flex min-h-11 items-center rounded-full border border-rule px-4 text-sm font-semibold hover:border-ink">
                        {w.title} →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
        <li className="relative grid gap-2 pl-8">
          <span aria-hidden="true" className="absolute top-2 -left-[7px] size-3 rounded-full border-2 border-orange bg-paper" />
          <p className="m-0 font-mono text-sm text-muted">{education.years}</p>
          <h2 className="m-0 text-3xl font-bold">{education.organization}</h2>
          <p className="m-0 text-lg">{education.title}</p>
        </li>
      </ol>
    </div>
  );
}
