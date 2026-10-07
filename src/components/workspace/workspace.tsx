'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import Link from 'next/link';
import { PANEL_BREAKPOINT, initialState, reduce, type AppId, type WmAction, type WmState } from '@/workspace/wm';
import { DEFAULT_PREFS, WALLPAPERS, clearPrefs, loadPrefs, savePrefs, type Prefs, type PrefsStorage } from '@/workspace/prefs';
import type { SearchResult } from '@/workspace/search';
import { createSounds, type SoundKind } from '@/workspace/sound';
import type { Effect } from '@/workspace/terminal';
import { APPS, appById } from './apps';
import { WindowFrame } from './window-frame';
import { PopupMenu, type MenuItem } from './popup-menu';
import { MissionControl } from './mission-control';
import { Spotlight } from './spotlight';
import { ProjectsApp } from './projects-app';
import { TerminalApp } from './terminal-app';
import { AboutApp } from './about-app';
import { SettingsApp } from './settings-app';
import './workspace.css';

/** Windows render in a stable DOM order (moving a focused node would blur it); stacking comes from z-index. */
const WINDOW_Z_BASE = 10;
/** Work area assumed for the server render; replaced by the measured size on mount. */
const SERVER_AREA = { w: 1440, h: 760 };
/** Delay before a changed window layout is written, so a drag is saved once rather than per frame. */
const LAYOUT_SAVE_DELAY = 400;
const WALLPAPER_NAMES: Record<Prefs['wallpaper'], string> = { dawn: 'Himalayan dawn', dusk: 'Himalayan dusk', night: 'Himalayan night' };
const APP_IDS_OPEN = APPS.map((a) => a.id);

type Overlay = 'mission' | 'spotlight' | null;
type OpenMenu = { kind: 'workspace' | 'desktop'; at: { x: number; y: number } } | { kind: 'app'; app: AppId; at: { x: number; y: number }; above: boolean } | null;

interface WorkspaceProps {
  resumeHref: string | null;
  wallpaper: React.ReactNode;
}

const isOpenable = (value: string): value is AppId => APP_IDS_OPEN.some((id) => id === value);

/** localStorage, or null where merely touching it throws (blocked site data). */
function browserStorage(): PrefsStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const soundFor = (action: WmAction, state: WmState): SoundKind | null => {
  if (action.type === 'open' && !state.windows[action.app]) return 'open';
  if (action.type === 'close') return 'close';
  if (action.type === 'minimize' || action.type === 'minimizeAll') return 'minimize';
  return null;
};

/**
 * Ganesh Workspace: a desktop-style shell with a menu bar, dock, movable windows, Mission Control,
 * Spotlight search and remembered preferences. Focus moves only in response to explicit actions.
 */
