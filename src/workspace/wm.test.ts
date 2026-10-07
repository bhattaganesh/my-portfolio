import { describe, expect, it } from 'vitest';
import {
  MIN_VISIBLE_WIDTH,
  TITLE_BAR_HEIGHT,
  initialState,
  reduce,
  topVisible,
  type AppId,
  type WindowSpec,
  type WmAction,
  type WmState,
} from './wm';

const SPEC: WindowSpec = { size: { w: 760, h: 560 }, min: { w: 360, h: 280 } };
const DESKTOP = { w: 1440, h: 800 };
const APPS: AppId[] = ['projects', 'terminal', 'journey', 'contact'];

const open = (s: WmState, app: AppId) => reduce(s, { type: 'open', app, spec: SPEC });

function assertInvariants(s: WmState) {
  const keys = Object.keys(s.windows).sort();
  expect([...s.order].sort()).toEqual(keys);
  expect(new Set(s.order).size).toBe(s.order.length);
  expect(s.focused).toBe(topVisible(s.order, s.windows));
  for (const id of s.order) {
    const { rect, min } = s.windows[id]!;
    expect(rect.w).toBeGreaterThanOrEqual(Math.min(min.w, s.area.w));
    expect(rect.h).toBeGreaterThanOrEqual(Math.min(min.h, s.area.h));
    expect(rect.w).toBeLessThanOrEqual(Math.max(min.w, s.area.w));
    expect(rect.y).toBeGreaterThanOrEqual(0);
    expect(rect.y).toBeLessThanOrEqual(Math.max(0, s.area.h - TITLE_BAR_HEIGHT));
    const visible = Math.min(MIN_VISIBLE_WIDTH, rect.w);
    expect(rect.x + rect.w).toBeGreaterThanOrEqual(visible);
    expect(rect.x).toBeLessThanOrEqual(Math.max(visible - rect.w, s.area.w - visible));
  }
}

/** Deterministic pseudo-random sequence so failures replay exactly. */
function lcg(seed: number) {
  let x = seed;
  return () => (x = (x * 48271) % 2147483647) / 2147483647;
}

function randomAction(r: () => number): WmAction {
  const app = APPS[Math.floor(r() * APPS.length)];
  const big = () => Math.round((r() - 0.5) * 4000);
  const pick = Math.floor(r() * 11);
  switch (pick) {
    case 0: return { type: 'open', app, spec: SPEC };
    case 1: return { type: 'focus', app };
    case 2: return { type: 'minimize', app };
    case 3: return { type: 'restore', app };
    case 4: return { type: 'toggleMaximize', app };
    case 5: return { type: 'close', app };
    case 6: return { type: 'moveBy', app, dx: big(), dy: big() };
    case 7: return { type: 'resizeTo', app, w: Math.abs(big()), h: Math.abs(big()) };
    case 8: return { type: 'area', w: 200 + Math.floor(r() * 1800), h: 200 + Math.floor(r() * 1000) };
    case 9: return { type: 'cycle', dir: r() < 0.5 ? 1 : -1 };
    default: return { type: 'minimizeAll' };
  }
}

