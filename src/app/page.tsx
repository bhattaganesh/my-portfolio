import type { Metadata } from 'next';
import Link from 'next/link';
import { ContourPlate } from '@/components/atlas/contour-plate';
import { CopyEmail } from '@/components/atlas/copy-email';
import { WorkList } from '@/components/atlas/work-list';
import { education, profile, roleDates, roles } from '@/content/profile';
import { work } from '@/content/work';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: `${SITE_CONFIG.name} – ${SITE_CONFIG.title}` },
  description: SITE_CONFIG.description,
  alternates: { canonical: `${SITE_CONFIG.url}/` },
};

const SECTION = 'mx-auto max-w-[1240px] px-5 md:px-10';

export default function HomePage() {
  return (
    <>
      <section className={`${SECTION} grid items-start gap-12 py-14 md:grid-cols-[7fr_5fr] md:gap-14 md:py-20`}>
        <div>
          <p className="eyebrow">Senior full-stack engineer · {SITE_CONFIG.location} · remote</p>
          <h1 className="mt-5 mb-7 text-[clamp(2.9rem,7vw+0.6rem,6.5rem)] leading-[0.95] font-extrabold tracking-[-0.025em]">
            I build the systems behind <em className="text-cobalt not-italic">better software.</em>
          </h1>
          <p className="mb-8 max-w-[36ch] text-lg md:text-xl">
            I work across WordPress, Gutenberg, React and PHP.{' '}
            <span className="text-muted">
              I joined Brainstorm Force in 2025 to work on Spectra, after three years at ThemeGrill building Masteriyo LMS, Everest Forms and User
              Registration.
            </span>
          </p>
          <div className="flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
            <Link href="/work/" className="inline-flex min-h-13 items-center justify-center rounded-full bg-cobalt px-6 font-semibold text-on-cobalt">
              Explore selected work →
            </Link>
            <a href={`mailto:${profile.email}`} className="inline-flex min-h-13 items-center justify-center rounded-full border-[1.5px] border-ink px-6 font-semibold">
              Email me
            </a>
          </div>
          <aside aria-labelledby="workspace-invite" className="mt-9 grid max-w-[620px] gap-x-4 gap-y-1.5 rounded-2xl border border-rule bg-tint p-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <h2 id="workspace-invite" className="m-0 text-xl font-bold">
              Prefer to explore?
            </h2>
            <p className="m-0 text-[15px] text-muted sm:col-start-1">
              Open my workspace to browse projects in windows and try a portfolio terminal.
            </p>
            <Link
              href="/workspace/"
              prefetch={false}
              className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full border-[1.5px] border-ink px-4 text-sm font-semibold sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:mt-0"
            >
              Enter my workspace →
            </Link>
          </aside>
        </div>
        <ContourPlate />
      </section>

      <section aria-labelledby="selected-work" className={`${SECTION} pb-20`}>
        <div className="flex items-baseline justify-between border-b-[1.5px] border-ink pb-3.5">
          <h2 id="selected-work" className="m-0 text-3xl font-bold md:text-[34px]">
            Selected work
          </h2>
          <Link href="/work/" className="eyebrow hover:text-cobalt">
            All {work.length} projects
          </Link>
        </div>
        <WorkList items={work.filter((w) => w.flagship)} />
      </section>

      <section aria-labelledby="journey" className={`${SECTION} grid gap-8 pb-20 md:grid-cols-[1fr_2fr]`}>
        <div>
          <h2 id="journey" className="m-0 text-3xl font-bold md:text-[34px]">
            Journey
          </h2>
          <Link href="/journey/" className="mt-3 inline-flex min-h-11 items-center font-semibold text-cobalt">
            The full journey →
          </Link>
        </div>
        <ol className="m-0 grid list-none gap-0 p-0">
          {roles.map((r) => (
            <li key={`${r.organization}-${r.start}`} className="grid gap-1 border-b border-rule py-4 md:grid-cols-[220px_1fr]">
              <span className="font-mono text-sm text-muted">{roleDates(r)}</span>
              <span>
                <strong className="font-semibold">{r.title}</strong>, {r.organization}
              </span>
            </li>
          ))}
          <li className="grid gap-1 py-4 md:grid-cols-[220px_1fr]">
            <span className="font-mono text-sm text-muted">{education.years}</span>
            <span>
              <strong className="font-semibold">{education.title}</strong>, {education.organization}
            </span>
          </li>
        </ol>
      </section>

      <section aria-labelledby="contact" className="border-t border-rule bg-tint">
        <div className={`${SECTION} grid gap-6 py-16 md:grid-cols-2 md:items-end`}>
          <div className="grid gap-3">
            <p className="eyebrow">Contact</p>
            <h2 id="contact" className="m-0 text-3xl font-bold md:text-4xl">
              Hiring for a senior full-stack role?
            </h2>
            <p className="m-0 text-muted">I&apos;m open to senior full-stack engineering roles and to architecture consulting.</p>
          </div>
          <CopyEmail email={profile.email} />
        </div>
      </section>
    </>
  );
}
