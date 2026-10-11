/**
 * Summit Run: an endless runner in the spirit of a browser's offline game, set on Himalayan trails.
 * Pure and deterministic: every action returns a new state (or the same object when it does not apply),
 * and randomness comes from a seed carried in the state. Units are world pixels and seconds; y is the
 * height above the ground.
 */
import { nextRandom } from './rng';

export type RunnerPhase = 'ready' | 'running' | 'over';
export type ObstacleKind = 'rock' | 'boulder' | 'rocks' | 'bird';

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Obstacle extends Box {
  id: number;
  kind: ObstacleKind;
}

export interface RunnerState {
  phase: RunnerPhase;
  seed: number;
  /** Seconds since the run started; drives animation. */
  time: number;
  speed: number;
  distance: number;
  playerY: number;
  velocity: number;
  ducking: boolean;
  obstacles: readonly Obstacle[];
  nextObstacleAt: number;
  nextId: number;
}

export type RunnerAction = { type: 'jump' } | { type: 'duck'; down: boolean } | { type: 'tick'; dt: number } | { type: 'restart'; seed: number };

/** Logical world width shown on screen. */
export const WORLD_WIDTH = 600;
/** One sprite pixel in world pixels. */
export const PIXEL = 3;
export const PLAYER_X = 40;
export const PLAYER_SIZE = { w: 12 * PIXEL, h: 15 * PIXEL } as const;
export const PLAYER_DUCK_SIZE = { w: 16 * PIXEL, h: 9 * PIXEL } as const;
export const START_SPEED = 330;
export const MAX_SPEED = 760;
/** Speed gained per second of running. */
const ACCELERATION = 7;
const JUMP_VELOCITY = 720;
const GRAVITY = 2500;
/** Holding duck in the air pulls the runner down this many times faster. */
const FAST_FALL = 3;
/** Longest step simulated at once, so a stalled tab cannot teleport the runner through a rock. */
export const MAX_STEP = 1 / 30;
/** Score shown to the player: one point per this many world pixels run. */
const DISTANCE_PER_POINT = 25;
/** Birds only appear once the runner has warmed up. */
export const BIRD_FROM_SCORE = 250;
/** Hitboxes are shrunk by this much on each side, so near misses feel fair. */
const HIT_INSET = 5;
/** The next obstacle starts at least this many seconds of travel after the previous one, so every gap can be landed and jumped again. */
export const MIN_GAP_SECONDS = 0.8;
const EXTRA_GAP_SECONDS = 0.9;

const SIZES: Record<Exclude<ObstacleKind, 'bird'>, { w: number; h: number }> = {
  rock: { w: 9 * PIXEL, h: 10 * PIXEL },
  boulder: { w: 13 * PIXEL, h: 14 * PIXEL },
  rocks: { w: 18 * PIXEL, h: 10 * PIXEL },
};
export const BIRD_SIZE = { w: 15 * PIXEL, h: 9 * PIXEL } as const;
/** Bird flight heights: low must be jumped, middle must be ducked (or jumped), high is scenery. */
export const BIRD_HEIGHTS = [6, 34, 78] as const;

/**
 * A fresh run waiting for its first jump.
 *
 * @param seed Seed for obstacle placement.
 * @returns The ready state.
 */
export function initialRunner(seed: number): RunnerState {
  return {
    phase: 'ready',
    seed,
    time: 0,
    speed: START_SPEED,
    distance: 0,
    playerY: 0,
    velocity: 0,
    ducking: false,
    obstacles: [],
    nextObstacleAt: WORLD_WIDTH * 0.9,
    nextId: 1,
  };
}

/**
 * The score for a state.
 *
 * @param state The run.
 * @returns Whole points travelled.
 */
export function runnerScore(state: RunnerState): number {
  return Math.floor(state.distance / DISTANCE_PER_POINT);
}

/**
 * The runner's current collision box in world coordinates.
 *
 * @param state The run.
 * @returns The box, ducking-aware.
 */
