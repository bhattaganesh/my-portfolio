import type { Metadata } from 'next';
import { WorkList } from '@/components/atlas/work-list';
import { work } from '@/content/work';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected projects: Spectra, Masteriyo LMS, WP Agent AI, Everest Forms and User Registration, with what I built and owned on each.',
  alternates: { canonical: `${SITE_CONFIG.url}/work/` },
};

export default function WorkIndexPage() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-14 pb-20 md:px-10 md:pt-20">
      <p className="eyebrow">Work</p>
      <h1 className="mt-4 mb-4 text-5xl font-extrabold tracking-[-0.02em] md:text-7xl">Selected work</h1>
      <p className="mb-12 max-w-[60ch] text-lg text-muted">
        Products I&apos;ve worked on, with my role and the parts I owned. Product reach is the product&apos;s, not a personal metric.
      </p>
      <section aria-labelledby="flagship">
        <h2 id="flagship" className="eyebrow mb-0 border-b-[1.5px] border-ink pb-3">
          Flagship
        </h2>
        <WorkList items={work.filter((w) => w.flagship)} />
      </section>
      <section aria-labelledby="more" className="mt-14">
        <h2 id="more" className="eyebrow mb-0 border-b-[1.5px] border-ink pb-3">
          More work
        </h2>
        <WorkList items={work.filter((w) => !w.flagship)} />
      </section>
    </div>
  );
}
