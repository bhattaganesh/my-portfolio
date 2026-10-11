'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { freshSeed } from '@/arcade/rng';
import { arcadeStorage, loadBests, recordScore } from '@/arcade/scores';
import { initialSnake, snake, snakeInterval, type SnakeAction, type SnakePhase, type SnakeState } from '@/arcade/snake';
import { DirectionPad, keyDirection, useSwipe } from './controls';
import './arcade.css';

/** Canvas resolution per grid cell, before device-pixel scaling. */
const CELL = 24;

function paint(ctx: CanvasRenderingContext2D, s: SnakeState, el: HTMLElement) {
  const css = getComputedStyle(el);
  const v = (name: string) => css.getPropertyValue(name).trim();
  const size = s.size * CELL;
  ctx.fillStyle = v('--arc-sky');
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = v('--arc-grid');
  for (let y = 0; y < s.size; y++) for (let x = (y % 2); x < s.size; x += 2) ctx.fillRect(x * CELL, y * CELL, CELL, CELL);

  if (s.food) {
    ctx.fillStyle = v('--arc-accent');
    ctx.beginPath();
    ctx.arc(s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2, CELL * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = v('--arc-leaf');
    ctx.fillRect(s.food.x * CELL + CELL / 2, s.food.y * CELL + 3, 3, 5);
  }

  const ink = v('--arc-snake');
  s.body.forEach((c, i) => {
    ctx.fillStyle = ink;
    ctx.globalAlpha = i === 0 ? 1 : Math.max(0.55, 1 - i * 0.02);
    const inset = i === 0 ? 1 : 2;
    ctx.beginPath();
    ctx.roundRect(c.x * CELL + inset, c.y * CELL + inset, CELL - inset * 2, CELL - inset * 2, i === 0 ? 7 : 5);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  const head = s.body[0];
  const eye = { up: [[7, 7], [15, 7]], down: [[7, 15], [15, 15]], left: [[7, 7], [7, 15]], right: [[15, 7], [15, 15]] }[s.dir];
  ctx.fillStyle = v('--arc-sky');
  for (const [ex, ey] of eye) ctx.fillRect(head.x * CELL + ex, head.y * CELL + ey, 3, 3);
}

/**
 * Snake: eat to grow, don't hit the walls or yourself. Arrow keys or WASD steer; on touch screens,
 * swipe on the board or use the arrow pad. The snake waits until the first move.
 */
export function SnakeGame({ autoFocus = false }: { autoFocus?: boolean }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<SnakeState>(initialSnake(0));
  const [phase, setPhase] = useState<SnakePhase>('ready');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  const act = useCallback((action: SnakeAction) => {
    const before = game.current;
    const next = snake(before, action);
    if (next === before) return;
    game.current = next;
    if (next.score !== before.score) setScore(next.score);
    if (next.phase !== before.phase) {
      setPhase(next.phase);
      if (next.phase === 'over' || next.phase === 'won') {
        const storage = arcadeStorage();
        const bests = recordScore(storage, loadBests(storage), 'snake', next.score);
        setBest(bests.snake);
        setAnnouncement(`${next.phase === 'won' ? 'You filled the board!' : 'Game over.'} Score ${next.score}. Best ${bests.snake}.`);
      } else if (next.phase === 'running') {
        setAnnouncement('Started.');
      }
    }
  }, []);

  const steer = useCallback(
    (dir: 'up' | 'down' | 'left' | 'right') => {
      const p = game.current.phase;
      if (p === 'over' || p === 'won') return;
      act({ type: 'turn', dir });
    },
    [act],
  );

  const restart = () => {
    act({ type: 'restart', seed: freshSeed() });
    setScore(0);
    boardRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    game.current = initialSnake(freshSeed());
    // Best scores live in the browser, so they can only be read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBest(loadBests(arcadeStorage()).snake);
    if (autoFocus) boardRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const size = game.current.size * CELL;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    let raf = 0;
    let last: number | null = null;
    let carry = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden || canvas.offsetParent === null) {
        last = null;
        return;
      }
      if (last !== null && game.current.phase === 'running') {
        carry += now - last;
        const interval = snakeInterval(game.current.score);
        // A long pause (another tab) never fires a burst of moves at once.
        if (carry > interval * 3) carry = interval;
        while (carry >= interval) {
          carry -= interval;
          act({ type: 'tick' });
        }
      }
      last = now;
      paint(ctx, game.current, canvas);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [act]);

  const swipe = useSwipe(steer);

  return (
    <div className="arc-snake">
      <div className="arc-scorebar" aria-hidden="true">
        <span>Score <strong>{score}</strong></span>
        <span>Best <strong>{Math.max(best, score)}</strong></span>
      </div>
      <div
        ref={boardRef}
        className="arc-stage arc-board"
        tabIndex={0}
        role="application"
        aria-roledescription="game"
        aria-label={`Snake. Arrow keys or W A S D steer. Score ${score}.`}
        onKeyDown={(e) => {
          const dir = keyDirection(e.key);
          if (dir) {
            e.preventDefault();
            steer(dir);
          } else if ((e.key === 'Enter' || e.key === ' ') && (phase === 'over' || phase === 'won')) {
            e.preventDefault();
            restart();
          }
        }}
        {...swipe}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
        {phase === 'ready' && (
          <p className="arc-overlay" aria-hidden="true">
            <span className="arc-kbd-only">
              Press an <span className="arc-key">arrow</span> or{' '}
            </span>
            swipe to start
          </p>
        )}
        {(phase === 'over' || phase === 'won') && (
          <div className="arc-overlay arc-over">
            <p className="arc-over-title">{phase === 'won' ? 'Board cleared!' : 'Game over'}</p>
            <p>Score {score}</p>
            <button type="button" className="arc-btn" onClick={restart}>
              <span aria-hidden="true">↻</span> Play again
            </button>
          </div>
        )}
      </div>
      <DirectionPad onPress={steer} />
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </div>
  );
}
