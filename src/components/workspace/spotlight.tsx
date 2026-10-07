'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { MAX_QUERY_LENGTH, search, type SearchResult } from '@/workspace/search';
import { APPS, appById } from './apps';

interface SpotlightProps {
  onChoose: (result: SearchResult) => void;
  onClose: () => void;
}

const KIND_LABEL: Record<SearchResult['kind'], string> = { app: 'App', project: 'Project', command: 'Command' };

const resultKey = (r: SearchResult) => (r.kind === 'app' ? `app:${r.id}` : r.kind === 'project' ? `project:${r.slug}` : `command:${r.command}`);

/**
 * Spotlight-style search over apps, projects and terminal commands, following the ARIA combobox pattern:
 * typing filters, Up and Down move the active result, Enter opens it, Escape closes and returns focus.
 */
export function Spotlight({ onChoose, onClose }: SpotlightProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const results = search(query, APPS);
  const current = results[Math.min(active, results.length - 1)];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length) setActive((i) => (i + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (current) onChoose(current);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="gw-overlay gw-spot-backdrop"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="gw-spot" role="dialog" aria-modal="true" aria-label="Search the workspace">
        <div className="gw-spot-field">
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            role="combobox"
            aria-label="Search apps, projects and commands"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={current ? `${listId}-${resultKey(current)}` : undefined}
            placeholder="Search apps, projects and commands"
            value={query}
            maxLength={MAX_QUERY_LENGTH}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        <ul id={listId} role="listbox" aria-label="Results" className="gw-spot-list">
          {results.map((r) => {
            const key = resultKey(r);
            const selected = current === r;
            return (
              <li
                key={key}
                id={`${listId}-${key}`}
                role="option"
                aria-selected={selected}
                className="gw-spot-item"
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => onChoose(r)}
                onPointerMove={() => setActive(results.indexOf(r))}
              >
                <span className="gw-spot-icon" aria-hidden="true">
                  {r.kind === 'app' ? <span className="gw-icon">{appById(r.id).icon}</span> : r.kind === 'project' ? '◆' : '›_'}
                </span>
                <span className="gw-spot-text">
                  <span className="gw-spot-title">{r.title}</span>
                  <span className="gw-spot-sub">{r.subtitle}</span>
                </span>
                <span className="gw-spot-kind">{KIND_LABEL[r.kind]}</span>
              </li>
            );
          })}
        </ul>
        <p className="gw-spot-status" role="status">
          {query.trim() && results.length === 0 ? `No matches for “${query.trim()}”.` : `${results.length} result${results.length === 1 ? '' : 's'}`}
        </p>
      </div>
    </div>
  );
}
