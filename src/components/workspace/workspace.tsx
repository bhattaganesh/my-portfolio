'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import Link from 'next/link';
import { initialState, reduce, type AppId, type WmAction } from '@/workspace/wm';
import type { Effect } from '@/workspace/terminal';
import { APPS, appById } from './apps';
import { WindowFrame } from './window-frame';
import { ProjectsApp } from './projects-app';
import { TerminalApp } from './terminal-app';
import './workspace.css';

/** Windows render in a stable DOM order (moving a focused node would blur it); stacking comes from z-index. */
const WINDOW_Z_BASE = 10;
/** Work area assumed for the server render; replaced by the measured size on mount. */
const SERVER_AREA = { w: 1440, h: 760 };

interface WorkspaceProps {
  resumeHref: string | null;
  wallpaper: React.ReactNode;
}

/**
 * Ganesh Workspace: a desktop-style shell with a menu bar, dock and movable windows.
 * Focus moves only in response to explicit window actions, never on passive re-renders.
 */
export function Workspace({ resumeHref, wallpaper }: WorkspaceProps) {
  const [state, dispatch] = useReducer(reduce, SERVER_AREA, initialState);
  const [projectSlug, setProjectSlug] = useState('spectra');
  const [announcement, setAnnouncement] = useState('');
  const deskRef = useRef<HTMLElement>(null);
  const pendingFocus = useRef<AppId | null>(null);
  const lastFocused = useRef(new Map<AppId, HTMLElement>());
  const dockButtons = useRef(new Map<AppId, HTMLButtonElement>());
  const launcherTiles = useRef(new Map<AppId, HTMLButtonElement>());

  useEffect(() => {
    const desk = deskRef.current;
    if (!desk) return;
    const observer = new ResizeObserver(([entry]) => {
      dispatch({ type: 'area', w: Math.round(entry.contentRect.width), h: Math.round(entry.contentRect.height) });
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
  }, [state]);

  function act(action: WmAction, focusApp: AppId | null, message?: string) {
    pendingFocus.current = focusApp;
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

  function onTerminalEffect(effect: Effect) {
    if (effect.type === 'exit') act({ type: 'close', app: 'terminal' }, 'terminal', 'Terminal closed.');
    if (effect.type === 'openProject') {
      if (effect.slug) setProjectSlug(effect.slug);
      openApp('projects');
    }
  }

  const focusedTitle = state.focused ? appById(state.focused).title : 'Desktop';

  return (
    <div className="gw" data-layout={state.layout}>
      {wallpaper}
      <header className="gw-menubar">
        <span className="gw-brand">
          <span className="gw-brand-mark" aria-hidden="true">G</span>
          Ganesh Workspace
        </span>
        <span className="gw-menubar-app" aria-hidden="true">{focusedTitle}</span>
        <Link href="/" className="gw-menubar-link" prefetch={false}>
          <span aria-hidden="true">←</span> Back to portfolio
        </Link>
      </header>

      <main id="main-content" ref={deskRef} className="gw-desk" aria-label="Workspace desktop">
        <h1 className="sr-only">Ganesh Workspace</h1>

        <nav className="gw-launcher" aria-label="Apps">
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
              <button type="button" onClick={() => openApp(app.id)}>
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
              {id === 'projects' ? (
                <ProjectsApp slug={projectSlug} compact={state.layout === 'panels'} onSelect={setProjectSlug} />
              ) : (
                <TerminalApp ctx={{ resumeHref }} onEffect={onTerminalEffect} />
              )}
            </WindowFrame>
          );
        })}
      </main>

      <nav className="gw-dock" aria-label="Dock">
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

      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </div>
  );
}
