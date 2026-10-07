import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FlowDiagram } from '@/components/atlas/flow-diagram';
import { findWork, work, type WorkLink } from '@/content/work';
import { SITE_CONFIG } from '@/lib/constants';

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(props: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const item = findWork(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `${SITE_CONFIG.url}/work/${item.slug}/` },
  };
}

export default async function WorkPage(props: PageProps<'/work/[slug]'>) {
  const { slug } = await props.params;
  const item = findWork(slug);
  if (!item) notFound();
  const index = work.indexOf(item);
  const next = work[(index + 1) % work.length];

  return (
    <article className="mx-auto max-w-[1240px] px-5 pt-8 pb-20 md:px-10">
      <nav aria-label="Breadcrumb" className="font-mono text-[13px] text-muted">
        <Link href="/work/" className="hover:text-cobalt">
          Work
        </Link>{' '}
        / {item.title}
      </nav>

      <header className="grid gap-x-10 gap-y-4 pt-8 pb-9 md:grid-cols-[auto_1fr] md:items-end">
        <span className="font-mono text-base text-orange md:row-span-2 md:self-start md:pt-5">{String(index + 1).padStart(2, '0')}</span>
        <h1 className="m-0 text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.9] font-extrabold tracking-[-0.03em]">{item.title}</h1>
        <p className="m-0 max-w-[46ch] text-xl md:text-[22px]">{item.summary}</p>
      </header>

      <dl className="m-0 grid grid-cols-2 border-y border-rule md:grid-cols-4">
        {[
          ['Role', item.role],
          ['Organization', item.organization],
          ['Years', item.year],
          ['Stack', item.stack.join(' · ')],
        ].map(([term, value]) => (
          <div key={term} className="grid gap-1 py-4 pr-4">
            <dt className="font-mono text-xs tracking-[0.06em] text-muted uppercase">{term}</dt>
            <dd className="m-0 text-[15px]">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-12 pt-12 md:grid-cols-[220px_minmax(0,680px)]">
        <aside className="hidden border-t-[1.5px] border-ink pt-3 font-mono text-[13px] leading-loose text-muted md:block">
          <p className="m-0">On this page</p>
          <p className="m-0">What I owned</p>
          {item.caseStudy && (
            <>
              <p className="m-0">Key decisions</p>
              <p className="m-0">How a request flows</p>
            </>
          )}
          <p className="m-0">Links</p>
        </aside>
        <div>
          <section aria-labelledby="owned" className="border-l-[3px] border-orange py-1 pl-5">
            <h2 id="owned" className="m-0 mb-2.5 font-mono text-[13px] font-medium tracking-[0.06em] text-orange uppercase">
              What I owned
            </h2>
            <p className="m-0 text-lg">{item.owned}</p>
          </section>

          {item.caseStudy && (
            <>
              <section aria-labelledby="decisions" className="mt-10">
                <h2 id="decisions" className="mb-4 text-2xl font-bold">
                  Key decisions
                </h2>
                <ul className="m-0 grid list-none gap-6 p-0">
                  {item.caseStudy.decisions.map((d) => (
                    <li key={d.title} className="border-t border-rule pt-4">
                      <h3 className="m-0 text-lg font-bold">{d.title}</h3>
                      <p className="mt-1.5 mb-1.5">{d.detail}</p>
                      <SourceLink link={d.source} />
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="flow" className="mt-10">
                <h2 id="flow" className="mb-1 text-2xl font-bold">
                  How a request flows
                </h2>
                <p className="mt-0 mb-4 text-muted">Traced from the source code; each step links to the file that does it.</p>
                <FlowDiagram stages={item.caseStudy.flow} label={`How a request flows through ${item.title}`} className="mb-6 text-ink" />
                <ol className="m-0 grid list-none gap-4 p-0">
                  {item.caseStudy.flow.map((stage, i) => (
                    <li key={stage.title} className="grid grid-cols-[2.5rem_1fr] gap-x-3">
                      <span aria-hidden="true" className="font-mono text-orange">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <h3 className="m-0 text-base font-bold">{stage.title}</h3>
                        <p className="mt-1 mb-1">{stage.detail}</p>
                        <SourceLink link={stage.source} />
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}

          <section aria-labelledby="links" className="mt-10">
            <h2 id="links" className="mb-3 text-2xl font-bold">
              Links
            </h2>
            <ul className="m-0 grid list-none gap-2 p-0">
              {item.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-cobalt underline-offset-4 hover:underline">
                    {l.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                    <span aria-hidden="true">&nbsp;↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-14 border-t border-rule pt-6">
            <span className="eyebrow">Next</span>
            <br />
            <Link href={`/work/${next.slug}/`} className="inline-flex min-h-11 items-center font-display text-2xl font-bold hover:text-cobalt">
              {next.title} →
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * Renders the public source that backs a case-study point, opening in a new tab.
 *
 * @param props.link The source file or page to link to.
 */
function SourceLink({ link }: { link: WorkLink }) {
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-mono text-[13px] text-cobalt underline underline-offset-4">
      Source: {link.label}
      <span className="sr-only"> (opens in a new tab)</span>
      <span aria-hidden="true">&nbsp;↗</span>
    </a>
  );
}