describe('window manager', () => {
  it('holds every invariant over 200 random sequences of 60 actions', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const r = lcg(seed);
      let s = initialState(DESKTOP);
      for (let i = 0; i < 60; i++) {
        s = reduce(s, randomAction(r));
        assertInvariants(s);
      }
    }
  });

  it('opens on top with focus, and reopening an open app only focuses it', () => {
    let s = open(initialState(DESKTOP), 'projects');
    s = open(s, 'terminal');
    expect(s.order).toEqual(['projects', 'terminal']);
    expect(s.focused).toBe('terminal');
    const again = open(s, 'projects');
    expect(again.order).toEqual(['terminal', 'projects']);
    expect(Object.keys(again.windows)).toHaveLength(2);
  });

  it('cascades new windows so they do not cover each other exactly', () => {
    let s = open(initialState(DESKTOP), 'projects');
    s = open(s, 'terminal');
    expect(s.windows.terminal!.rect.x).toBeGreaterThan(s.windows.projects!.rect.x);
  });

  it('hands focus to the next visible window on minimize, and to nothing when none remain', () => {
    let s = open(open(initialState(DESKTOP), 'projects'), 'terminal');
    s = reduce(s, { type: 'minimize', app: 'terminal' });
    expect(s.focused).toBe('projects');
    s = reduce(s, { type: 'minimize', app: 'projects' });
    expect(s.focused).toBeNull();
  });

  it('restores a minimized window to its previous mode and brings it to the front', () => {
    let s = open(open(initialState(DESKTOP), 'projects'), 'terminal');
    s = reduce(s, { type: 'toggleMaximize', app: 'projects' });
    s = reduce(s, { type: 'minimize', app: 'projects' });
    expect(s.windows.projects!.mode).toBe('minimized');
    s = reduce(s, { type: 'restore', app: 'projects' });
    expect(s.windows.projects!.mode).toBe('maximized');
    expect(s.focused).toBe('projects');
  });

  it('keeps the normal rect through maximize and restore', () => {
    let s = open(initialState(DESKTOP), 'projects');
    s = reduce(s, { type: 'moveTo', app: 'projects', x: 300, y: 100 });
    const before = s.windows.projects!.rect;
    s = reduce(s, { type: 'toggleMaximize', app: 'projects' });
    s = reduce(s, { type: 'toggleMaximize', app: 'projects' });
    expect(s.windows.projects!.rect).toEqual(before);
  });

  it('closes a window and focuses the next one down', () => {
    let s = open(open(initialState(DESKTOP), 'projects'), 'terminal');
    s = reduce(s, { type: 'close', app: 'terminal' });
    expect(s.order).toEqual(['projects']);
    expect(s.windows.terminal).toBeUndefined();
    expect(s.focused).toBe('projects');
  });

  it('never strands a window dragged far off screen', () => {
    let s = open(initialState(DESKTOP), 'projects');
    s = reduce(s, { type: 'moveBy', app: 'projects', dx: -9999, dy: 9999 });
    const r = s.windows.projects!.rect;
    expect(r.x + r.w).toBe(MIN_VISIBLE_WIDTH);
    expect(r.y).toBe(DESKTOP.h - TITLE_BAR_HEIGHT);
  });

  it('re-clamps windows when the area shrinks and switches to panels on narrow screens', () => {
    let s = open(initialState(DESKTOP), 'projects');
    s = reduce(s, { type: 'moveTo', app: 'projects', x: 1300, y: 700 });
    s = reduce(s, { type: 'area', w: 800, h: 500 });
    expect(s.layout).toBe('desktop');
    expect(s.windows.projects!.rect.x).toBeLessThanOrEqual(800 - MIN_VISIBLE_WIDTH);
    expect(s.windows.projects!.rect.y).toBeLessThanOrEqual(500 - TITLE_BAR_HEIGHT);
    s = reduce(s, { type: 'area', w: 390, h: 700 });
    expect(s.layout).toBe('panels');
    s = reduce(s, { type: 'area', w: 1440, h: 800 });
    expect(s.layout).toBe('desktop');
  });

  it('ignores moves and resizes unless the window is in normal mode', () => {
    let s = open(initialState(DESKTOP), 'projects');
    s = reduce(s, { type: 'toggleMaximize', app: 'projects' });
    expect(reduce(s, { type: 'moveBy', app: 'projects', dx: 10, dy: 10 })).toBe(s);
    expect(reduce(s, { type: 'resizeTo', app: 'projects', w: 500, h: 400 })).toBe(s);
  });

  it('returns the identical state for actions that do not apply', () => {
    const empty = initialState(DESKTOP);
    expect(reduce(empty, { type: 'close', app: 'projects' })).toBe(empty);
    expect(reduce(empty, { type: 'cycle', dir: 1 })).toBe(empty);
    const s = open(empty, 'projects');
    expect(reduce(s, { type: 'focus', app: 'projects' })).toBe(s);
    expect(reduce(s, { type: 'restore', app: 'projects' })).toBe(s);
    expect(reduce(s, { type: 'area', w: DESKTOP.w, h: DESKTOP.h })).toBe(s);
    const min = reduce(s, { type: 'minimize', app: 'projects' });
    expect(reduce(min, { type: 'minimize', app: 'projects' })).toBe(min);
    expect(reduce(min, { type: 'focus', app: 'projects' })).toBe(min);
  });

  it('minimizeAll leaves nothing focused and remembers each mode', () => {
    let s = open(open(initialState(DESKTOP), 'projects'), 'terminal');
    s = reduce(s, { type: 'toggleMaximize', app: 'terminal' });
    s = reduce(s, { type: 'minimizeAll' });
    expect(s.focused).toBeNull();
    expect(s.windows.terminal!.restoreTo).toBe('maximized');
  });
});
