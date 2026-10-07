'use client';

import { useState } from 'react';
import { findWork, work } from '@/content/work';

interface ProjectsAppProps {
  slug: string;
  compact: boolean;
  onSelect: (slug: string) => void;
}

const GROUPS = [
  { label: 'Flagship', items: work.filter((w) => w.flagship) },
  { label: 'More work', items: work.filter((w) => !w.flagship) },
];

/**
 * Finder-style project browser: a sidebar of projects and a detail pane.
 * On narrow screens the sidebar becomes a list that opens the detail view.
 */
export function ProjectsApp({ slug, compact, onSelect }: ProjectsAppProps) {
  const [listOpen, setListOpen] = useState(false);
  const item = findWork(slug) ?? work[0];
  const showList = compact && listOpen;

  const select = (next: string) => {
    onSelect(next);
    setListOpen(false);
  };

  return (
    <div className="gw-finder" data-compact={compact || undefined}>
      {(!compact || showList) && (
        <nav className="gw-finder-sidebar" aria-label="Projects">
          {GROUPS.map((group) => (
            <div key={group.label}>
              <h3>{group.label}</h3>
              <ul>
                {group.items.map((w) => (
                  <li key={w.slug}>
                    <button type="button" aria-current={w.slug === item.slug ? 'true' : undefined} onClick={() => select(w.slug)}>
                      <span className="gw-finder-dot" aria-hidden="true" />
                      {w.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      )}
      {!showList && (
        <article className="gw-finder-detail" aria-labelledby="gw-project-title">
          {compact && (
            <button type="button" className="gw-finder-back" onClick={() => setListOpen(true)}>
              <span aria-hidden="true">‹</span> All projects
            </button>
          )}
          <p className="gw-finder-path">Projects / {item.organization}</p>
          <h3 id="gw-project-title">{item.title}</h3>
          <p className="gw-finder-summary">{item.summary}</p>
          <dl className="gw-finder-facts">
            <div><dt>Role</dt><dd>{item.role}</dd></div>
            <div><dt>Organization</dt><dd>{item.organization}</dd></div>
            <div><dt>Years</dt><dd>{item.year}</dd></div>
          </dl>
          <ul className="gw-finder-stack" aria-label="Technology">
            {item.stack.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <section className="gw-finder-owned" aria-labelledby="gw-owned-title">
            <h4 id="gw-owned-title">What I owned</h4>
            <p>{item.owned}</p>
          </section>
          <ul className="gw-finder-links">
            {item.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </article>
      )}
    </div>
  );
}
