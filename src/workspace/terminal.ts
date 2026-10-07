/**
 * Simulated portfolio terminal. Input is only ever matched against a fixed command table and
 * answered with structured data; nothing is evaluated, executed, fetched or read from disk.
 */
import { education, profile, roleDates, roles } from '@/content/profile';
import { findWork, work } from '@/content/work';
import { skillCategories } from '@/data/skills';
import type { AppId } from './wm';

export type Line =
  | { kind: 'text'; text: string; tone?: 'muted' | 'error' }
  | { kind: 'link'; label: string; href: string }
  | { kind: 'command'; label: string; command: string }
  | { kind: 'commands'; commands: readonly string[] };

export type Effect = { type: 'clear' } | { type: 'exit' } | { type: 'openProject'; slug?: string } | { type: 'openApp'; app: AppId };

export interface Result {
  lines: Line[];
  effect?: Effect;
}

export interface Context {
  resumeHref: string | null;
  /** Apps that `open` may launch. */
  apps: readonly AppId[];
}

/** Longest input accepted; anything longer is rejected before parsing. */
export const MAX_INPUT_LENGTH = 200;
/** Number of past commands kept for arrow-key recall. */
export const HISTORY_LIMIT = 50;
/** Largest edit distance still offered as a "did you mean" suggestion. */
const SUGGESTION_DISTANCE = 2;

export const COMMANDS = ['help', 'about', 'projects', 'open', 'journey', 'skills', 'notes', 'resume', 'contact', 'clear', 'exit'] as const;
type Command = (typeof COMMANDS)[number];
const TAKES_ARGUMENT: ReadonlySet<Command> = new Set(['projects', 'open']);

const text = (value: string, tone?: 'muted' | 'error'): Line => ({ kind: 'text', text: value, tone });

const HANDLERS: Record<Command, (args: string[], ctx: Context) => Result> = {
  help: () => ({
    lines: [
      text('Commands:'),
      { kind: 'commands', commands: COMMANDS },
      text('Tip: Tab completes a command, ↑ and ↓ recall earlier ones.', 'muted'),
    ],
  }),
  about: () => ({ lines: [text(`${profile.name}: ${profile.summary}`)] }),
  projects: (args) => {
    if (args.length === 0) {
      return {
        lines: [
          ...work.map((item): Line => ({ kind: 'command', label: `${item.slug} · ${item.summary}`, command: `projects ${item.slug}` })),
          text('Open one with: projects <name>', 'muted'),
        ],
      };
    }
    const item = findWork(args[0].toLowerCase());
    if (!item || args.length > 1) {
      return { lines: [text(`No project called "${args.join(' ')}". Try: projects`, 'error')] };
    }
    return { lines: [text(`Opening ${item.title} in Projects…`, 'muted')], effect: { type: 'openProject', slug: item.slug } };
  },
  open: (args, ctx) => {
    const app = ctx.apps.find((id) => id === args[0]?.toLowerCase());
    if (args.length !== 1 || !app) {
      return { lines: [text(args.length ? `No app called "${args.join(' ')}".` : 'Open which app?', 'error'), text(`Usage: open <${ctx.apps.join(' | ')}>`, 'muted')] };
    }
    return { lines: [text(`Opening ${app}…`, 'muted')], effect: { type: 'openApp', app } };
  },
  journey: () => ({
    lines: [
      ...roles.map((r) => text(`${roleDates(r)} · ${r.title}, ${r.organization}`)),
      text(`${education.years} · ${education.title}, ${education.organization}`),
    ],
  }),
  skills: () => ({ lines: skillCategories.map((c) => text(`${c.category}: ${c.skills.map((s) => s.name).join(', ')}`)) }),
  notes: () => ({ lines: [text('No technical articles are published yet.', 'muted')] }),
  resume: (_args, ctx) =>
    ctx.resumeHref
      ? { lines: [{ kind: 'link', label: 'Download my résumé (PDF)', href: ctx.resumeHref }] }
      : { lines: [text("My résumé isn't published yet. Email me and I'll send it:"), { kind: 'link', label: profile.email, href: `mailto:${profile.email}` }] },
  contact: () => ({
    lines: [
      { kind: 'link', label: profile.email, href: `mailto:${profile.email}` },
      ...profile.links.map((l): Line => ({ kind: 'link', label: l.label, href: l.href })),
    ],
  }),
  clear: () => ({ lines: [], effect: { type: 'clear' } }),
  exit: () => ({ lines: [], effect: { type: 'exit' } }),
};

