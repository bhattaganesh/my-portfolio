'use client';

import { useEffect, useId, useReducer, useRef, useState } from 'react';
import { profile, roleDates, roles } from '@/content/profile';
import { findWork, work } from '@/content/work';
import { MAX_ADDRESS_LENGTH, MAX_TABS, activeTab, browse, currentAddress, INITIAL_BROWSER, resolve, type Route } from '@/workspace/browser';
import { search } from '@/workspace/search';
import type { AppId } from '@/workspace/wm';
import { APPS } from './apps';
import { ProjectDetail } from './project-detail';

export interface NoteLink {
  slug: string;
  title: string;
}

interface BrowserAppProps {
  notes: readonly NoteLink[];
  onOpenApp: (app: AppId) => void;
}

const GITHUB_URL = profile.links.find((l) => l.label === 'GitHub')!.href;
const LINKEDIN_URL = profile.links.find((l) => l.label === 'LinkedIn')!.href;

/** Bookmarks, each with the real URL a modified click (new tab or window) should open instead. */
const BOOKMARKS = [
  { label: 'Home', address: 'ganesh://home', href: '/' },
  { label: 'Work', address: 'ganesh://work', href: '/work/' },
  { label: 'Ship It', address: 'ganesh://lab/ship-it', href: '/lab/ship-it/' },
  { label: 'GitHub', address: 'ganesh://github', href: GITHUB_URL },
  { label: 'LinkedIn', address: 'ganesh://linkedin', href: LINKEDIN_URL },
] as const;

/**
 * Tab title for a page.
 *
 * @param route The page.
 * @returns A short title.
 */
function titleFor(route: Route): string {
  switch (route.kind) {
    case 'home': return 'Start page';
    case 'work': return 'Work';
    case 'case': return findWork(route.slug)?.title ?? 'Project';
    case 'notes': return 'Notes';
    case 'shipit': return 'Ship It';
    case 'profile': return route.site === 'github' ? 'GitHub preview' : 'LinkedIn preview';
    case 'external': return 'Leaving the portfolio';
    case 'blocked': return 'Blocked address';
    case 'notFound': return 'Not found';
  }
}

/**
 * Chrome-inspired browser for the portfolio's own pages: tabs, an address bar, bookmarks and history.
 * Other web addresses become an explicit "open in a new tab" link; nothing third-party is embedded.
 */
