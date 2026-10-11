'use client';

import { useEffect, useId, useReducer, useRef, useState, useSyncExternalStore } from 'react';
import { profile, roleDates, roles } from '@/content/profile';
import { findWork, work, type WorkItem } from '@/content/work';
import {
  HOME,
  MAX_ADDRESS_LENGTH,
  MAX_TABS,
  activeTab,
  browse,
  currentAddress,
  INITIAL_BROWSER,
  resolve,
  searchPortfolio,
  type Route,
} from '@/workspace/browser';
import type { AppId } from '@/workspace/wm';
import { RunnerGame } from '@/components/arcade/runner-game';
import { PopupMenu } from './popup-menu';
import { ProjectDetail } from './project-detail';
import './browser.css';

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
const SEARCHABLE = work.map((w) => ({
  slug: w.slug,
  title: w.title,
  summary: w.summary,
  text: [w.organization, w.role, w.owned, w.stack.join(' '), ...(w.caseStudy?.decisions.map((d) => `${d.title} ${d.detail}`) ?? [])].join(' '),
}));

const BOOKMARKS = [
  { label: 'Work', address: 'ganesh://work' },
  { label: 'WP Agent AI', address: 'ganesh://work/wp-agent-ai' },
  { label: 'Arcade', address: 'ganesh://arcade' },
  { label: 'GitHub', address: 'ganesh://github' },
  { label: 'LinkedIn', address: 'ganesh://linkedin' },
] as const;

const SHORTCUTS = [
  { label: 'Work', address: 'ganesh://work' },
  { label: 'Spectra', address: 'ganesh://work/spectra' },
  { label: 'WP Agent AI', address: 'ganesh://work/wp-agent-ai' },
  { label: 'Masteriyo', address: 'ganesh://work/masteriyo' },
  { label: 'Arcade', address: 'ganesh://arcade' },
  { label: 'GitHub', address: 'ganesh://github' },
  { label: 'LinkedIn', address: 'ganesh://linkedin' },
] as const;

/** Tab title for a page. */
function titleFor(route: Route): string {
  switch (route.kind) {
    case 'home': return 'New Tab';
    case 'work': return 'Work · Ganesh';
    case 'case': return findWork(route.slug)?.title ?? 'Project';
    case 'notes': return 'Notes · Ganesh';
    case 'arcade': return 'Arcade';
    case 'search': return `${route.query} - Search`;
    case 'profile': return route.site === 'github' ? 'bhattaganesh · GitHub preview' : `${profile.name} · LinkedIn preview`;
    case 'external': return new URL(route.href).host;
    case 'blocked': return 'Blocked';
    case 'notFound': return "Can't reach this page";
  }
}

/** The real page on the live site that an internal page mirrors, for "open in a new window". */
function liveUrl(route: Route): string | null {
  switch (route.kind) {
    case 'home': return '/';
    case 'work': return '/work/';
    case 'case': return `/work/${route.slug}/`;
    case 'profile': return route.site === 'github' ? GITHUB_URL : LINKEDIN_URL;
    case 'external': return route.href;
    default: return null;
  }
}

/**
 * The real URL behind an internal address, used when a link is opened in a new tab or window.
 *
 * @param address A ganesh:// address.
 * @returns The live page it mirrors, or the Workspace for pages that only exist here.
 */
function hrefFor(address: string): string {
  return liveUrl(resolve(address).route) ?? '/workspace/';
}

/**
 * A small page icon for tabs, bookmarks and shortcuts.
 *
 * @param props.route The page it stands for.
 */
