/**
 * Snake on a walled grid. Pure and deterministic: food placement comes from the seed in the state,
 * turns are queued so two quick key presses inside one tick both count, and reversing is ignored.
 */
import { nextRandom } from './rng';

export type Dir = 'up' | 'down' | 'left' | 'right';
export type SnakePhase = 'ready' | 'running' | 'over' | 'won';

export interface Cell {
  x: number;
  y: number;
}

export interface SnakeState {
  phase: SnakePhase;
  size: number;
  /** Head first. */
  body: readonly Cell[];
  dir: Dir;
  queue: readonly Dir[];
  food: Cell | null;
  score: number;
  seed: number;
}

export type SnakeAction = { type: 'turn'; dir: Dir } | { type: 'tick' } | { type: 'restart'; seed: number };

export const GRID = 17;
/** Turns remembered between ticks. */
const MAX_QUEUE = 2;
const VECTORS: Record<Dir, Cell> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };

const same = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y;

function placeFood(body: readonly Cell[], size: number, seed: number): [Cell | null, number] {
  const free: Cell[] = [];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!body.some((c) => c.x === x && c.y === y)) free.push({ x, y });
  if (free.length === 0) return [null, seed];
  const [r, next] = nextRandom(seed);
  return [free[Math.floor(r * free.length)], next];
}

/**
 * A new game with a three-cell snake in the middle, heading right.
 *
 * @param seed Seed for food placement.
 * @param size Grid size in cells.
 * @returns The ready state.
 */
export function initialSnake(seed: number, size = GRID): SnakeState {
  const mid = Math.floor(size / 2);
  const body = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
  const [food, next] = placeFood(body, size, seed);
  return { phase: 'ready', size, body, dir: 'right', queue: [], food, score: 0, seed: next };
}

/**
 * Applies one action.
 *
 * @param state The current game.
 * @param action A turn, a tick of movement, or a restart.
 * @returns The next state, or the same object when the action does not apply.
 */
export function snake(state: SnakeState, action: SnakeAction): SnakeState {
  if (action.type === 'restart') return { ...initialSnake(action.seed, state.size), phase: 'running' };

  if (action.type === 'turn') {
    if (state.phase === 'over' || state.phase === 'won' || state.queue.length >= MAX_QUEUE) return state;
    const last = state.queue[state.queue.length - 1] ?? state.dir;
    if (action.dir === OPPOSITE[last]) return state;
    if (action.dir === last) return state.phase === 'ready' ? { ...state, phase: 'running' } : state;
    return { ...state, phase: 'running', queue: [...state.queue, action.dir] };
  }

  if (state.phase !== 'running') return state;
  const [turn, ...rest] = state.queue;
  const dir = turn ?? state.dir;
  const v = VECTORS[dir];
  const head = { x: state.body[0].x + v.x, y: state.body[0].y + v.y };
  const eating = state.food !== null && same(head, state.food);
  const body = eating ? state.body : state.body.slice(0, -1);
  const outside = head.x < 0 || head.y < 0 || head.x >= state.size || head.y >= state.size;
  if (outside || body.some((c) => same(c, head))) return { ...state, dir, queue: rest, phase: 'over' };
  const nextBody = [head, ...body];
  if (!eating) return { ...state, body: nextBody, dir, queue: rest };
  const [food, seed] = placeFood(nextBody, state.size, state.seed);
  return { ...state, body: nextBody, dir, queue: rest, food, seed, score: state.score + 1, phase: food ? 'running' : 'won' };
}

/**
 * Milliseconds between moves; the snake speeds up as it grows.
 *
 * @param score Food eaten so far.
 * @returns The tick interval.
 */
export function snakeInterval(score: number): number {
  return Math.max(65, 135 - score * 3);
}
