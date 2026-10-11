'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { freshSeed } from '@/arcade/rng';
import {
  BIRD_FROM_SCORE,
  PIXEL,
  PLAYER_X,
  WORLD_WIDTH,
  initialRunner,
  runner,
  runnerScore,
  type RunnerAction,
  type RunnerPhase,
  type RunnerState,
} from '@/arcade/runner';
import { arcadeStorage, loadBests, recordScore } from '@/arcade/scores';
import { BIRD_DOWN, BIRD_UP, CLOUD, TREKKER_A, TREKKER_B, TREKKER_DUCK, TREKKER_HIT, drawSprite, rockSprite, type Sprite } from './sprites';
import './arcade.css';

/** Canvas height in world pixels, and where the ground line sits. */
const WORLD_HEIGHT = 170;
const GROUND = 150;
/** Points per day; the sky turns to night for the second half of each cycle. */
const DAY_LENGTH = 700;
const RUN_FRAME_SECONDS = 0.1;
const STARS = Array.from({ length: 26 }, (_, i) => ({ x: (i * 97) % WORLD_WIDTH, y: 10 + ((i * 53) % 90), s: i % 3 === 0 ? 2 : 1 }));

const rockSmall = rockSprite(9, 10, 1.3);
const rockBig = rockSprite(13, 14, 2.1);
const rockPair: Sprite = (() => {
  const left = rockSprite(8, 7, 0.4);
  const right = rockSprite(10, 10, 3.3);
  const pad = Array.from({ length: 3 }, () => '.'.repeat(8));
  return [...pad, ...left].map((row, i) => row + right[i]);
})();
const ROCKS: Record<'rock' | 'boulder' | 'rocks', Sprite> = { rock: rockSmall, boulder: rockBig, rocks: rockPair };

/** Far and near ridge heights, sampled once; drawn repeating with parallax. */
const ridge = (amp: number, base: number, f: number) =>
  Array.from({ length: WORLD_WIDTH / 4 + 1 }, (_, i) => base + amp * (Math.abs(Math.sin(i * f)) * 0.7 + Math.abs(Math.sin(i * f * 2.3 + 1)) * 0.3));
const FAR_RIDGE = ridge(48, 30, 0.045);
const NEAR_RIDGE = ridge(22, 12, 0.09);

interface Palette {
  sky: string;
  ink: string;
  accent: string;
  soft: string;
  highlight: string;
}

function readPalette(el: HTMLElement, night: boolean): Palette {
  const css = getComputedStyle(el);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return night
    ? { sky: v('--arc-night-sky'), ink: v('--arc-night-ink'), accent: v('--arc-accent'), soft: v('--arc-night-soft'), highlight: v('--arc-night-sky') }
    : { sky: v('--arc-sky'), ink: v('--arc-ink'), accent: v('--arc-accent'), soft: v('--arc-soft'), highlight: v('--arc-sky') };
}

function drawRidge(ctx: CanvasRenderingContext2D, heights: number[], offset: number, colour: string) {
  const step = 4;
  const span = heights.length * step - step;
  const shift = offset % span;
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(0, GROUND);
  for (let x = -shift; x <= WORLD_WIDTH + step; x += step) {
    const i = Math.round(((x + shift) / step) % (heights.length - 1));
    ctx.lineTo(x, GROUND - heights[i]);
  }
  ctx.lineTo(WORLD_WIDTH, GROUND);
  ctx.closePath();
  ctx.fill();
}

/**
 * Paints one frame of the run.
 *
 * @param ctx Canvas context already scaled to world pixels.
 * @param s The run to draw.
 * @param el Element whose CSS variables supply the colours.
 * @param best Best score, shown next to the current one.
 */
