'use client';

import { useRef } from 'react';

export type Direction = 'up' | 'down' | 'left' | 'right';

/** Minimum finger travel, in CSS pixels, before a touch counts as a swipe. */
const SWIPE_THRESHOLD = 24;

const KEY_DIRECTIONS: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
};

/**
 * Maps a key to a direction.
 *
 * @param key A KeyboardEvent key.
 * @returns The direction for arrow keys and WASD, else null.
 */
export function keyDirection(key: string): Direction | null {
  return KEY_DIRECTIONS[key] ?? null;
}

/**
 * Pointer handlers that turn a swipe (touch, pen or mouse drag) into a direction.
 *
 * @param onSwipe Called with the dominant direction once the gesture passes the threshold.
 * @returns Props to spread on the swipe surface.
 */
export function useSwipe(onSwipe: (dir: Direction) => void) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  return {
    onPointerDown: (e: React.PointerEvent) => {
      start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    },
    onPointerMove: (e: React.PointerEvent) => {
      const s = start.current;
      if (!s || s.id !== e.pointerId) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;
      start.current = null;
      onSwipe(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
    },
    onPointerUp: () => {
      start.current = null;
    },
    onPointerCancel: () => {
      start.current = null;
    },
  };
}

/**
 * On-screen arrow pad for touch screens. It is a convenience: the game's own surface already takes
 * arrow keys and swipes, so the pad is hidden from assistive technology and from the tab order.
 *
 * @param props.onPress Called with the pressed direction.
 */
export function DirectionPad({ onPress }: { onPress: (dir: Direction) => void }) {
  const press = (dir: Direction) => (e: React.PointerEvent) => {
    e.preventDefault();
    onPress(dir);
  };
  return (
    <div className="arc-pad" aria-hidden="true">
      <button type="button" tabIndex={-1} className="arc-pad-up" onPointerDown={press('up')}>▲</button>
      <button type="button" tabIndex={-1} className="arc-pad-left" onPointerDown={press('left')}>◀</button>
      <button type="button" tabIndex={-1} className="arc-pad-right" onPointerDown={press('right')}>▶</button>
      <button type="button" tabIndex={-1} className="arc-pad-down" onPointerDown={press('down')}>▼</button>
    </div>
  );
}