export function Workspace({ resumeHref, wallpaper }: WorkspaceProps) {
  const [state, dispatch] = useReducer(reduce, SERVER_AREA, initialState);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [menu, setMenu] = useState<OpenMenu>(null);
  const [projectSlug, setProjectSlug] = useState('spectra');
  const [terminalQueue, setTerminalQueue] = useState<{ id: number; command: string } | null>(null);
  const [announcement, setAnnouncement] = useState('');
  // Bumped on every focus request, so focusing an already-focused window still moves keyboard focus.
  const [focusTick, setFocusTick] = useState(0);
  const deskRef = useRef<HTMLElement>(null);
  const pendingFocus = useRef<AppId | null>(null);
  const lastFocused = useRef(new Map<AppId, HTMLElement>());
  const dockButtons = useRef(new Map<AppId, HTMLButtonElement>());
  const launcherTiles = useRef(new Map<AppId, HTMLButtonElement>());
  const overlayOpener = useRef<HTMLElement | null>(null);
  const menuOpener = useRef<HTMLElement | null>(null);
  const prefsRef = useRef(prefs);
  const layoutLoaded = useRef(false);
  const deepLinkHandled = useRef(false);
  const pushedPanel = useRef(false);
  const prevFocused = useRef<AppId | null>(null);
  const sounds = useRef<ReturnType<typeof createSounds> | null>(null);
  const queueId = useRef(0);

  useEffect(() => {
    const storage = browserStorage();
    const loaded = storage ? loadPrefs(storage) : { prefs: { ...DEFAULT_PREFS }, available: false };
    prefsRef.current = loaded.prefs;
    // Preferences live in the browser only, so they can be read only after hydration.
     
    setPrefs(loaded.prefs);
    setStorageAvailable(loaded.available);
    return () => sounds.current?.dispose();
  }, []);

  useEffect(() => {
    const desk = deskRef.current;
    if (!desk) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      dispatch({ type: 'area', w, h: Math.round(entry.contentRect.height) });
      // The saved desktop layout loads on the first desktop-width measurement, so starting narrow never overwrites it.
      if (!layoutLoaded.current && w >= PANEL_BREAKPOINT) {
        layoutLoaded.current = true;
        dispatch({ type: 'load', windows: prefsRef.current.windows, specs: Object.fromEntries(APPS.map((a) => [a.id, a.spec])) });
      }
      if (deepLinkHandled.current) return;
      deepLinkHandled.current = true;
      const linked = window.location.hash.slice(1);
      if (isOpenable(linked)) {
        pendingFocus.current = linked;
        dispatch({ type: 'open', app: linked, spec: appById(linked).spec });
      }
    });
    observer.observe(desk);
    return () => observer.disconnect();
  }, []);

  // Focus moves only when an explicit action queued it, so passive re-renders never steal focus.
  useEffect(() => {
    const app = pendingFocus.current;
    if (!app) return;
    pendingFocus.current = null;
    if (!state.focused) {
      (state.layout === 'panels' ? launcherTiles : dockButtons).current.get(app)?.focus();
      return;
    }
    const remembered = lastFocused.current.get(state.focused);
    const target =
      remembered?.isConnected && !remembered.closest('[hidden]') ? remembered : document.getElementById(`gw-title-${state.focused}`);
    target?.focus();
  }, [state, focusTick]);

  useEffect(() => {
    if (!layoutLoaded.current || state.layout !== 'desktop') return;
    const timer = window.setTimeout(() => {
      const windows = state.order.map((app) => {
        const win = state.windows[app]!;
        return { app, mode: win.mode, rect: win.rect, restoreTo: win.restoreTo };
      });
      persist({ ...prefsRef.current, windows });
    }, LAYOUT_SAVE_DELAY);
    return () => window.clearTimeout(timer);
    // persist only reads refs; the layout itself is the trigger.
     
  }, [state.order, state.windows, state.layout]);

  // Phones: an open panel is one history entry (#app), so the browser Back button returns to the apps.
  useEffect(() => {
    const prev = prevFocused.current;
    prevFocused.current = state.focused;
    if (state.layout !== 'panels') {
      // A panel entry pushed before switching to the desktop is left as a harmless no-op entry.
      pushedPanel.current = false;
      return;
    }
    if (prev === state.focused) return;
    const url = `${window.location.pathname}${window.location.search}`;
    if (state.focused && !prev) {
      if (window.location.hash !== `#${state.focused}`) {
        window.history.pushState(null, '', `${url}#${state.focused}`);
        pushedPanel.current = true;
      }
    } else if (state.focused) {
      window.history.replaceState(window.history.state, '', `${url}#${state.focused}`);
    } else if (pushedPanel.current) {
      pushedPanel.current = false;
      window.history.back();
    } else {
      window.history.replaceState(window.history.state, '', url);
    }
  }, [state.focused, state.layout]);

  useEffect(() => {
    const onPop = () => {
      pushedPanel.current = false;
      if (state.layout !== 'panels') return;
      const linked = window.location.hash.slice(1);
      if (!linked && state.focused) act({ type: 'minimizeAll' }, state.focused, 'Back to apps.');
      else if (isOpenable(linked) && linked !== state.focused) openApp(linked);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (overlay || e.altKey) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && !e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openOverlay('spotlight');
      } else if (e.ctrlKey && !e.metaKey && e.key === 'ArrowUp') {
        e.preventDefault();
        openOverlay('mission');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function persist(next: Prefs) {
    prefsRef.current = next;
    const storage = browserStorage();
    if (storage && !savePrefs(storage, next)) setStorageAvailable(false);
  }

  function changePrefs(patch: Partial<Prefs>) {
    const next = { ...prefsRef.current, ...patch };
    if (patch.sound === false) {
      sounds.current?.dispose();
      sounds.current = null;
    }
    setPrefs(next);
    persist(next);
  }

  function act(action: WmAction, focusApp: AppId | null, message?: string) {
    const sound = prefsRef.current.sound ? soundFor(action, state) : null;
    if (sound) (sounds.current ??= createSounds()).play(sound);
    pendingFocus.current = focusApp;
    if (focusApp) setFocusTick((t) => t + 1);
    dispatch(action);
    if (message) setAnnouncement(message);
  }

  function openApp(app: AppId) {
    const def = appById(app);
    const win = state.windows[app];
    if (win?.mode === 'minimized') act({ type: 'restore', app }, app, `${def.title} restored.`);
    else if (win) act({ type: 'focus', app }, app);
    else act({ type: 'open', app, spec: def.spec }, app, `${def.title} opened.`);
  }

  function onDockClick(app: AppId) {
    const win = state.windows[app];
    if (win && win.mode !== 'minimized' && state.focused === app) {
      act({ type: 'minimize', app }, app, `${appById(app).title} minimized.`);
    } else {
      openApp(app);
    }
  }

  function closeAll(message: string) {
    for (const app of state.order) dispatch({ type: 'close', app });
    pendingFocus.current = null;
    setAnnouncement(message);
  }

  function resetEverything() {
    const storage = browserStorage();
    if (storage) clearPrefs(storage);
    sounds.current?.dispose();
    sounds.current = null;
    const defaults = { ...DEFAULT_PREFS };
    prefsRef.current = defaults;
    setPrefs(defaults);
    for (const app of state.order) dispatch({ type: 'close', app });
    pendingFocus.current = 'settings';
    dispatch({ type: 'open', app: 'settings', spec: appById('settings').spec });
    setAnnouncement('Workspace reset to its defaults.');
  }

  /** Opens Mission Control or Spotlight; `opener` gets focus back on close (Safari does not focus clicked buttons). */
  function openOverlay(next: Exclude<Overlay, null>, opener?: HTMLElement | null) {
    overlayOpener.current = opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setMenu(null);
    setOverlay(next);
  }

  function closeOverlay(returnFocus = true) {
    setOverlay(null);
    const opener = overlayOpener.current;
    if (returnFocus) requestAnimationFrame(() => (opener?.isConnected ? opener : document.getElementById('gw-workspace-menu'))?.focus());
  }

  function chooseResult(result: SearchResult) {
    closeOverlay(false);
    if (result.kind === 'app') openApp(result.id);
    else if (result.kind === 'project') {
      setProjectSlug(result.slug);
      openApp('projects');
    } else {
      setTerminalQueue({ id: ++queueId.current, command: result.command });
      openApp('terminal');
    }
  }

  function onTerminalEffect(effect: Effect) {
    if (effect.type === 'exit') act({ type: 'close', app: 'terminal' }, 'terminal', 'Terminal closed.');
    if (effect.type === 'openApp') openApp(effect.app);
    if (effect.type === 'openProject') {
      if (effect.slug) setProjectSlug(effect.slug);
      openApp('projects');
    }
  }

  function openMenu(next: Exclude<OpenMenu, null>, opener: HTMLElement | null) {
    menuOpener.current = opener;
    setMenu(next);
  }

  function closeMenu(returnFocus: boolean) {
    setMenu(null);
    if (returnFocus) menuOpener.current?.focus();
  }

  function appMenuItems(app: AppId): MenuItem[] {
    const def = appById(app);
    const win = state.windows[app];
    if (!win) return [{ label: `Open ${def.title}`, onSelect: () => openApp(app) }];
    return [
      { label: win.mode === 'minimized' ? `Restore ${def.title}` : `Show ${def.title}`, onSelect: () => openApp(app) },
      ...(win.mode !== 'minimized'
        ? [{ label: `Minimize ${def.title}`, onSelect: () => act({ type: 'minimize', app }, app, `${def.title} minimized.`) }]
        : []),
      { label: `Close ${def.title}`, separatorBefore: true, onSelect: () => act({ type: 'close', app }, app, `${def.title} closed.`) },
    ];
  }

  const desktopItems: MenuItem[] = [
    { label: 'Mission Control', onSelect: () => openOverlay('mission', menuOpener.current) },
    { label: 'Search…', onSelect: () => openOverlay('spotlight', menuOpener.current) },
    ...WALLPAPERS.map((id, i) => ({
      label: `Wallpaper: ${WALLPAPER_NAMES[id]}`,
      checked: prefs.wallpaper === id,
      separatorBefore: i === 0,
      onSelect: () => {
        changePrefs({ wallpaper: id });
        setAnnouncement(`Wallpaper changed to ${WALLPAPER_NAMES[id]}.`);
      },
    })),
    { label: 'Settings…', separatorBefore: true, onSelect: () => openApp('settings') },
    ...(state.order.length > 0
      ? [
          { label: 'Show desktop', onSelect: () => act({ type: 'minimizeAll' }, null, 'All windows minimized.') },
          { label: 'Close all windows', onSelect: () => closeAll('All windows closed.') },
        ]
      : []),
  ];

  const workspaceItems: MenuItem[] = [
    { label: 'About Ganesh', onSelect: () => openApp('about') },
    { label: 'Settings…', onSelect: () => openApp('settings') },
    { label: 'Mission Control', separatorBefore: true, onSelect: () => openOverlay('mission', menuOpener.current) },
    { label: 'Search…', onSelect: () => openOverlay('spotlight', menuOpener.current) },
    ...(state.order.length > 0
      ? [
          { label: 'Show desktop', separatorBefore: true, onSelect: () => act({ type: 'minimizeAll' }, null, 'All windows minimized.') },
          { label: 'Close all windows', onSelect: () => closeAll('All windows closed.') },
        ]
      : []),
  ];

  const pointAt = (el: HTMLElement, above = false) => {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: above ? r.top - 6 : r.bottom + 4 };
  };

  const appContextHandlers = (app: AppId, above: boolean) => ({
    onContextMenu: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const fromKeyboard = e.clientX === 0 && e.clientY === 0;
      openMenu({ kind: 'app', app, above, at: fromKeyboard ? pointAt(e.currentTarget, above) : { x: e.clientX, y: e.clientY } }, e.currentTarget);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
        e.preventDefault();
        openMenu({ kind: 'app', app, above, at: pointAt(e.currentTarget, above) }, e.currentTarget);
      }
    },
  });

  function renderApp(id: AppId) {
    switch (id) {
      case 'projects':
        return <ProjectsApp slug={projectSlug} compact={state.layout === 'panels'} onSelect={setProjectSlug} />;
      case 'terminal':
        return <TerminalApp ctx={{ resumeHref, apps: APP_IDS_OPEN }} onEffect={onTerminalEffect} queued={terminalQueue} onQueuedRun={() => setTerminalQueue(null)} />;
      case 'about':
        return <AboutApp resumeHref={resumeHref} />;
      case 'settings':
        return <SettingsApp prefs={prefs} storageAvailable={storageAvailable} onChange={changePrefs} onReset={resetEverything} />;
      default:
        return null;
    }
  }

  const focusedTitle = state.focused ? appById(state.focused).title : 'Desktop';
  const covered = overlay !== null;

  return (
    <div className="gw" data-layout={state.layout} data-theme={prefs.theme} data-wallpaper={prefs.wallpaper} data-motion={prefs.motion}>
      {wallpaper}
      <header className="gw-menubar" inert={covered}>
        <button
          type="button"
          id="gw-workspace-menu"
          className="gw-brand"
          aria-haspopup="menu"
          aria-expanded={menu?.kind === 'workspace'}
          aria-controls={menu?.kind === 'workspace' ? 'gw-menu-workspace' : undefined}
          onClick={(e) => (menu?.kind === 'workspace' ? closeMenu(false) : openMenu({ kind: 'workspace', at: pointAt(e.currentTarget) }, e.currentTarget))}
        >
          <span className="gw-brand-mark" aria-hidden="true">G</span>
          <span className="gw-brand-label">Ganesh Workspace</span>
        </button>
        <span className="gw-menubar-app" aria-hidden="true">{focusedTitle}</span>
        <div className="gw-menubar-tools">
          <button type="button" className="gw-menubar-btn" aria-label="Search" aria-keyshortcuts="Control+K Meta+K" title="Search (Ctrl+K)" onClick={(e) => openOverlay('spotlight', e.currentTarget)}>
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            className="gw-menubar-btn"
            aria-label="Mission Control"
            aria-keyshortcuts="Control+ArrowUp"
            title="Mission Control (Ctrl+↑)"
            onClick={(e) => openOverlay('mission', e.currentTarget)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <rect x="2" y="3" width="7" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <rect x="11" y="3" width="7" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <rect x="2" y="11" width="16" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
          <Link href="/" className="gw-menubar-link" prefetch={false}>
            <span aria-hidden="true">←</span> Back to portfolio
          </Link>
        </div>
      </header>

      <main
        id="main-content"
        ref={deskRef}
        className="gw-desk"
        aria-label="Workspace desktop"
        inert={covered}
        onContextMenu={(e) => {
          if ((e.target as Element).closest('.gw-window, .gw-desktop-icons, .gw-launcher')) return;
          e.preventDefault();
          openMenu({ kind: 'desktop', at: { x: e.clientX, y: e.clientY } }, document.getElementById('gw-workspace-menu'));
        }}
      >
        <h1 className="sr-only">Ganesh Workspace</h1>

        <nav className="gw-launcher" aria-label="Apps" inert={state.layout === 'panels' && state.focused !== null}>
          <p className="gw-launcher-title">Pick an app</p>
          <p className="gw-launcher-sub">Everything here is also on the main portfolio.</p>
          <ul>
            {APPS.map((app) => (
              <li key={app.id}>
                <button
                  type="button"
                  ref={(el) => {
                    if (el) launcherTiles.current.set(app.id, el);
                  }}
                  onClick={() => openApp(app.id)}
                >
                  <span className="gw-icon">{app.icon}</span>
                  <span className="gw-launcher-name">{app.title}</span>
                  <span className="gw-launcher-desc">{app.description}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="gw-desktop-icons" aria-label="Desktop shortcuts">
          {APPS.map((app) => (
            <li key={app.id}>
              <button type="button" onClick={() => openApp(app.id)} {...appContextHandlers(app.id, false)}>
                <span className="gw-icon">{app.icon}</span>
                <span className="gw-desktop-label">{app.title}</span>
              </button>
            </li>
          ))}
        </ul>

        {APPS.map((def) => {
          const id = def.id;
          const win = state.windows[id];
          if (!win) return null;
          return (
            <WindowFrame
              key={id}
              win={win}
              z={WINDOW_Z_BASE + state.order.indexOf(id)}
              title={def.title}
              active={state.focused === id}
              layout={state.layout}
              tone={id === 'terminal' ? 'dark' : 'light'}
              onAction={(action, message) => act(action, id, message)}
              onActivate={() => {
                if (state.focused !== id) dispatch({ type: 'focus', app: id });
              }}
              onFocusWithin={(el) => lastFocused.current.set(id, el)}
              onAnnounce={setAnnouncement}
              onBackToApps={() => act({ type: 'minimizeAll' }, id, 'Back to apps.')}
            >
              {renderApp(id)}
            </WindowFrame>
          );
        })}
      </main>

      <nav className="gw-dock" aria-label="Dock" inert={covered}>
        <ul>
          {APPS.map((app) => {
            const win = state.windows[app.id];
            const status = !win ? '' : win.mode === 'minimized' ? ', minimized' : ', open';
            return (
              <li key={app.id}>
                <button
                  type="button"
                  ref={(el) => {
                    if (el) dockButtons.current.set(app.id, el);
                  }}
                  aria-label={`${app.title}${status}`}
                  onClick={() => onDockClick(app.id)}
                  {...appContextHandlers(app.id, true)}
                >
                  <span className="gw-icon">{app.icon}</span>
                  <span className="gw-dock-label" aria-hidden="true">{app.title}</span>
                  {win && <span className="gw-dock-dot" data-minimized={win.mode === 'minimized' || undefined} aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {menu && (
        <PopupMenu
          key={menu.kind === 'app' ? `app-${menu.app}` : menu.kind}
          id={menu.kind === 'workspace' ? 'gw-menu-workspace' : undefined}
          label={menu.kind === 'app' ? `${appById(menu.app).title} options` : menu.kind === 'desktop' ? 'Desktop' : 'Ganesh Workspace'}
          items={menu.kind === 'app' ? appMenuItems(menu.app) : menu.kind === 'desktop' ? desktopItems : workspaceItems}
          at={menu.at}
          above={menu.kind === 'app' && menu.above}
          onClose={closeMenu}
        />
      )}

      {overlay === 'mission' && (
        <MissionControl
          state={state}
          onChoose={(app) => {
            closeOverlay(false);
            openApp(app);
          }}
          onShowDesktop={() => {
            closeOverlay(!state.focused);
            act({ type: 'minimizeAll' }, state.focused, 'All windows minimized.');
          }}
          onClose={() => closeOverlay()}
        />
      )}
      {overlay === 'spotlight' && <Spotlight onChoose={chooseResult} onClose={() => closeOverlay()} />}

      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </div>
  );
}
