'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Gap kept between a menu and the viewport edge when it is clamped into view. */
const EDGE_GAP = 8;

export interface MenuItem {
  label: string;
  onSelect: () => void;
  /** Set for choices in a group (rendered as a radio item); leave undefined for plain commands. */
  checked?: boolean;
  separatorBefore?: boolean;
}

interface PopupMenuProps {
  id?: string;
  label: string;
  items: readonly MenuItem[];
  /** Viewport point for context menus; omit to drop down below the trigger's wrapper. */
  at?: { x: number; y: number };
  /** Open upwards from `at`, for triggers near the bottom edge such as the dock. */
  above?: boolean;
  /** Called when the menu should close; `returnFocus` asks the opener to take focus back. */
  onClose: (returnFocus: boolean) => void;
}

/**
 * A keyboard-operable menu: arrow keys, Home and End move between items, Enter or Space selects,
 * Escape closes and returns focus to the opener, and Tab or a click outside closes it.
 */
export function PopupMenu({ id, label, items, at, above = false, onClose }: PopupMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(at);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useLayoutEffect(() => {
    if (!at || !ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    setPos({
      x: Math.max(EDGE_GAP, Math.min(at.x, window.innerWidth - width - EDGE_GAP)),
      y: Math.max(EDGE_GAP, Math.min(above ? at.y - height : at.y, window.innerHeight - height - EDGE_GAP)),
    });
  }, [at, above]);

  useEffect(() => {
    const menu = ref.current;
    const first = menu?.querySelector<HTMLElement>('[aria-checked="true"]') ?? menu?.querySelector<HTMLElement>('[role^="menuitem"]');
    first?.focus();
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Element;
      const onTrigger = id && target.closest?.(`[aria-controls="${id}"]`);
      if (!menu?.contains(target) && !onTrigger) onCloseRef.current(false);
    };
    document.addEventListener('pointerdown', onPointer, true);
    return () => document.removeEventListener('pointerdown', onPointer, true);
  }, [id]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const list = [...(ref.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? [])];
    const index = list.indexOf(document.activeElement as HTMLElement);
    const move = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: list.length - 1 }[e.key];
    if (move !== undefined) {
      e.preventDefault();
      list[(move + list.length) % list.length]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onClose(true);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      onClose(true);
    }
  };

  return (
    <div
      id={id}
      ref={ref}
      role="menu"
      aria-label={label}
      className="gw-menu"
      data-floating={at ? '' : undefined}
      style={pos ? { left: pos.x, top: pos.y } : undefined}
      onKeyDown={onKeyDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item) => (
        <div key={item.label} role="none">
          {item.separatorBefore && <div role="separator" className="gw-menu-sep" />}
          <button
            type="button"
            role={item.checked === undefined ? 'menuitem' : 'menuitemradio'}
            aria-checked={item.checked}
            tabIndex={-1}
            onClick={() => {
              onClose(true);
              item.onSelect();
            }}
          >
            <span className="gw-menu-check" aria-hidden="true">{item.checked ? '✓' : ''}</span>
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );
}