const isCommand = (value: string): value is Command => (COMMANDS as readonly string[]).includes(value);

/**
 * Computes the Levenshtein edit distance between two strings.
 *
 * @param a First string.
 * @param b Second string.
 * @returns The minimum number of single-character edits turning a into b.
 */
export function editDistance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[b.length];
}

/**
 * Runs one line of input against the command table.
 *
 * @param input Raw text typed or clicked by the visitor.
 * @param ctx Build-time facts the commands may report, such as résumé availability.
 * @returns Lines to print and an optional effect for the workspace to apply.
 */
export function run(input: string, ctx: Context): Result {
  if (input.length > MAX_INPUT_LENGTH) return { lines: [text(`That's longer than ${MAX_INPUT_LENGTH} characters. Try help.`, 'error')] };
  const [head = '', ...args] = input.trim().split(/\s+/).filter(Boolean);
  if (!head) return { lines: [] };
  const name = head.toLowerCase();
  if (isCommand(name)) {
    if (args.length > 0 && !TAKES_ARGUMENT.has(name)) return { lines: [text(`"${name}" doesn't take arguments. Try: ${name}`, 'error')] };
    return HANDLERS[name](args, ctx);
  }
  const close = COMMANDS.map((c) => ({ c, d: editDistance(name, c) })).sort((x, y) => x.d - y.d)[0];
  const lines: Line[] = [text(`"${head}" isn't a command here. This terminal only knows portfolio commands.`, 'error')];
  lines.push(close.d <= SUGGESTION_DISTANCE ? { kind: 'command', label: `Did you mean ${close.c}?`, command: close.c } : { kind: 'command', label: 'Try help', command: 'help' });
  return { lines };
}

/** Outcome of a Tab press: `changed` is false whenever the input would stay the same. */
export interface Completion {
  value: string;
  changed: boolean;
  candidates: string[];
}

const commonPrefix = (values: string[]) =>
  values.reduce((prefix, v) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === v[i]) i++;
    return prefix.slice(0, i);
  });

/**
 * Lists what the token under the cursor could become.
 *
 * @param input Current input value.
 * @param apps App names `open` accepts.
 * @returns Matching commands, project names after "projects ", or app names after "open ".
 */
export function candidates(input: string, apps: readonly string[] = []): string[] {
  const lower = input.toLowerCase().trimStart();
  const parts = lower.split(/\s+/);
  if (parts.length === 1) return parts[0] ? COMMANDS.filter((c) => c.startsWith(parts[0])) : [];
  if (parts.length === 2 && parts[0] === 'projects') return work.map((w) => w.slug).filter((s) => s.startsWith(parts[1]));
  if (parts.length === 2 && parts[0] === 'open') return apps.filter((a) => a.startsWith(parts[1]));
  return [];
}

/**
 * Completes the input on Tab. Callers must let Tab move focus whenever `changed` is false.
 *
 * @param input Current input value.
 * @param apps App names `open` accepts.
 * @returns The completed value, whether it changed, and the candidates considered.
 */
export function complete(input: string, apps: readonly string[] = []): Completion {
  const options = candidates(input, apps);
  const unchanged = { value: input, changed: false, candidates: options };
  if (options.length === 0) return unchanged;
  const lower = input.toLowerCase().trimStart();
  const parts = lower.split(/\s+/);
  const token = parts[parts.length - 1];
  let replacement = options.length === 1 ? options[0] : commonPrefix(options);
  if (options.length === 1 && parts.length === 1 && TAKES_ARGUMENT.has(replacement as Command)) replacement += ' ';
  if (replacement === token) return unchanged;
  const value = [...parts.slice(0, -1), replacement].join(' ');
  return value === input ? unchanged : { value, changed: true, candidates: options };
}

/**
 * Adds an entry to command history, skipping blanks and immediate repeats.
 *
 * @param history Earlier commands, oldest first.
 * @param entry The command just run.
 * @returns A new history capped at HISTORY_LIMIT entries.
 */
export function pushHistory(history: readonly string[], entry: string): string[] {
  const trimmed = entry.trim();
  if (!trimmed || history[history.length - 1] === trimmed) return [...history];
  return [...history, trimmed].slice(-HISTORY_LIMIT);
}
