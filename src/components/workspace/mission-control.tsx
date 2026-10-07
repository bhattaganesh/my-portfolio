'use client';

import { useEffect, useRef } from 'react';
import type { AppId, WmState } from '@/workspace/wm';
import { APPS, appById } from './apps';

interface MissionControlProps {
  state: WmState;
  onChoose: (app: AppId) => void;
  onShowDesktop: () => void;
  onClose: () => void;
}

/**
 * Overview of every open window, minimized ones included, as a grid of cards.
 * Arrow keys move between cards, Enter switches to one, Escape closes and returns focus.
 */
export function MissionControl({ state, onChoose, onShowDesktop, onClose }: MissionControlProps) {
  const ref = useRef<HTMLDivElement>(null);
  const open = [...state.order].reverse();

  useEffect(() => {
    const current = state.focused ? ref.current?.querySelector<HTMLElement>(`[data-app="${state.focused}"]`) : null;
    (current ?? ref.current?.querySelector<HTMLElement>('.gw-mc-card'))?.focus();
    // Focus once on open; later state changes come from this overlay's own actions, which close it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    const cards = [...(ref.current?.querySelectorAll<HTMLElement>('.gw-mc-card') ?? [])];
    const i = cards.indexOf(document.activeElement as HTMLElement);
    if (i === -1) return;
    e.preventDefault();
    cards[(i + step + cards.length) % cards.length].focus();
  };

  return (
    <div
      ref={ref}
      className="gw-overlay gw-mc"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gw-mc-title"
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="gw-mc-head">
        <h2 id="gw-mc-title">Mission Control</h2>
        <p>{open.length === 0 ? 'No windows are open. Pick an app to start.' : 'Choose a window to switch to it.'}</p>
      </div>
      <ul className="gw-mc-grid">
        {(open.length ? open : APPS.map((a) => a.id)).map((id) => {
          const def = appById(id);
          const win = state.windows[id];
          const status = !win ? 'Not open' : win.mode === 'minimized' ? 'Minimized' : state.focused === id ? 'Active' : 'Open';
          return (
            <li key={id}>
              <button type="button" className="gw-mc-card" data-app={id} data-active={state.focused === id || undefined} onClick={() => onChoose(id)}>
                <span className="gw-mc-thumb" aria-hidden="true">
                  <span className="gw-mc-bar">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="gw-icon">{def.icon}</span>
                </span>
                <span className="gw-mc-name">{def.title}</span>
                <span className="gw-mc-status">{status}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="gw-mc-actions">
        {open.length > 0 && (
          <button type="button" className="gw-btn" onClick={onShowDesktop}>
            Show desktop
          </button>
        )}
        <button type="button" className="gw-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