function paint(ctx: CanvasRenderingContext2D, s: RunnerState, el: HTMLElement, best: number) {
  const score = runnerScore(s);
  const night = Math.floor(score / (DAY_LENGTH / 2)) % 2 === 1;
  const p = readPalette(el, night);
  ctx.fillStyle = p.sky;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  if (night) {
    ctx.fillStyle = p.ink;
    for (const star of STARS) ctx.fillRect((star.x - s.distance * 0.02 + WORLD_WIDTH * 4) % WORLD_WIDTH, star.y, star.s, star.s);
    ctx.beginPath();
    ctx.arc(WORLD_WIDTH - 90, 34, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.sky;
    ctx.beginPath();
    ctx.arc(WORLD_WIDTH - 85, 30, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 0.08;
  drawRidge(ctx, FAR_RIDGE, s.distance * 0.12, p.ink);
  ctx.globalAlpha = 0.14;
  drawRidge(ctx, NEAR_RIDGE, s.distance * 0.35, p.ink);
  ctx.globalAlpha = 1;

  const cloudColours = { body: p.soft, accent: p.soft, highlight: p.soft };
  for (const [i, y] of [28, 52, 18].entries()) {
    const x = WORLD_WIDTH - ((s.distance * 0.25 + i * 230) % (WORLD_WIDTH + 80));
    drawSprite(ctx, CLOUD, x, y + 15, 2, cloudColours);
  }

  ctx.fillStyle = p.ink;
  ctx.fillRect(0, GROUND, WORLD_WIDTH, 1);
  for (let i = 0; i < 28; i++) {
    const x = WORLD_WIDTH - ((s.distance + i * 61) % (WORLD_WIDTH + 20));
    ctx.fillRect(x, GROUND + 4 + ((i * 7) % 12), i % 4 === 0 ? 4 : 2, 1);
  }

  const colours = { body: p.ink, accent: p.accent, highlight: p.sky };
  for (const o of s.obstacles) {
    if (o.kind === 'bird') {
      const flap = Math.floor(s.time / 0.18 + o.id) % 2 === 0;
      drawSprite(ctx, flap ? BIRD_UP : BIRD_DOWN, o.x, GROUND - o.y, PIXEL, colours);
    } else {
      drawSprite(ctx, ROCKS[o.kind], o.x, GROUND, PIXEL, { body: p.ink, accent: p.ink, highlight: p.soft });
    }
  }

  const sprite =
    s.phase === 'over' ? TREKKER_HIT : s.ducking && s.playerY === 0 ? TREKKER_DUCK : s.playerY > 0 || s.phase === 'ready' ? TREKKER_A : Math.floor(s.time / RUN_FRAME_SECONDS) % 2 ? TREKKER_A : TREKKER_B;
  drawSprite(ctx, sprite, PLAYER_X, GROUND - s.playerY, PIXEL, colours);

  ctx.fillStyle = p.ink;
  ctx.font = '600 13px ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace';
  ctx.textAlign = 'right';
  const pad = (n: number) => String(n).padStart(5, '0');
  ctx.fillText(`${best > 0 ? `HI ${pad(best)}   ` : ''}${pad(score)}`, WORLD_WIDTH - 12, 20);
}

interface RunnerGameProps {
  /** Focus the game as soon as it mounts, so Space starts it straight away. */
  autoFocus?: boolean;
  /** Shorter instructions for embedding in a page, such as the Browser's offline page. */
  compact?: boolean;
}

/**
 * Summit Run: jump the rocks, duck the choughs, run as far as you can. Space, ↑ or a tap jumps;
 * ↓ ducks (and drops faster in the air). The loop pauses whenever the game is not visible.
 */
export function RunnerGame({ autoFocus = false, compact = false }: RunnerGameProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<RunnerState>(initialRunner(0));
  const best = useRef(0);
  const [phase, setPhase] = useState<RunnerPhase>('ready');
  const [announcement, setAnnouncement] = useState('');
  const [record, setRecord] = useState(false);

  const act = useCallback((action: RunnerAction) => {
    const before = game.current;
    const next = runner(before, action);
    if (next === before) return;
    game.current = next;
    if (next.phase !== before.phase) {
      setPhase(next.phase);
      if (next.phase === 'over') {
        const score = runnerScore(next);
        const storage = arcadeStorage();
        const bests = recordScore(storage, loadBests(storage), 'runner', score);
        const isRecord = bests.runner === score && score > best.current;
        best.current = bests.runner;
        setRecord(isRecord);
        setAnnouncement(`Game over. Score ${score}.${isRecord ? ' New best!' : ` Best ${best.current}.`} Press Space or Play again.`);
      } else {
        setAnnouncement(next.phase === 'running' ? 'Running. Space to jump, down arrow to duck.' : '');
      }
    }
  }, []);

  const jumpOrRestart = useCallback(() => {
    if (game.current.phase === 'over') act({ type: 'restart', seed: freshSeed() });
    else act({ type: 'jump' });
  }, [act]);

  useEffect(() => {
    game.current = initialRunner(freshSeed());
    best.current = loadBests(arcadeStorage()).runner;
    if (autoFocus) stageRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let raf = 0;
    let last: number | null = null;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const width = canvas.clientWidth;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(((width * WORLD_HEIGHT) / WORLD_WIDTH) * dpr);
      ctx.setTransform((width * dpr) / WORLD_WIDTH, 0, 0, (width * dpr) / WORLD_WIDTH, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      // A game under another full-screen panel stays laid out but inert; it must not keep running there.
      const visible = !document.hidden && canvas.offsetParent !== null && !canvas.closest('[inert]');
      if (!visible) {
        last = null;
        return;
      }
      const dt = last === null ? 0 : (now - last) / 1000;
      last = now;
      if (dt > 0) act({ type: 'tick', dt });
      paint(ctx, game.current, canvas, best.current);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [act]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Keys pressed on a button inside the stage (Play again) belong to that button.
    if (e.target !== e.currentTarget) return;
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      e.preventDefault();
      if (!e.repeat) jumpOrRestart();
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      act({ type: 'duck', down: true });
    } else if (e.key === 'Enter' && game.current.phase !== 'running') {
      e.preventDefault();
      jumpOrRestart();
    }
  };

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') act({ type: 'duck', down: false });
  };

  return (
    <div className="arc-runner" data-compact={compact || undefined}>
      <div
        ref={stageRef}
        className="arc-stage"
        tabIndex={0}
        role="application"
        aria-roledescription="game"
        aria-label="Summit Run. Space or up arrow jumps, down arrow ducks."
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={() => act({ type: 'duck', down: false })}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          onPointerDown={(e) => {
            e.preventDefault();
            stageRef.current?.focus({ preventScroll: true });
            jumpOrRestart();
          }}
        />
        {phase === 'ready' && (
          <p className="arc-overlay" aria-hidden="true">
            <span className="arc-kbd-only">
              <span className="arc-key">Space</span> or{' '}
            </span>
            tap to start
          </p>
        )}
        {phase === 'over' && (
          <div className="arc-overlay arc-over">
            <p className="arc-over-title">{record ? 'New best!' : 'Game over'}</p>
            <button
              type="button"
              className="arc-btn"
              onClick={() => {
                jumpOrRestart();
                stageRef.current?.focus({ preventScroll: true });
              }}
            >
              <span aria-hidden="true">↻</span> Play again
            </button>
          </div>
        )}
      </div>
      <div className="arc-touch" aria-hidden="true">
        <button
          type="button"
          tabIndex={-1}
          onPointerDown={(e) => {
            e.preventDefault();
            act({ type: 'duck', down: true });
          }}
          onPointerUp={() => act({ type: 'duck', down: false })}
          onPointerCancel={() => act({ type: 'duck', down: false })}
          onPointerLeave={() => act({ type: 'duck', down: false })}
        >
          ▼ Duck
        </button>
        <button
          type="button"
          tabIndex={-1}
          onPointerDown={(e) => {
            e.preventDefault();
            jumpOrRestart();
          }}
        >
          ▲ Jump
        </button>
      </div>
      {!compact && (
        <p className="arc-help">
          <span className="arc-key">Space</span>/<span className="arc-key">↑</span> jump · <span className="arc-key">↓</span> duck · birds appear after {BIRD_FROM_SCORE} points · the sky turns to night as you climb
        </p>
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
