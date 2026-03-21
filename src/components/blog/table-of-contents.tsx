'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  headings: TocHeading[];
  className?: string;
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const headingElements = headings
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost heading that is intersecting
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr,
          );
          setActiveId(topEntry.target.id);
        }
      },
      { rootMargin: '-20px 0px -70% 0px', threshold: 0 },
    );

    for (const el of headingElements) {
      observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        'sticky top-28 rounded-2xl border border-surface-200 dark:border-surface-800',
        'bg-surface-50 dark:bg-surface-900 p-5',
        className,
      )}
    >
      <button
        type="button"
        className="flex items-center justify-between w-full text-left mb-3"
        onClick={() => setIsCollapsed((c) => !c)}
        aria-expanded={!isCollapsed}
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-surface-500 dark:text-surface-400">
          On this page
        </span>
        <span
          className={cn(
            'text-surface-400 text-xs transition-transform duration-200',
            isCollapsed ? 'rotate-0' : 'rotate-180',
          )}
          aria-hidden="true"
        >
          ▲
        </span>
      </button>

      {!isCollapsed && (
        <ol className="space-y-1">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={cn(
                  'block text-sm py-1 transition-colors duration-150 leading-snug',
                  h.level === 3 && 'pl-3',
                  activeId === h.id
                    ? 'text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100',
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
