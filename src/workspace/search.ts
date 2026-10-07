/**
 * Spotlight search over apps, projects and terminal commands. Pure: the caller supplies the app list,
 * results are plain data, and nothing typed here is ever executed.
 */
import { work } from '@/content/work';
import { COMMANDS } from './terminal';
import type { AppId } from './wm';

/** Longest query considered; longer input is truncated before matching. */
export const MAX_QUERY_LENGTH = 80;
/** Most results shown at once. */
export const MAX_RESULTS = 8;

export interface SearchableApp {
  id: AppId;
  title: string;
  description: string;
}

export type SearchResult =
  | { kind: 'app'; id: AppId; title: string; subtitle: string }
  | { kind: 'project'; slug: string; title: string; subtitle: string }
  | { kind: 'command'; command: string; title: string; subtitle: string };

/** Commands that only make sense inside an open terminal are not offered from Spotlight. */
const TERMINAL_ONLY = new Set(['clear', 'exit']);

/** Match quality, best first; anything that does not match at all is left out. */
const RANK = { exact: 0, prefix: 1, wordPrefix: 2, contains: 3, detail: 4 } as const;

function rank(query: string, title: string, detail: string): number | null {
  const t = title.toLowerCase();
  if (t === query) return RANK.exact;
  if (t.startsWith(query)) return RANK.prefix;
  if (t.split(/[\s\-/]+/).some((word) => word.startsWith(query))) return RANK.wordPrefix;
  if (t.includes(query)) return RANK.contains;
  if (detail.toLowerCase().includes(query)) return RANK.detail;
  return null;
}

/**
 * Lists every searchable item.
 *
 * @param apps The apps the workspace can open.
 * @returns Apps, then projects, then commands.
 */
export function searchIndex(apps: readonly SearchableApp[]): SearchResult[] {
  return [
    ...apps.map((a): SearchResult => ({ kind: 'app', id: a.id, title: a.title, subtitle: a.description })),
    ...work.map((w): SearchResult => ({ kind: 'project', slug: w.slug, title: w.title, subtitle: `${w.organization} · ${w.stack.join(', ')}` })),
    ...COMMANDS.filter((c) => !TERMINAL_ONLY.has(c)).map((c): SearchResult => ({ kind: 'command', command: c, title: c, subtitle: `Run “${c}” in Terminal` })),
  ];
}

/**
 * Finds the best matches for a query.
 *
 * @param query What the visitor typed.
 * @param apps The apps the workspace can open.
 * @returns Up to MAX_RESULTS results, best match first; the apps themselves for an empty query.
 */
export function search(query: string, apps: readonly SearchableApp[]): SearchResult[] {
  const index = searchIndex(apps);
  const q = query.slice(0, MAX_QUERY_LENGTH).trim().toLowerCase();
  if (!q) return index.filter((r) => r.kind === 'app').slice(0, MAX_RESULTS);
  return index
    .map((result, order) => ({ result, order, score: rank(q, result.title, result.subtitle) }))
    .filter((r): r is { result: SearchResult; order: number; score: number } => r.score !== null)
    .sort((a, b) => a.score - b.score || a.order - b.order)
    .slice(0, MAX_RESULTS)
    .map((r) => r.result);
}
