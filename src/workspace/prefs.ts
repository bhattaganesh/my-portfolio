/**
 * Workspace preferences kept in the visitor's own browser. Everything stored is re-validated on load,
 * so corrupt, outdated or tampered values fall back to defaults instead of breaking the desktop.
 */
import { z } from 'zod';
import { APP_IDS } from './wm';

/** localStorage key; bump the version suffix whenever the shape changes incompatibly. */
export const PREFS_KEY = 'gw.prefs.v2';
/** Largest coordinate accepted from storage; real layouts are far smaller. */
const MAX_COORD = 20_000;

export const THEMES = ['system', 'light', 'dark'] as const;
export const WALLPAPERS = ['dawn', 'dusk', 'night'] as const;
export const MOTIONS = ['system', 'reduced'] as const;

export type Theme = (typeof THEMES)[number];
export type WallpaperId = (typeof WALLPAPERS)[number];
export type Motion = (typeof MOTIONS)[number];

const coord = z.number().finite().min(-MAX_COORD).max(MAX_COORD);

const savedWindowSchema = z
  .object({
    app: z.enum(APP_IDS),
    mode: z.enum(['normal', 'maximized', 'minimized']),
    rect: z.object({ x: coord, y: coord, w: coord.min(0), h: coord.min(0) }).strict(),
  })
  .strict();

const prefsSchema = z
  .object({
    theme: z.enum(THEMES),
    wallpaper: z.enum(WALLPAPERS),
    motion: z.enum(MOTIONS),
    sound: z.boolean(),
    windows: z.array(savedWindowSchema).max(APP_IDS.length),
  })
  .strict();

export type Prefs = z.infer<typeof prefsSchema>;

export const DEFAULT_PREFS: Readonly<Prefs> = Object.freeze({
  theme: 'system',
  wallpaper: 'dawn',
  motion: 'system',
  sound: false,
  windows: [],
});

/** The subset of the Web Storage API the preferences need, so tests can pass a fake. */
export type PrefsStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface LoadedPrefs {
  prefs: Prefs;
  /** False when the browser refuses storage (private mode, blocked site data); changes then last for this visit only. */
  available: boolean;
}

/**
 * Reads preferences, falling back to defaults for anything missing, corrupt or from another version.
 *
 * @param storage Where preferences live, usually window.localStorage.
 * @returns The validated preferences and whether storage can be used at all.
 */
export function loadPrefs(storage: PrefsStorage): LoadedPrefs {
  let raw: string | null;
  try {
    raw = storage.getItem(PREFS_KEY);
  } catch {
    return { prefs: { ...DEFAULT_PREFS }, available: false };
  }
  if (raw === null) return { prefs: { ...DEFAULT_PREFS }, available: true };
  try {
    const parsed = prefsSchema.safeParse(JSON.parse(raw));
    return { prefs: parsed.success ? parsed.data : { ...DEFAULT_PREFS }, available: true };
  } catch {
    return { prefs: { ...DEFAULT_PREFS }, available: true };
  }
}

/**
 * Saves preferences.
 *
 * @param storage Where preferences live.
 * @param prefs The preferences to store.
 * @returns False when the browser refused the write.
 */
export function savePrefs(storage: PrefsStorage, prefs: Prefs): boolean {
  try {
    storage.setItem(PREFS_KEY, JSON.stringify(prefs));
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes every stored preference, including the remembered window layout.
 *
 * @param storage Where preferences live.
 * @returns False when the browser refused the removal.
 */
export function clearPrefs(storage: PrefsStorage): boolean {
  try {
    storage.removeItem(PREFS_KEY);
    return true;
  } catch {
    return false;
  }
}
