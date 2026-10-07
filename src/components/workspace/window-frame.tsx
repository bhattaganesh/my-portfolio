'use client';

import { Component, useRef, useState } from 'react';
import type { Layout, Win, WmAction } from '@/workspace/wm';
import { PopupMenu } from './popup-menu';

/** Arrow-key step for keyboard move/resize, and the larger step while Shift is held. */
const KEY_STEP = 16;
const KEY_STEP_LARGE = 64;

type KeyboardMode = 'move' | 'size' | null;

interface WindowFrameProps {
  win: Win;
  z: number;
  title: string;
  active: boolean;
  layout: Layout;
  tone: 'light' | 'dark';
  onAction: (action: WmAction, message?: string) => void;
  onActivate: () => void;
  onFocusWithin: (el: HTMLElement) => void;
  onAnnounce: (message: string) => void;
  onBackToApps: () => void;
  children: React.ReactNode;
}

/**
 * One workspace window: title bar with window controls, pointer drag and resize,
 * a window menu with keyboard move/resize, and a full-screen panel form on narrow screens.
 */
export function WindowFrame({
  win,
  z,
  title,
  active,
  layout,
  tone,
  onAction,
  onActivate,
  onFocusWithin,
  onAnnounce,
  onBackToApps,
  children,
}: WindowFrameProps) {
  const { app } = win;
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<KeyboardMode>(null);
  const drag = useRef<{ kind: 'move' | 'size'; px: number; py: number; x: number; y: number; w: number; h: number } | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const minimized = win.mode === 'minimized';
  const panel = layout === 'panels';
  const movable = !panel && win.mode === 'normal';

  const closeMenu = (returnFocus: boolean) => {
    setMenuOpen(false);
    if (returnFocus) menuButtonRef.current?.focus();
  };

  const startKeyboardMode = (next: Exclude<KeyboardMode, null>) => {
    setMode(next);
    headingRef.current?.focus();
    onAnnounce(
      `${next === 'move' ? 'Moving' : 'Resizing'} ${title}. Use the arrow keys, hold Shift for bigger steps, and press Enter when done.`,
    );
  };

  const endKeyboardMode = () => {
    if (!mode) return;
    setMode(null);
    onAnnounce(`${title} ${mode === 'move' ? 'moved' : 'resized'}.`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!mode) return;
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      endKeyboardMode();
      return;
    }
    const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!delta) return;
    e.preventDefault();
    const [dx, dy] = delta;
    onAction(
      mode === 'move'
        ? { type: 'moveBy', app, dx, dy }
        : { type: 'resizeTo', app, w: win.rect.w + dx, h: win.rect.h + dy },
    );
  };

  const startDrag = (kind: 'move' | 'size') => (e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || !movable || (kind === 'move' && (e.target as HTMLElement).closest('button'))) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { kind, px: e.clientX, py: e.clientY, ...win.rect };
  };

  const onDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.px;
    const dy = e.clientY - d.py;
    onAction(d.kind === 'move' ? { type: 'moveTo', app, x: d.x + dx, y: d.y + dy } : { type: 'resizeTo', app, w: d.w + dx, h: d.h + dy });
  };

  const endDrag = () => {
    drag.current = null;
  };

  const style: React.CSSProperties =
    panel || win.mode === 'maximized' ? { zIndex: z } : { zIndex: z, left: win.rect.x, top: win.rect.y, width: win.rect.w, height: win.rect.h };

  const minimize = () => onAction({ type: 'minimize', app }, `${title} minimized. Reopen it from the dock.`);
  const close = () => onAction({ type: 'close', app }, `${title} closed.`);
  const toggleMaximize = () => onAction({ type: 'toggleMaximize', app }, `${title} ${win.mode === 'maximized' ? 'restored' : 'maximized'}.`);

  return (
    <section
      className="gw-window"
      data-tone={tone}
      data-active={active || undefined}
      data-mode={panel ? 'panel' : win.mode}
      data-keyboard={mode ?? undefined}
      aria-labelledby={`gw-title-${app}`}
      hidden={minimized}
      inert={minimized || (panel && !active)}
      style={style}
      onPointerDownCapture={onActivate}
      onFocusCapture={(e) => {
        onFocusWithin(e.target as HTMLElement);
        onActivate();
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          endKeyboardMode();
          if (menuOpen) setMenuOpen(false);
        }
      }}
      onKeyDown={onKeyDown}
    >
      {panel ? (
        <header className="gw-panelbar">
          <button type="button" className="gw-panelbar-btn" onClick={onBackToApps}>
            <span aria-hidden="true">‹</span> Apps
          </button>
          <h2 id={`gw-title-${app}`} ref={headingRef} tabIndex={-1}>
            {title}
          </h2>
          <button type="button" className="gw-panelbar-btn" onClick={close}>
            Close
          </button>
        </header>
      ) : (
        <header
          className="gw-titlebar"
          onPointerDown={startDrag('move')}
          onPointerMove={onDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={(e) => {
            if (!(e.target as HTMLElement).closest('button')) toggleMaximize();
          }}
        >
          <div className="gw-lights">
            <button type="button" className="gw-light gw-light-close" aria-label={`Close ${title}`} title="Close" onClick={close}>
              <span aria-hidden="true">×</span>
            </button>
            <button type="button" className="gw-light gw-light-min" aria-label={`Minimize ${title}`} title="Minimize" onClick={minimize}>
              <span aria-hidden="true">−</span>
            </button>
            <button
              type="button"
              className="gw-light gw-light-max"
              aria-label={`${win.mode === 'maximized' ? 'Restore' : 'Maximize'} ${title}`}
              title={win.mode === 'maximized' ? 'Restore' : 'Maximize'}
              onClick={toggleMaximize}
            >
              <span aria-hidden="true">{win.mode === 'maximized' ? '↙' : '+'}</span>
            </button>
          </div>
          <h2 id={`gw-title-${app}`} ref={headingRef} tabIndex={-1}>
            {title}
          </h2>
          {mode && (
            <span className="gw-mode-hint" aria-hidden="true">
              {mode === 'move' ? 'Moving' : 'Resizing'} · arrows · Enter to finish
            </span>
          )}
          <div className="gw-menu-wrap">
            <button
              type="button"
              ref={menuButtonRef}
              className="gw-menu-btn"
              aria-label={`Window options for ${title}`}
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? `gw-menu-${app}` : undefined}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden="true">•••</span>
            </button>
            {menuOpen && (
              <PopupMenu
                id={`gw-menu-${app}`}
                label={`${title} window`}
                items={[
                  ...(movable
                    ? [
                        { label: 'Move with keyboard', onSelect: () => startKeyboardMode('move') },
                        { label: 'Resize with keyboard', onSelect: () => startKeyboardMode('size') },
                      ]
                    : []),
                  { label: win.mode === 'maximized' ? 'Restore size' : 'Maximize', onSelect: toggleMaximize },
                  { label: 'Minimize', onSelect: minimize },
                  { label: 'Close', onSelect: close, separatorBefore: true },
                ]}
                onClose={closeMenu}
              />
            )}
          </div>
        </header>
      )}
      <div className="gw-window-body">
        <AppBoundary title={title} onClose={close}>
          {children}
        </AppBoundary>
      </div>
      {movable && (
        <div
          className="gw-resize"
          aria-hidden="true"
          onPointerDown={startDrag('size')}
          onPointerMove={onDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
      )}
    </section>
  );
}

interface AppBoundaryProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/** Contains a crashing app inside its own window instead of taking down the workspace. */
class AppBoundary extends Component<AppBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`Workspace app "${this.props.title}" crashed`, error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="gw-app-error" role="alert">
        <p>{this.props.title} ran into a problem and stopped.</p>
        <div>
          <button type="button" onClick={() => this.setState({ failed: false })}>Try again</button>
          <button type="button" onClick={this.props.onClose}>Close {this.props.title}</button>
        </div>
      </div>
    );
  }
}