export function playerBox(state: RunnerState): Box {
  const size = state.ducking && state.playerY === 0 ? PLAYER_DUCK_SIZE : PLAYER_SIZE;
  return { x: PLAYER_X, y: state.playerY, w: size.w, h: size.h };
}

const overlaps = (a: Box, b: Box) =>
  a.x + HIT_INSET < b.x + b.w - HIT_INSET &&
  b.x + HIT_INSET < a.x + a.w - HIT_INSET &&
  a.y + HIT_INSET < b.y + b.h - HIT_INSET &&
  b.y + HIT_INSET < a.y + a.h - HIT_INSET;

function spawn(state: RunnerState): RunnerState {
  const [roll, s1] = nextRandom(state.seed);
  const [pick, s2] = nextRandom(s1);
  const [gap, seed] = nextRandom(s2);
  const x = WORLD_WIDTH + 20;
  const birds = runnerScore(state) >= BIRD_FROM_SCORE && roll < 0.3;
  let obstacle: Obstacle;
  if (birds) {
    const y = BIRD_HEIGHTS[Math.min(BIRD_HEIGHTS.length - 1, Math.floor(pick * BIRD_HEIGHTS.length))];
    obstacle = { id: state.nextId, kind: 'bird', x, y, ...BIRD_SIZE };
  } else {
    const kinds = ['rock', 'boulder', 'rocks'] as const;
    const kind = kinds[Math.min(kinds.length - 1, Math.floor(pick * kinds.length))];
    obstacle = { id: state.nextId, kind, x, y: 0, ...SIZES[kind] };
  }
  const travel = state.speed * (MIN_GAP_SECONDS + gap * EXTRA_GAP_SECONDS);
  return {
    ...state,
    seed,
    obstacles: [...state.obstacles, obstacle],
    nextObstacleAt: state.distance + travel,
    nextId: state.nextId + 1,
  };
}

function tick(state: RunnerState, rawDt: number): RunnerState {
  if (state.phase !== 'running' || !(rawDt > 0)) return state;
  const dt = Math.min(rawDt, MAX_STEP);
  const speed = Math.min(MAX_SPEED, state.speed + ACCELERATION * dt);
  const gravity = state.ducking && state.playerY > 0 ? GRAVITY * FAST_FALL : GRAVITY;
  let velocity = state.velocity - gravity * dt;
  let playerY = state.playerY + velocity * dt;
  if (playerY <= 0) {
    playerY = 0;
    velocity = 0;
  }
  const move = speed * dt;
  const obstacles = state.obstacles.map((o) => ({ ...o, x: o.x - move * (o.kind === 'bird' ? 1.15 : 1) })).filter((o) => o.x + o.w > -10);
  let next: RunnerState = { ...state, time: state.time + dt, speed, distance: state.distance + move, playerY, velocity, obstacles };
  if (next.distance >= next.nextObstacleAt) next = spawn(next);
  const player = playerBox(next);
  if (next.obstacles.some((o) => overlaps(player, o))) return { ...next, phase: 'over' };
  return next;
}

/**
 * Applies one action.
 *
 * @param state The current run.
 * @param action What happened: a jump, duck press or release, a time step, or a restart.
 * @returns The next state, or the same object when the action does not apply.
 */
export function runner(state: RunnerState, action: RunnerAction): RunnerState {
  switch (action.type) {
    case 'restart':
      return { ...initialRunner(action.seed), phase: 'running' };
    case 'jump':
      if (state.phase === 'ready') return { ...state, phase: 'running', velocity: JUMP_VELOCITY };
      if (state.phase !== 'running' || state.playerY > 0) return state;
      return { ...state, velocity: JUMP_VELOCITY, ducking: false };
    case 'duck':
      if (state.phase !== 'running' || state.ducking === action.down) return state;
      return { ...state, ducking: action.down };
    case 'tick':
      return tick(state, action.dt);
  }
}