export function BrowserApp({ notes, onOpenApp }: BrowserAppProps) {
  const [state, dispatch] = useReducer(browse, INITIAL_BROWSER);
  const address = currentAddress(state);
  const { route } = resolve(address);
  const tab = activeTab(state);
  const [draft, setDraft] = useState(address);
  const [editing, setEditing] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tabRefs = useRef(new Map<number, HTMLButtonElement>());
  const moved = useRef(false);
  const base = useId();
  const panelId = `${base}-panel`;

  // Each navigation moves focus to the new page's heading, but not on first render.
  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [address, state.active]);

  const go = (input: string) => {
    moved.current = true;
    setEditing(false);
    dispatch({ type: 'navigate', input });
  };

  const internalLink = (target: string, label: React.ReactNode, href: string) => (
    <a
      href={href}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(target);
      }}
    >
      {label}
    </a>
  );

  const heading = (text: React.ReactNode) => (
    <h3 ref={headingRef} tabIndex={-1} className="gw-br-title">
      {text}
    </h3>
  );

  function page() {
    switch (route.kind) {
      case 'home':
        return (
          <>
            {heading('Ganesh’s portfolio browser')}
            <p className="gw-br-lead">It shows this portfolio’s own pages. Addresses outside the portfolio open in a new tab of your real browser.</p>
            <ul className="gw-br-tiles">
              {BOOKMARKS.slice(1).map((b) => (
                <li key={b.address}>{internalLink(b.address, b.label, b.href)}</li>
              ))}
            </ul>
          </>
        );
      case 'work':
        return (
          <>
            {heading('Work')}
            <ul className="gw-br-list">
              {work.map((w) => (
                <li key={w.slug}>
                  {internalLink(`ganesh://work/${w.slug}`, w.title, `/work/${w.slug}/`)}
                  <span>{w.summary}</span>
                </li>
              ))}
            </ul>
          </>
        );
      case 'case': {
        const item = findWork(route.slug)!;
        return (
          <div className="gw-finder-detail gw-br-case">
            <ProjectDetail item={item} eyebrow={address} headingRef={headingRef} />
          </div>
        );
      }
      case 'notes':
        return (
          <>
            {heading('Notes')}
            {notes.length === 0 ? (
              <p className="gw-br-lead">No notes are published yet. The case studies in {internalLink('ganesh://work', 'Work', '/work/')} show how I approach problems.</p>
            ) : (
              <ul className="gw-br-list">
                {notes.map((n) => (
                  <li key={n.slug}>
                    <a href={`/notes/${n.slug}/`}>{n.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </>
        );
      case 'shipit':
        return (
          <>
            {heading('Ship It')}
            <p className="gw-br-lead">A three-round engineering game about a slow page, duplicate payments and a frozen editor. It is optional and takes about five minutes.</p>
            <p className="gw-br-actions">
              <button type="button" className="gw-btn" onClick={() => onOpenApp('arcade')}>
                Play Ship It
              </button>
              <a href="/lab/ship-it/">Play it on the portfolio instead</a>
            </p>
          </>
        );
      case 'profile':
        return route.site === 'github' ? (
          <>
            <p className="gw-br-preview">Portfolio preview, not the live GitHub page</p>
            {heading('bhattaganesh')}
            <p className="gw-br-lead">{profile.name} on GitHub. One project there that this portfolio documents in depth:</p>
            <ul className="gw-br-list">
              <li>
                {internalLink('ganesh://work/wp-agent-ai', 'WP Agent AI', '/work/wp-agent-ai/')}
                <span>{findWork('wp-agent-ai')?.summary}</span>
              </li>
            </ul>
            <p className="gw-br-actions">
              <a className="gw-btn gw-btn-link" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                Open on GitHub<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
              </a>
            </p>
          </>
        ) : (
          <>
            <p className="gw-br-preview">Portfolio preview, not the live LinkedIn page</p>
            {heading(profile.name)}
            <p className="gw-br-lead">{profile.summary}</p>
            <ul className="gw-br-list">
              {roles.map((r) => (
                <li key={`${r.organization}-${r.start}`}>
                  <strong>
                    {r.title}, {r.organization}
                  </strong>
                  <span>{roleDates(r)}</span>
                </li>
              ))}
            </ul>
            <p className="gw-br-actions">
              <a className="gw-btn gw-btn-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                Open on LinkedIn<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
              </a>
            </p>
          </>
        );
      case 'external': {
        const host = new URL(route.href).host;
        return (
          <>
            {heading('Leaving the portfolio')}
            <p className="gw-br-lead">This browser only shows pages from this portfolio. The address below is another website, and it opens in a new tab of your real browser.</p>
            <p className="gw-br-addr">{route.href}</p>
            <p className="gw-br-actions">
              <a className="gw-btn gw-btn-link" href={route.href} target="_blank" rel="noopener noreferrer">
                Open {host} in a new tab
              </a>
            </p>
          </>
        );
      }
      case 'blocked':
        return (
          <>
            {heading('That address can’t be opened')}
            <p className="gw-br-lead">Only web addresses (https://) and this portfolio’s own pages can be opened from here.</p>
            <p className="gw-br-addr">{route.input}</p>
          </>
        );
      case 'notFound': {
        const matches = search(route.input, APPS).filter((r) => r.kind === 'project');
        return (
          <>
            {heading('No portfolio page at that address')}
            <p className="gw-br-addr">{route.input}</p>
            {matches.length > 0 && (
              <>
                <p className="gw-br-lead">Matching projects:</p>
                <ul className="gw-br-list">
                  {matches.map((m) => m.kind === 'project' && <li key={m.slug}>{internalLink(`ganesh://work/${m.slug}`, m.title, `/work/${m.slug}/`)}</li>)}
                </ul>
              </>
            )}
            <p className="gw-br-lead">Try a bookmark above, or {internalLink('ganesh://home', 'the start page', '/')}.</p>
          </>
        );
      }
    }
  }

  // Switching tabs keeps focus on the tab (ARIA tabs pattern), unlike navigating, which focuses the page.
  const switchTab = (id: number) => {
    moved.current = false;
    dispatch({ type: 'switchTab', id });
  };

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Delete') {
      e.preventDefault();
      const remaining = state.tabs.filter((t) => t.id !== state.tabs[i].id);
      const neighbour = remaining[Math.min(i, remaining.length - 1)];
      dispatch({ type: 'closeTab', id: state.tabs[i].id });
      if (neighbour) requestAnimationFrame(() => tabRefs.current.get(neighbour.id)?.focus());
      else requestAnimationFrame(() => tabRefs.current.values().next().value?.focus());
      return;
    }
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = state.tabs[(i + step + state.tabs.length) % state.tabs.length];
    switchTab(next.id);
    tabRefs.current.get(next.id)?.focus();
  };

  return (
    <div className="gw-br">
      <div className="gw-br-tabs">
        <div role="tablist" aria-label="Browser tabs (Delete closes a tab)">
          {state.tabs.map((t, i) => {
            const selected = t.id === state.active;
            const title = titleFor(resolve(t.entries[t.index]).route);
            return (
              <div key={t.id} role="presentation" className="gw-br-tab" data-selected={selected || undefined}>
                <button
                  type="button"
                  role="tab"
                  id={`${base}-tab-${t.id}`}
                  ref={(el) => {
                    if (el) tabRefs.current.set(t.id, el);
                    else tabRefs.current.delete(t.id);
                  }}
                  aria-selected={selected}
                  aria-controls={selected ? panelId : undefined}
                  tabIndex={selected ? 0 : -1}
                  aria-keyshortcuts="Delete"
                  onClick={() => switchTab(t.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  {title}
                </button>
                {/* Pointer shortcut only; keyboard and screen-reader users close the focused tab with Delete. */}
                <button type="button" className="gw-br-close" aria-hidden="true" tabIndex={-1} title={`Close ${title}`} onClick={() => dispatch({ type: 'closeTab', id: t.id })}>
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            );
          })}
        </div>
        <button type="button" className="gw-br-new" aria-label="New tab" disabled={state.tabs.length >= MAX_TABS} onClick={() => {
            moved.current = true;
            dispatch({ type: 'newTab' });
          }}>
          <span aria-hidden="true">+</span>
        </button>
      </div>

      <div className="gw-br-toolbar">
        <button type="button" aria-label="Back" disabled={tab.index === 0} onClick={() => { moved.current = true; dispatch({ type: 'back' }); }}>
          <span aria-hidden="true">←</span>
        </button>
        <button type="button" aria-label="Forward" disabled={tab.index >= tab.entries.length - 1} onClick={() => { moved.current = true; dispatch({ type: 'forward' }); }}>
          <span aria-hidden="true">→</span>
        </button>
        <form
          className="gw-br-address"
          onSubmit={(e) => {
            e.preventDefault();
            go(draft);
          }}
        >
          <input
            aria-label="Address"
            value={editing ? draft : address}
            maxLength={MAX_ADDRESS_LENGTH}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            onFocus={(e) => {
              setDraft(address);
              setEditing(true);
              e.currentTarget.select();
            }}
            onBlur={() => setEditing(false)}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setDraft(address);
                e.currentTarget.select();
              }
            }}
          />
        </form>
      </div>

      <nav className="gw-br-bookmarks" aria-label="Bookmarks">
        <ul>
          {BOOKMARKS.map((b) => (
            <li key={b.address}>
              <button type="button" aria-current={address === b.address ? 'page' : undefined} onClick={() => go(b.address)}>
                {b.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="gw-br-page" role="tabpanel" id={panelId} aria-labelledby={`${base}-tab-${state.active}`}>
        {page()}
      </div>
    </div>
  );
}
