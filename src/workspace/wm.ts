/**
 * Pure window-manager state for Ganesh Workspace. No React, DOM, timers or randomness:
 * every action returns either a new state or the identical state object when it does not apply.
 */

/** Every app the workspace knows; one window per app. */
export const APP_IDS = ['projects', 'terminal', 'about', 'settings', 'arcade', 'browser', 'lab'] as const;
export type AppId = (typeof APP_IDS)[number];
export type Mode = 'normal' | 'maximized' | 'minimized';
export type Layout = 'desktop' | 'panels';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Size {
  w: number;
  h: number;
}

/** Default and minimum window size for an app. */
export interface WindowSpec {
  size: Size;
  min: Size;
}

export interface Win {
  app: AppId;
  mode: Mode;
  rect: Rect;
  restoreTo: 'normal' | 'maximized';
  min: Size;
}

export interface WmState {
  windows: Partial<Record<AppId, Win>>;
  order: AppId[];
  focused: AppId | null;
  area: Size;
  layout: Layout;
}

export type WmAction =
  | { type: 'open'; app: AppId; spec: WindowSpec }
  | { type: 'focus'; app: AppId }
  | { type: 'minimize'; app: AppId }
  | { type: 'minimizeAll' }
  | { type: 'restore'; app: AppId }
  | { type: 'toggleMaximize'; app: AppId }
  | { type: 'close'; app: AppId }
  | { type: 'moveBy'; app: AppId; dx: number; dy: number }
  | { type: 'moveTo'; app: AppId; x: number; y: number }
  | { type: 'resizeTo'; app: AppId; w: number; h: number }
  | { type: 'area'; w: number; h: number }
  | { type: 'cycle'; dir: 1 | -1 }
  | { type: 'load'; windows: readonly SavedWindow[]; specs: Partial<Record<AppId, WindowSpec>> };

/** A window as remembered between visits; `load` validates and clamps it against the current area. */
export interface SavedWindow {
  app: AppId;
  mode: Mode;
  rect: Rect;
  /** What a minimized window restores to; older saves without it restore to normal. */
  restoreTo?: Win['restoreTo'];
}

/** Height of a window title bar; it must always stay inside the work area. */
export const TITLE_BAR_HEIGHT = 44;
/** Horizontal part of a title bar that must remain visible so a window can be grabbed back. */
export const MIN_VISIBLE_WIDTH = 96;
/** Below this work-area width, apps open as full-screen panels instead of windows. */
export const PANEL_BREAKPOINT = 768;
/** Offset between successively opened windows so they do not stack exactly. */
const CASCADE_STEP = 32;
const CASCADE_ORIGIN = { x: 120, y: 24 };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

const layoutFor = (area: Size): Layout => (area.w < PANEL_BREAKPOINT ? 'panels' : 'desktop');

/**
 * Clamps a rectangle so it respects its minimum size and keeps its title bar reachable.
 *
 * @param rect The requested rectangle.
 * @param min The window's minimum size.
 * @param area The available work area.
 * @returns A rectangle whose title bar lies inside the area vertically and is at least partly visible horizontally.
 */
export function clampRect(rect: Rect, min: Size, area: Size): Rect {
  const w = clamp(rect.w, Math.min(min.w, area.w), area.w);
  const h = clamp(rect.h, Math.min(min.h, area.h), area.h);
  const visible = Math.min(MIN_VISIBLE_WIDTH, w);
  const x = clamp(rect.x, visible - w, area.w - visible);
  const y = clamp(rect.y, 0, area.h - TITLE_BAR_HEIGHT);
  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}

const sameRect = (a: Rect, b: Rect) => a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;

/**
 * Returns the topmost window that is not minimized.
 *
 * @param order The z-order, last entry on top.
 * @param windows The open windows.
 * @returns The app id, or null when every window is minimized or none is open.
 */
export function topVisible(order: AppId[], windows: WmState['windows']): AppId | null {
  for (let i = order.length - 1; i >= 0; i--) {
    if (windows[order[i]]?.mode !== 'minimized') return order[i];
  }
  return null;
}

/**
 * Creates an empty workspace for a given work area.
 *
 * @param area The space available for windows (viewport minus top bar and dock).
 * @returns A state with no open windows.
 */
export function initialState(area: Size): WmState {
  return { windows: {}, order: [], focused: null, area, layout: layoutFor(area) };
}

function raise(state: WmState, app: AppId, windows = state.windows): WmState {
  const order = [...state.order.filter((id) => id !== app), app];
  return { ...state, windows, order, focused: topVisible(order, windows) };
}

function withWindow(state: WmState, app: AppId, win: Win): WmState['windows'] {
  return { ...state.windows, [app]: win };
}

