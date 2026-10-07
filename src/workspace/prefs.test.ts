import { describe, expect, it } from 'vitest';
import { DEFAULT_PREFS, PREFS_KEY, clearPrefs, loadPrefs, savePrefs, type Prefs, type PrefsStorage } from './prefs';

function memory(initial?: string): PrefsStorage & { data: Map<string, string> } {
  const data = new Map<string, string>(initial === undefined ? [] : [[PREFS_KEY, initial]]);
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

const throwing: PrefsStorage = {
  getItem: () => {
    throw new DOMException('denied', 'SecurityError');
  },
  setItem: () => {
    throw new DOMException('full', 'QuotaExceededError');
  },
  removeItem: () => {
    throw new DOMException('denied', 'SecurityError');
  },
};

const CUSTOM: Prefs = {
  theme: 'dark',
  wallpaper: 'night',
  motion: 'reduced',
  sound: true,
  windows: [{ app: 'projects', mode: 'maximized', rect: { x: 10, y: 20, w: 800, h: 500 } }],
};

describe('workspace preferences', () => {
  it('starts from defaults with sound off', () => {
    expect(loadPrefs(memory())).toEqual({ prefs: DEFAULT_PREFS, available: true });
    expect(DEFAULT_PREFS.sound).toBe(false);
  });

  it('round-trips a valid value', () => {
    const store = memory();
    expect(savePrefs(store, CUSTOM)).toBe(true);
    expect(loadPrefs(store).prefs).toEqual(CUSTOM);
  });

  it.each([
    ['corrupt JSON', '{"theme":'],
    ['a different shape', JSON.stringify({ v: 1, sound: true })],
    ['an unknown wallpaper', JSON.stringify({ ...CUSTOM, wallpaper: 'https://evil.example/x.png' })],
    ['an unknown app', JSON.stringify({ ...CUSTOM, windows: [{ ...CUSTOM.windows[0], app: 'shell' }] })],
    ['a non-finite rect', JSON.stringify({ ...CUSTOM, windows: [{ ...CUSTOM.windows[0], rect: { x: 1e9, y: 0, w: 1, h: 1 } }] })],
    ['extra keys', JSON.stringify({ ...CUSTOM, admin: true })],
  ])('falls back to defaults for %s', (_label, raw) => {
    expect(loadPrefs(memory(raw))).toEqual({ prefs: DEFAULT_PREFS, available: true });
  });

  it('keeps working in memory when storage throws', () => {
    expect(loadPrefs(throwing)).toEqual({ prefs: DEFAULT_PREFS, available: false });
    expect(savePrefs(throwing, CUSTOM)).toBe(false);
    expect(clearPrefs(throwing)).toBe(false);
  });

  it('reset removes the stored value, layout included', () => {
    const store = memory(JSON.stringify(CUSTOM));
    expect(clearPrefs(store)).toBe(true);
    expect(store.data.has(PREFS_KEY)).toBe(false);
    expect(loadPrefs(store).prefs).toEqual(DEFAULT_PREFS);
  });

  it('returns a fresh object, so callers cannot mutate the defaults', () => {
    const { prefs } = loadPrefs(memory());
    expect(prefs).not.toBe(DEFAULT_PREFS);
    expect(Object.isFrozen(DEFAULT_PREFS)).toBe(true);
  });
});
