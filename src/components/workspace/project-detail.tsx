'use client';

import { useId } from 'react';
import Link from 'next/link';
import { FlowDiagram } from '@/components/atlas/flow-diagram';
import type { WorkItem } from '@/content/work';

interface ProjectDetailProps {
  item: WorkItem;
  /** Small location line above the title. */
  eyebrow: string;
  /** Receives the title, so a host can move focus to it after navigation. */
  headingRef?: React.Ref<HTMLHeadingElement>;
}

/**
 * One project's case study: summary, facts, ownership, decisions, the request-flow diagram and links.
 * Shared by the Projects and Browser apps; ids are unique per instance.
 */
export function ProjectDetail({ item, eyebrow, headingRef }: ProjectDetailProps) {
  const id = useId();
  return (
    <article aria-labelledby={`${id}-title`}>
      <p className="gw-finder-path">{eyebrow}</p>
      <h3 id={`${id}-title`} ref={headingRef} tabIndex={-1}>{item.title}</h3>
      <p className="gw-finder-summary">{item.summary}</p>
      <dl className="gw-finder-facts">
        <div><dt>Role</dt><dd>{item.role}</dd></div>
        <div><dt>Organization</dt><dd>{item.organization}</dd></div>
        <div><dt>Years</dt><dd>{item.year}</dd></div>
      </dl>
      <ul className="gw-finder-stack" aria-label="Technology">
        {item.stack.map((s) => <li key={s}>{s}</li>)}
      </ul>
      <section className="gw-finder-owned" aria-labelledby={`${id}-owned`}>
        <h4 id={`${id}-owned`}>What I owned</h4>
        <p>{item.owned}</p>
      </section>
      {item.caseStudy && (
        <>
          <section className="gw-finder-section" aria-labelledby={`${id}-decisions`}>
            <h4 id={`${id}-decisions`}>Key decisions</h4>
            <ul className="gw-finder-points">
              {item.caseStudy.decisions.map((d) => (
                <li key={d.title}>
                  <strong>{d.title}</strong>
                  <p>{d.detail}</p>
                  <SourceLink href={d.source.href} label={d.source.label} />
                </li>
              ))}
            </ul>
          </section>
          <section className="gw-finder-section" aria-labelledby={`${id}-flow`}>
            <h4 id={`${id}-flow`}>Architecture: how a request flows</h4>
            <FlowDiagram stages={item.caseStudy.flow} label={`How a request flows through ${item.title}`} className="gw-finder-diagram" />
            <ol className="gw-finder-points">
              {item.caseStudy.flow.map((stage) => (
                <li key={stage.title}>
                  <strong>{stage.title}</strong>
                  <p>{stage.detail}</p>
                  <SourceLink href={stage.source.href} label={stage.source.label} />
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
      <ul className="gw-finder-links">
        <li>
          <Link href={`/work/${item.slug}/`} prefetch={false}>
            Open the full case study on the portfolio
          </Link>
        </li>
        {item.links.map((l) => (
          <li key={l.href}>
            <a href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}

/**
 * A link to the public source file that backs a case-study point.
 *
 * @param props.href The pinned source URL.
 * @param props.label The file name shown to the visitor.
 */
function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="gw-finder-source" href={href} target="_blank" rel="noopener noreferrer">
      Source: {label}
      <span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
    </a>
  );
}
