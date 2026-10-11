/**
 * 2048: slide numbered tiles on a 4×4 board; equal tiles merge once per move. Pure and deterministic,
 * with new tiles placed from the seed in the state.
 */
import { nextRandom } from './rng';

export type MergeDir = 'up' | 'down' | 'left' | 'right';

export interface MergeState {
  /** Row-major, 0 for an empty cell. */
  board: readonly number[];
  score: number;
  /** The tile value that wins; reaching it once sets `won`, and play may continue. */
  won: boolean;
  over: boolean;
  seed: number;
  /** Cells that changed in the last move, for animation and announcements. */
  merged: readonly number[];
  spawned: number | null;
}

export const SIDE = 4;
export const GOAL = 2048;
/** Chance that a new tile is a 4 instead of a 2. */
const FOUR_CHANCE = 0.1;

/**
 * Slides one line towards index 0, merging equal neighbours once.
 *
 * @param line Tile values in move order.
 * @returns The new line, the points scored, and which positions hold a merged tile.
 */
export function slideLine(line: readonly number[]): { line: number[]; points: number; merged: number[] } {
  const tiles = line.filter((v) => v !== 0);
  const out: number[] = [];
  const merged: number[] = [];
  let points = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === tiles[i + 1]) {
      out.push(tiles[i] * 2);
      points += tiles[i] * 2;
      merged.push(out.length - 1);
      i++;
    } else {
      out.push(tiles[i]);
    }
  }
  while (out.length < line.length) out.push(0);
  return { line: out, points, merged };
}

/** Board indexes of each line, listed in the order tiles move for `dir`. */
function lines(dir: MergeDir): number[][] {
  const result: number[][] = [];
  for (let a = 0; a < SIDE; a++) {
    const line: number[] = [];
    for (let b = 0; b < SIDE; b++) {
      const [row, col] =
        dir === 'left' ? [a, b] : dir === 'right' ? [a, SIDE - 1 - b] : dir === 'up' ? [b, a] : [SIDE - 1 - b, a];
      line.push(row * SIDE + col);
    }
    result.push(line);
  }
  return result;
}

function addTile(board: number[], seed: number): [number | null, number] {
  const empty = board.flatMap((v, i) => (v === 0 ? [i] : []));
  if (empty.length === 0) return [null, seed];
  let r: number;
  [r, seed] = nextRandom(seed);
  const cell = empty[Math.floor(r * empty.length)];
  [r, seed] = nextRandom(seed);
  board[cell] = r < FOUR_CHANCE ? 4 : 2;
  return [cell, seed];
}

/**
 * Whether any move is still possible.
 *
 * @param board The board.
 * @returns True when there is an empty cell or two equal neighbours.
 */
export function canMove(board: readonly number[]): boolean {
  return board.some((v, i) => v === 0 || (i % SIDE < SIDE - 1 && v === board[i + 1]) || (i + SIDE < board.length && v === board[i + SIDE]));
}

/**
 * A new game with two tiles.
 *
 * @param seed Seed for tile placement.
 * @returns The starting state.
 */
export function initialMerge(seed: number): MergeState {
  const board = new Array<number>(SIDE * SIDE).fill(0);
  let s = seed;
  [, s] = addTile(board, s);
  [, s] = addTile(board, s);
  return { board, score: 0, won: false, over: false, seed: s, merged: [], spawned: null };
}

/**
 * Slides the board.
 *
 * @param state The current game.
 * @param dir Direction of the move.
 * @returns The next state, or the same object when nothing would move.
 */
export function move(state: MergeState, dir: MergeDir): MergeState {
  if (state.over) return state;
  const board = [...state.board];
  let points = 0;
  const merged: number[] = [];
  for (const idx of lines(dir)) {
    const result = slideLine(idx.map((i) => state.board[i]));
    idx.forEach((cell, k) => (board[cell] = result.line[k]));
    points += result.points;
    merged.push(...result.merged.map((k) => idx[k]));
  }
  if (board.every((v, i) => v === state.board[i])) return state;
  const [spawned, seed] = addTile(board, state.seed);
  return {
    board,
    score: state.score + points,
    won: state.won || board.some((v) => v >= GOAL),
    over: !canMove(board),
    seed,
    merged,
    spawned,
  };
}
