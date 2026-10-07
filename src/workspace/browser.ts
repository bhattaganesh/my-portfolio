/**
 * Workspace Browser: address resolution and tab history. Pure: input is only ever parsed with URL and
 * matched against a fixed set of internal pages; nothing typed is fetched, executed or rendered as HTML.
 */
import { findWork } from '@/content/work';
import { SITE_CONFIG } from '@/lib/constants';

/** Scheme for the portfolio's own pages inside the Browser. */
export const SCHEME = 'ganesh://';
export const HOME = `${SCHEME}home`;
/** Longest address accepted; longer input is rejected before parsing. */
export const MAX_ADDRESS_LENGTH = 2048;
/** Most tabs open at once. */
export const MAX_TABS = 6;

export type Route =
  | { kind: 'home' }
  | { kind: 'work' }
  | { kind: 'case'; slug: string }
  | { kind: 'notes' }
  | { kind: 'shipit' }
  | { kind: 'profile'; site: 'github' | 'linkedin' }
  | { kind: 'external'; href: string }
  | { kind: 'blocked'; input: string }
  | { kind: 'notFound'; input: string };

export interface Resolved {
  /** What the address bar shows: a ganesh:// address for internal pages, else the normalised input. */
  address: string;
  route: Route;
}

const SITE_HOST = new URL(SITE_CONFIG.url).host;
const SITE_HOSTS = new Set([SITE_HOST, SITE_HOST.replace(/^www\./, '')]);

/** Internal pages by their path after the scheme (or after the site host, for portfolio URLs). */
function internal(path: string): Resolved | null {
  const clean = path.replace(/^\/+|\/+$/g, '').toLowerCase();
  const at = (address: string, route: Route): Resolved => ({ address: `${SCHEME}${address}`, route });
  if (clean === '' || clean === 'home') return at('home', { kind: 'home' });
  if (clean === 'work') return at('work', { kind: 'work' });
  if (clean === 'notes') return at('notes', { kind: 'notes' });
  if (clean === 'lab/ship-it' || clean === 'ship-it') return at('lab/ship-it', { kind: 'shipit' });
  if (clean === 'github') return at('github', { kind: 'profile', site: 'github' });
  if (clean === 'linkedin') return at('linkedin', { kind: 'profile', site: 'linkedin' });
  const match = /^work\/([a-z0-9-]+)$/.exec(clean);
  if (match && findWork(match[1])) return at(`work/${match[1]}`, { kind: 'case', slug: match[1] });
  return null;
}

/**
 * Turns whatever was typed or clicked into a page.
 *
 * @param input An address, a portfolio path, a web address, or free text.
 * @returns The page to show and the address to display for it.
 */
export function resolve(input: string): Resolved {
  const raw = input.trim();
  if (!raw) return { address: HOME, route: { kind: 'home' } };
  if (raw.length > MAX_ADDRESS_LENGTH) return { address: raw.slice(0, 80), route: { kind: 'notFound', input: raw.slice(0, 80) } };
  if (raw.toLowerCase().startsWith(SCHEME)) {
    return internal(raw.slice(SCHEME.length)) ?? { address: raw, route: { kind: 'notFound', input: raw } };
  }
  if (raw.startsWith('/') && !raw.startsWith('//')) return internal(raw.split(/[?#]/)[0]) ?? { address: raw, route: { kind: 'notFound', input: raw } };

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw);
  const looksLikeHost = !hasScheme && !/\s/.test(raw) && /^[^/]+\.[a-z]{2,}(?:[/:?#]|$)/i.test(raw);
  if (!hasScheme && !looksLikeHost) return { address: raw, route: { kind: 'notFound', input: raw } };

  let url: URL;
  try {
    url = new URL(hasScheme ? raw : `https://${raw}`);
  } catch {
    return { address: raw, route: { kind: 'notFound', input: raw } };
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return { address: raw, route: { kind: 'blocked', input: raw } };
  if (url.username || url.password) return { address: raw, route: { kind: 'blocked', input: raw } };
  if (SITE_HOSTS.has(url.host)) {
    return internal(url.pathname) ?? { address: url.href, route: { kind: 'external', href: url.href } };
  }
  url.protocol = 'https:';
  return { address: url.href, route: { kind: 'external', href: url.href } };
}

export interface Tab {
  id: number;
  entries: readonly string[];
  index: number;
}

export interface BrowserState {
  tabs: readonly Tab[];
  active: number;
  nextId: number;
}

export type BrowserAction =
  | { type: 'navigate'; input: string }
  | { type: 'back' }
  | { type: 'forward' }
  | { type: 'newTab' }
  | { type: 'closeTab'; id: number }
  | { type: 'switchTab'; id: number };

export const INITIAL_BROWSER: BrowserState = Object.freeze({ tabs: [{ id: 1, entries: [HOME], index: 0 }], active: 1, nextId: 2 });

/**
 * Returns the active tab.
 *
 * @param state Browser state.
 * @returns The tab whose id is active.
 */
export function activeTab(state: BrowserState): Tab {
  return state.tabs.find((t) => t.id === state.active) ?? state.tabs[0];
}

/**
 * The address the active tab is showing.
 *
 * @param state Browser state.
 * @returns The current history entry of the active tab.
 */
export function currentAddress(state: BrowserState): string {
  const tab = activeTab(state);
  return tab.entries[tab.index];
}

const withTab = (state: BrowserState, tab: Tab): BrowserState => ({ ...state, tabs: state.tabs.map((t) => (t.id === tab.id ? tab : t)) });

/**
 * Applies one browser action.
 *
 * @param state Current state.
 * @param action What the visitor did.
 * @returns The next state, or the same object when the action does not apply.
 */
export function browse(state: BrowserState, action: BrowserAction): BrowserState {
  const tab = activeTab(state);
  switch (action.type) {
    case 'navigate': {
      const { address } = resolve(action.input);
      if (address === tab.entries[tab.index]) return state;
      const entries = [...tab.entries.slice(0, tab.index + 1), address];
      return withTab(state, { ...tab, entries, index: entries.length - 1 });
    }
    case 'back':
      return tab.index > 0 ? withTab(state, { ...tab, index: tab.index - 1 }) : state;
    case 'forward':
      return tab.index < tab.entries.length - 1 ? withTab(state, { ...tab, index: tab.index + 1 }) : state;
    case 'newTab':
      if (state.tabs.length >= MAX_TABS) return state;
      return { tabs: [...state.tabs, { id: state.nextId, entries: [HOME], index: 0 }], active: state.nextId, nextId: state.nextId + 1 };
    case 'switchTab':
      return action.id !== state.active && state.tabs.some((t) => t.id === action.id) ? { ...state, active: action.id } : state;
    case 'closeTab': {
      const i = state.tabs.findIndex((t) => t.id === action.id);
      if (i === -1) return state;
      if (state.tabs.length === 1) return { tabs: [{ id: state.nextId, entries: [HOME], index: 0 }], active: state.nextId, nextId: state.nextId + 1 };
      const tabs = state.tabs.filter((t) => t.id !== action.id);
      const active = action.id === state.active ? tabs[Math.min(i, tabs.length - 1)].id : state.active;
      return { ...state, tabs, active };
    }
  }
}