function Favicon({ route }: { route: Route }) {
  const k = route.kind;
  if (k === 'case' || k === 'work') {
    const letter = k === 'case' ? (findWork(route.slug)?.title[0] ?? 'P') : 'W';
    return (
      <svg className="br-fav" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <rect width="16" height="16" rx="4" fill={k === 'work' ? '#2343d6' : '#c2531f'} />
        <text x="8" y="12" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff">{letter}</text>
      </svg>
    );
  }
  if (k === 'arcade') {
    return (
      <svg className="br-fav" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <rect width="16" height="16" rx="4" fill="#e0662f" />
        <path d="M4 6h8a2.5 2.5 0 0 1 2.5 2.5v.5a2 2 0 0 1-3.6 1.2L10 9H6l-.9 1.2A2 2 0 0 1 1.5 9v-.5A2.5 2.5 0 0 1 4 6z" fill="#fff" />
      </svg>
    );
  }
  if (k === 'profile') {
    return route.site === 'github' ? (
      <svg className="br-fav" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <rect width="16" height="16" rx="8" fill="#24292f" />
        <path d="M6 5L3.5 8 6 11M10 5l2.5 3L10 11" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : (
      <svg className="br-fav" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <rect width="16" height="16" rx="3" fill="#4b5563" />
        <circle cx="8" cy="6" r="2.4" fill="#fff" />
        <path d="M3.8 13c.6-2.4 2.2-3.6 4.2-3.6s3.6 1.2 4.2 3.6z" fill="#fff" />
      </svg>
    );
  }
  if (k === 'search') {
    return (
      <svg className="br-fav" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (k === 'external' || k === 'blocked' || k === 'notFound') {
    return (
      <svg className="br-fav" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="6.3" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M1.8 8h12.4M8 1.7c-2 2-2.8 4-2.8 6.3S6 12.3 8 14.3M8 1.7c2 2 2.8 4 2.8 6.3s-.8 4.3-2.8 6.3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg className="br-fav" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="8" fill="#16181c" />
      <text x="8" y="11.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#f6f3ec">G</text>
    </svg>
  );
}

const subscribeOnline = (cb: () => void) => {
  window.addEventListener('online', cb);
  window.addEventListener('offline', cb);
  return () => {
    window.removeEventListener('online', cb);
    window.removeEventListener('offline', cb);
  };
};

/**
 * Chrome-inspired browser for the portfolio's own pages: tabs, back/forward/reload/home, an address bar that
 * also searches, bookmarks and a new-tab page. Other web addresses are offered as an explicit new-tab link;
 * nothing third-party is embedded, fetched or rendered as HTML. Unreachable pages come with a game, as in Chrome.
 */
export function BrowserApp({ notes, onOpenApp }: BrowserAppProps) {
  const [state, dispatch] = useReducer(browse, INITIAL_BROWSER);
  const address = currentAddress(state);
  const { route } = resolve(address);
  const tab = activeTab(state);
  const [draft, setDraft] = useState(address);
  const [editing, setEditing] = useState(false);
  const [reloads, setReloads] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const online = useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const omniboxRef = useRef<HTMLInputElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef(new Map<number, HTMLButtonElement>());
  const moved = useRef(false);
  const base = useId();
  const panelId = `${base}-panel`;
  const menuId = `${base}-menu`;

  // Each navigation moves focus to the new page's heading (or the new tab's search box), never on first render.
  useEffect(() => {
    if (!moved.current) return;
    if (route.kind === 'home') document.getElementById(`${base}-ntp`)?.focus();
    else headingRef.current?.focus();
    // Route kind is derived from address; the address and the active tab decide when this runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, state.active, reloads]);

  /** Moves keyboard focus into the page's game, so Space starts it. */
  const focusGame = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.closest('.br-page')?.querySelector<HTMLElement>('.arc-stage')?.focus();
  };

  const go = (input: string) => {
    moved.current = true;
    setEditing(false);
    dispatch({ type: 'navigate', input });
  };

  const newTab = () => {
    moved.current = true;
    dispatch({ type: 'newTab' });
  };

  const closeTab = (id: number) => {
    moved.current = false;
    dispatch({ type: 'closeTab', id });
  };

  const switchTab = (id: number) => {
    moved.current = false;
    dispatch({ type: 'switchTab', id });
  };

  const reload = () => {
    moved.current = true;
    setReloads((n) => n + 1);
  };

  /** An in-page link: a real href for "open in new tab", internal navigation on a plain click. */
  const link = (target: string, label: React.ReactNode, href: string, className?: string) => (
    <a
      className={className}
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

  const heading = (text: React.ReactNode, className = 'br-h1') => (
    <h3 ref={headingRef} tabIndex={-1} className={className}>
      {text}
    </h3>
  );

  const external = (href: string, label: React.ReactNode, className = 'br-btn br-btn-primary') => (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );

  function siteHeader(current: 'work' | 'none' = 'none') {
    return (
      <header className="br-site-head">
        {link('ganesh://work', <><span className="br-site-mark" aria-hidden="true">G</span> {profile.name}</>, '/work/', 'br-site-brand')}
        <nav aria-label="Site">
          {link('ganesh://work', 'Work', '/work/', current === 'work' ? 'br-site-current' : undefined)}
          {link('ganesh://arcade', 'Arcade', hrefFor('ganesh://arcade'))}
          {link('ganesh://linkedin', 'Experience', hrefFor('ganesh://linkedin'))}
        </nav>
      </header>
    );
  }

  function projectCard(w: WorkItem) {
    return (
      <li key={w.slug}>
        <a
          className="br-card"
          href={`/work/${w.slug}/`}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            go(`ganesh://work/${w.slug}`);
          }}
        >
          <span className="br-card-org">{w.organization} · {w.year}</span>
          <span className="br-card-title">{w.title}</span>
          <span className="br-card-text">{w.summary}</span>
          <span className="br-card-tags">{w.stack.slice(0, 4).join(' · ')}</span>
        </a>
      </li>
    );
  }

  function unreachable(title: string, detail: React.ReactNode, code: string, extra?: React.ReactNode) {
    return (
      <div className="br-error">
        <svg className="br-error-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <path d="M8 34l10-16 7 10 5-7 10 13z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="34" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </svg>
        {heading(title, 'br-error-title')}
        <div className="br-error-detail">{detail}</div>
        <p className="br-error-code">{code}</p>
        {extra}
        <section className="br-error-game" aria-label="While you are here">
          <p>
            Stuck? Play Summit Run.{' '}
            <button type="button" className="br-btn" onClick={focusGame}>
              Play now
            </button>
          </p>
          <RunnerGame compact />
        </section>
      </div>
    );
  }

  function page() {
    switch (route.kind) {
      case 'home':
        return (
          <div className="br-ntp">
            <p className="br-ntp-logo" aria-hidden="true">
              <span>g</span>
              <span>a</span>
              <span>n</span>
              <span>e</span>
              <span>s</span>
              <span>h</span>
            </p>
            <h3 className="sr-only" ref={headingRef} tabIndex={-1}>New tab</h3>
            <form
              role="search"
              className="br-ntp-search"
              onSubmit={(e) => {
                e.preventDefault();
                const value = new FormData(e.currentTarget).get('q');
                if (typeof value === 'string' && value.trim()) go(value);
              }}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input id={`${base}-ntp`} name="q" aria-label="Search Ganesh's work or type an address" placeholder="Search Ganesh's work or type an address" autoComplete="off" maxLength={MAX_ADDRESS_LENGTH} />
            </form>
            <ul className="br-shortcuts" aria-label="Shortcuts">
              {SHORTCUTS.map((s) => (
                <li key={s.address}>
                  {link(
                    s.address,
                    <>
                      <span className="br-shortcut-icon"><Favicon route={resolve(s.address).route} /></span>
                      <span className="br-shortcut-label">{s.label}</span>
                    </>,
                    hrefFor(s.address),
                    'br-shortcut',
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'search': {
        const hits = searchPortfolio(route.query, SEARCHABLE);
        return (
          <div className="br-results">
            {heading(<>Results for <q>{route.query}</q></>, 'br-results-title')}
            <p className="br-results-count">{hits.length === 0 ? 'No matches in this portfolio.' : `${hits.length} result${hits.length === 1 ? '' : 's'} in this portfolio`}</p>
            <ol className="br-results-list">
              {hits.map((h) => (
                <li key={h.address}>
                  <span className="br-result-url"><Favicon route={resolve(h.address).route} /> {h.address}</span>
                  {link(h.address, h.title, hrefFor(h.address), 'br-result-title')}
                  <p>{h.snippet}</p>
                </li>
              ))}
            </ol>
            {hits.length === 0 && <p>Try “Gutenberg”, “React”, “payments” or “Spectra”, or browse {link('ganesh://work', 'all work', '/work/')}.</p>}
          </div>
        );
      }
      case 'work':
        return (
          <div className="br-site">
            {siteHeader('work')}
            <section className="br-hero">
              <p className="br-kicker">Selected work</p>
              {heading('Plugins and products I have built')}
              <p>WordPress, Gutenberg, React and PHP: what each project is, and what I owned.</p>
            </section>
            <ul className="br-cards">{work.map(projectCard)}</ul>
          </div>
        );
      case 'case': {
        const item = findWork(route.slug)!;
        return (
          <div className="br-site">
            {siteHeader('work')}
            <div className="br-article gw-finder-detail">
              <ProjectDetail item={item} eyebrow={`Work / ${item.organization}`} headingRef={headingRef} />
            </div>
          </div>
        );
      }
      case 'notes':
        return (
          <div className="br-site">
            {siteHeader()}
            <section className="br-hero">
              {heading('Notes')}
              {notes.length === 0 ? (
                <p>No notes are published yet. The case studies in {link('ganesh://work', 'Work', '/work/')} show how I approach problems.</p>
              ) : (
                <ul className="br-results-list">
                  {notes.map((n) => (
                    <li key={n.slug}>
                      <a className="br-result-title" href={`/notes/${n.slug}/`}>{n.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        );
      case 'arcade':
        return (
          <div className="br-site">
            {siteHeader()}
            <section className="br-hero">
              <p className="br-kicker">Arcade</p>
              {heading('Summit Run')}
              <p>An endless trail run in the Himalayas. Tap the trail, or choose Play now and press <kbd>Space</kbd>.</p>
              <p>
                <button type="button" className="br-btn" onClick={focusGame}>
                  Play now
                </button>
              </p>
            </section>
            <div className="br-arcade">
              <RunnerGame />
              <button type="button" className="br-btn br-btn-primary" onClick={() => onOpenApp('arcade')}>
                Open the Arcade for Snake and 2048
              </button>
            </div>
          </div>
        );
      case 'profile':
        return route.site === 'github' ? (
          <div className="br-gh">
            <p className="br-preview-note">Portfolio preview, not the live GitHub page</p>
            <div className="br-gh-layout">
              <aside className="br-gh-side">
                <span className="br-avatar" aria-hidden="true">G</span>
                {heading(<><span className="br-gh-name">{profile.name}</span><span className="br-gh-login">bhattaganesh</span></>, 'br-gh-title')}
                <p>{profile.summary}</p>
                {external(GITHUB_URL, <>Open on GitHub <span aria-hidden="true">↗</span></>)}
              </aside>
              <section className="br-gh-main" aria-label="Featured repository">
                <h4>Featured repository</h4>
                <div className="br-repo">
                  {link('ganesh://work/wp-agent-ai', 'wp-agent-ai', '/work/wp-agent-ai/', 'br-repo-name')}
                  <span className="br-repo-badge">Public</span>
                  <p>{findWork('wp-agent-ai')?.summary}</p>
                  <p className="br-repo-meta"><span className="br-lang-dot" aria-hidden="true" /> PHP · React · Gutenberg</p>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="br-li">
            <p className="br-preview-note">Portfolio preview, not the live LinkedIn page</p>
            <div className="br-li-card">
              <div className="br-li-banner" aria-hidden="true" />
              <span className="br-avatar br-avatar-lg" aria-hidden="true">G</span>
              {heading(profile.name, 'br-li-name')}
              <p className="br-li-headline">{profile.summary}</p>
              {external(LINKEDIN_URL, <>Open on LinkedIn <span aria-hidden="true">↗</span></>)}
            </div>
            <section className="br-li-card br-li-exp" aria-label="Experience">
              <h4>Experience</h4>
              <ol>
                {roles.map((r) => (
                  <li key={`${r.organization}-${r.start}`}>
                    <span className="br-li-logo" aria-hidden="true">{r.organization[0]}</span>
                    <span>
                      <strong>{r.title}</strong>
                      <span>{r.organization}</span>
                      <span className="br-li-dates">{roleDates(r)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        );
      case 'external': {
        const host = new URL(route.href).host;
        return unreachable(
          online ? 'This page is outside the portfolio' : 'No internet',
          online ? (
            <p>This browser only shows pages from Ganesh&apos;s portfolio. <strong>{host}</strong> can open in a real tab instead.</p>
          ) : (
            <p>You&apos;re offline. Check your connection, then open <strong>{host}</strong> in a real tab.</p>
          ),
          online ? 'ERR_OUTSIDE_PORTFOLIO' : 'ERR_INTERNET_DISCONNECTED',
          <p className="br-error-actions">{external(route.href, `Open ${host} in a new tab`)}</p>,
        );
      }
      case 'blocked':
        return unreachable(
          "This address can't be opened",
          <p>Only web addresses (https://) and this portfolio&apos;s own pages can be opened here. Nothing you type is ever run.</p>,
          'ERR_BLOCKED_SCHEME',
        );
      case 'notFound':
        return unreachable(
          "This page can't be reached",
          <p>
            <strong className="br-error-addr">{route.input}</strong> isn&apos;t part of the portfolio. Try {link(HOME, 'a new tab', '/')} or {link('ganesh://work', 'Work', '/work/')}.
          </p>,
          'ERR_NAME_NOT_RESOLVED',
        );
    }
  }

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Delete') {
      e.preventDefault();
      const remaining = state.tabs.filter((t) => t.id !== state.tabs[i].id);
      const neighbour = remaining[Math.min(i, remaining.length - 1)];
      closeTab(state.tabs[i].id);
      requestAnimationFrame(() => (neighbour ? tabRefs.current.get(neighbour.id) : tabRefs.current.values().next().value)?.focus());
      return;
    }
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = state.tabs[(i + step + state.tabs.length) % state.tabs.length];
    switchTab(next.id);
    tabRefs.current.get(next.id)?.focus();
  };

  const live = liveUrl(route);
  const secure = route.kind !== 'external' && route.kind !== 'blocked' && route.kind !== 'notFound';

  return (
    <div className="br">
      <div className="br-strip">
        <div role="tablist" aria-label="Browser tabs (Delete closes a tab)" className="br-tabs">
          {state.tabs.map((t, i) => {
            const selected = t.id === state.active;
            const tabRoute = resolve(t.entries[t.index]).route;
            const title = titleFor(tabRoute);
            return (
              <div key={t.id} role="presentation" className="br-tab" data-selected={selected || undefined}>
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
                  aria-keyshortcuts="Delete"
                  tabIndex={selected ? 0 : -1}
                  title={title}
                  onClick={() => switchTab(t.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  <Favicon route={tabRoute} />
                  <span className="br-tab-title">{title}</span>
                </button>
                <button type="button" className="br-tab-close" aria-hidden="true" tabIndex={-1} title={`Close ${title}`} onClick={() => closeTab(t.id)}>
                  <svg viewBox="0 0 10 10"><path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                </button>
              </div>
            );
          })}
        </div>
        <button type="button" className="br-icon br-new" aria-label="New tab" disabled={state.tabs.length >= MAX_TABS} onClick={newTab}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
      </div>

      <div className="br-toolbar">
        <button type="button" className="br-icon" aria-label="Back" disabled={tab.index === 0} onClick={() => { moved.current = true; dispatch({ type: 'back' }); }}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3.5M7.5 3.5L3 8l4.5 4.5" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" className="br-icon" aria-label="Forward" disabled={tab.index >= tab.entries.length - 1} onClick={() => { moved.current = true; dispatch({ type: 'forward' }); }}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 3.5L13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" className="br-icon" aria-label="Reload" onClick={reload}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v3h-3" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" className="br-icon br-home" aria-label="Home" onClick={() => go(HOME)}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 7.5L8 3l5.5 4.5M4 6.5V13h3V9.5h2V13h3V6.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" /></svg>
        </button>
        <form
          className="br-omnibox"
          data-editing={editing || undefined}
          onSubmit={(e) => {
            e.preventDefault();
            go(draft);
            omniboxRef.current?.blur();
          }}
        >
          <span className="br-omni-badge" data-secure={secure || undefined} aria-hidden="true">
            {secure ? (
              <svg viewBox="0 0 16 16"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5" fill="currentColor" /><path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
            ) : (
              <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 7v4M8 4.8v.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            )}
          </span>
          {secure && route.kind !== 'home' && !editing && <span className="br-omni-chip" aria-hidden="true">Portfolio</span>}
          <input
            ref={omniboxRef}
            aria-label="Address and search bar"
            value={editing ? draft : route.kind === 'home' ? '' : address}
            placeholder="Search Ganesh's work or type an address"
            maxLength={MAX_ADDRESS_LENGTH}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            onFocus={(e) => {
              setDraft(route.kind === 'home' ? '' : address);
              setEditing(true);
              e.currentTarget.select();
            }}
            onBlur={() => setEditing(false)}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setDraft(address);
                e.currentTarget.blur();
              }
            }}
          />
        </form>
        <div className="br-menu-wrap">
          <button
            ref={menuButtonRef}
            type="button"
            className="br-icon"
            aria-label="Browser menu"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? menuId : undefined}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="3.5" r="1.4" fill="currentColor" /><circle cx="8" cy="8" r="1.4" fill="currentColor" /><circle cx="8" cy="12.5" r="1.4" fill="currentColor" /></svg>
          </button>
          {menuOpen && (
            <PopupMenu
              id={menuId}
              label="Browser menu"
              items={[
                ...(state.tabs.length < MAX_TABS ? [{ label: 'New tab', onSelect: newTab }] : []),
                { label: 'Reload', onSelect: reload },
                { label: 'Close tab', onSelect: () => closeTab(state.active) },
                ...(live
                  ? [{ label: 'Open this page in a real tab', separatorBefore: true, onSelect: () => window.open(live, '_blank', 'noopener,noreferrer') }]
                  : []),
              ]}
              onClose={(returnFocus) => {
                setMenuOpen(false);
                if (returnFocus) menuButtonRef.current?.focus();
              }}
            />
          )}
        </div>
      </div>

      <nav className="br-bookmarks" aria-label="Bookmarks">
        <ul>
          {BOOKMARKS.map((b) => {
            const r = resolve(b.address).route;
            return (
              <li key={b.address}>
                <button type="button" aria-current={address === b.address ? 'page' : undefined} onClick={() => go(b.address)}>
                  <Favicon route={r} />
                  {b.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="br-page" role="tabpanel" id={panelId} aria-labelledby={`${base}-tab-${state.active}`} key={`${state.active}-${reloads}`}>
        {page()}
      </div>
    </div>
  );
}
