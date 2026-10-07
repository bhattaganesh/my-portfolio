'use client';

import { useState } from 'react';
import { findWork, work } from '@/content/work';
import { ProjectDetail } from './project-detail';

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
        <div className="gw-finder-detail">
          {compact && (
            <button type="button" className="gw-finder-back" onClick={() => setListOpen(true)}>
              <span aria-hidden="true">‹</span> All projects
            </button>
          )}
          <ProjectDetail item={item} eyebrow={`Projects / ${item.organization}`} />
        </div>
      )}
    </div>
  );
}