/**
 * Applies one window-manager action.
 *
 * @param state The current state.
 * @param action The action to apply.
 * @returns The next state, or the same object when the action has no effect.
 */
export function reduce(state: WmState, action: WmAction): WmState {
  if (action.type === 'area') {
    const area = { w: Math.max(0, action.w), h: Math.max(0, action.h) };
    if (area.w === state.area.w && area.h === state.area.h) return state;
    const windows: WmState['windows'] = {};
    for (const id of state.order) {
      const win = state.windows[id]!;
      windows[id] = { ...win, rect: clampRect(win.rect, win.min, area) };
    }
    return { ...state, area, windows, layout: layoutFor(area) };
  }

  if (action.type === 'minimizeAll') {
    if (state.order.every((id) => state.windows[id]!.mode === 'minimized')) return state;
    const windows: WmState['windows'] = {};
    for (const id of state.order) {
      const win = state.windows[id]!;
      windows[id] = win.mode === 'minimized' ? win : { ...win, mode: 'minimized', restoreTo: win.mode };
    }
    return { ...state, windows, focused: null };
  }

  if (action.type === 'load') {
    if (state.order.length > 0) return state;
    const windows: WmState['windows'] = {};
    const order: AppId[] = [];
    for (const saved of action.windows) {
      const spec = action.specs[saved.app];
      if (!spec || windows[saved.app]) continue;
      const restoreTo = saved.mode === 'maximized' ? 'maximized' : saved.mode === 'minimized' ? (saved.restoreTo ?? 'normal') : 'normal';
      windows[saved.app] = { app: saved.app, mode: saved.mode, rect: clampRect(saved.rect, spec.min, state.area), restoreTo, min: spec.min };
      order.push(saved.app);
    }
    if (order.length === 0) return state;
    return { ...state, windows, order, focused: topVisible(order, windows) };
  }

  if (action.type === 'cycle') {
    const visible = state.order.filter((id) => state.windows[id]!.mode !== 'minimized');
    if (visible.length < 2) return state;
    if (action.dir === 1) return raise(state, visible[0]);
    const top = visible[visible.length - 1];
    const order = [top, ...state.order.filter((id) => id !== top)];
    return { ...state, order, focused: topVisible(order, state.windows) };
  }

  const win = state.windows[action.app];

  if (action.type === 'open') {
    if (win) return win.mode === 'minimized' ? reduce(state, { type: 'restore', app: action.app }) : reduce(state, { type: 'focus', app: action.app });
    const step = state.order.length * CASCADE_STEP;
    const rect = clampRect(
      { x: CASCADE_ORIGIN.x + step, y: CASCADE_ORIGIN.y + step, ...action.spec.size },
      action.spec.min,
      state.area,
    );
    const created: Win = { app: action.app, mode: 'normal', rect, restoreTo: 'normal', min: action.spec.min };
    return raise(state, action.app, withWindow(state, action.app, created));
  }

  if (!win) return state;

  switch (action.type) {
    case 'focus':
      if (win.mode === 'minimized' || state.focused === action.app) return state;
      return raise(state, action.app);
    case 'minimize': {
      if (win.mode === 'minimized') return state;
      const windows = withWindow(state, action.app, { ...win, mode: 'minimized', restoreTo: win.mode });
      return { ...state, windows, focused: topVisible(state.order, windows) };
    }
    case 'restore':
      if (win.mode === 'normal') return state.focused === action.app ? state : raise(state, action.app);
      return raise(state, action.app, withWindow(state, action.app, { ...win, mode: win.mode === 'minimized' ? win.restoreTo : 'normal' }));
    case 'toggleMaximize':
      if (win.mode === 'minimized') return state;
      return raise(state, action.app, withWindow(state, action.app, { ...win, mode: win.mode === 'maximized' ? 'normal' : 'maximized' }));
    case 'close': {
      const { [action.app]: _closed, ...windows } = state.windows;
      void _closed;
      const order = state.order.filter((id) => id !== action.app);
      return { ...state, windows, order, focused: topVisible(order, windows) };
    }
    case 'moveBy':
    case 'moveTo':
    case 'resizeTo': {
      if (win.mode !== 'normal') return state;
      const requested =
        action.type === 'moveBy'
          ? { ...win.rect, x: win.rect.x + action.dx, y: win.rect.y + action.dy }
          : action.type === 'moveTo'
            ? { ...win.rect, x: action.x, y: action.y }
            : { ...win.rect, w: action.w, h: action.h };
      const rect = clampRect(requested, win.min, state.area);
      if (sameRect(rect, win.rect)) return state;
      return { ...state, windows: withWindow(state, action.app, { ...win, rect }) };
    }
  }
}
