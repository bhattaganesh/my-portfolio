import { describe, expect, it } from 'vitest';
import {
  BIRD_FROM_SCORE,
  BIRD_SIZE,
  MAX_SPEED,
  MIN_GAP_SECONDS,
  PLAYER_X,
  START_SPEED,
  initialRunner,
  playerBox,
  runner,
  runnerScore,
  type Obstacle,
  type RunnerState,
} from './runner';

const STEP = 1 / 60;

/** Runs for `seconds`, optionally with a jump policy, and returns the final state. */
function play(state: RunnerState, seconds: number, autopilot = false): RunnerState {
  let s = state;
  for (let i = 0; i < seconds / STEP && s.phase === 'running'; i++) {
    if (autopilot) s = avoid(s);
    s = runner(s, { type: 'tick', dt: STEP });
  }
  return s;
}

/** A simple bot: duck under middle birds, jump anything low that is about to arrive. */
function avoid(s: RunnerState): RunnerState {
  const ahead = s.obstacles.find((o) => o.x + o.w > PLAYER_X && o.x - PLAYER_X < s.speed * 0.22);
  if (!ahead) return runner(s, { type: 'duck', down: false });
  if (ahead.kind === 'bird' && ahead.y > 20 && ahead.y < 60) return runner(s, { type: 'duck', down: true });
  if (ahead.kind === 'bird' && ahead.y >= 60) return s;
  return runner(runner(s, { type: 'duck', down: false }), { type: 'jump' });
}

const running = (seed = 7) => runner(initialRunner(seed), { type: 'restart', seed });
const withObstacle = (s: RunnerState, o: Partial<Obstacle>): RunnerState => ({
  ...s,
  obstacles: [{ id: 99, kind: 'rock', x: PLAYER_X, y: 0, w: 30, h: 30, ...o }],
  nextObstacleAt: Infinity,
});

describe('Summit Run engine', () => {
  it('waits for the first jump, then runs and scores', () => {
    const ready = initialRunner(1);
    expect(runner(ready, { type: 'tick', dt: STEP })).toBe(ready);
    const started = runner(ready, { type: 'jump' });
    expect(started.phase).toBe('running');
    const later = play({ ...started, nextObstacleAt: Infinity }, 2);
    expect(runnerScore(later)).toBeGreaterThan(20);
    expect(later.speed).toBeGreaterThan(START_SPEED);
  });

  it('is deterministic for a given seed', () => {
    expect(play(running(42), 20, true)).toEqual(play(running(42), 20, true));
  });

  it('jumps high enough to clear a boulder and lands back on the ground', () => {
    let s = runner({ ...running(), nextObstacleAt: Infinity }, { type: 'jump' });
    let peak = 0;
    for (let i = 0; i < 90; i++) {
      s = runner(s, { type: 'tick', dt: STEP });
      peak = Math.max(peak, s.playerY);
    }
    expect(peak).toBeGreaterThan(14 * 3 + 30);
    expect(s.playerY).toBe(0);
    expect(runner(runner(s, { type: 'jump' }), { type: 'tick', dt: STEP }).playerY).toBeGreaterThan(0);
  });

  it('cannot jump again in mid-air', () => {
    const air = runner(runner({ ...running(), nextObstacleAt: Infinity }, { type: 'jump' }), { type: 'tick', dt: STEP });
    expect(runner(air, { type: 'jump' })).toBe(air);
  });

  it('ends the run on a collision and ignores input afterwards', () => {
    const hit = runner(withObstacle(running(), {}), { type: 'tick', dt: STEP });
    expect(hit.phase).toBe('over');
    expect(runner(hit, { type: 'jump' })).toBe(hit);
    expect(runner(hit, { type: 'tick', dt: STEP })).toBe(hit);
    expect(runner(hit, { type: 'restart', seed: 3 }).phase).toBe('running');
  });

  it('ducking slides under a middle-height bird that would hit a standing runner', () => {
    const bird = { kind: 'bird' as const, y: 34, ...BIRD_SIZE };
    expect(runner(withObstacle(running(), bird), { type: 'tick', dt: STEP }).phase).toBe('over');
    const ducked = runner(withObstacle(running(), bird), { type: 'duck', down: true });
    expect(playerBox(ducked).h).toBeLessThan(34);
    expect(runner(ducked, { type: 'tick', dt: STEP }).phase).toBe('running');
  });

  it('only sends birds after the warm-up score', () => {
    const early = play(running(5), 6, true);
    const seen: Obstacle[] = [];
    let s = running(5);
    for (let i = 0; i < 6 / STEP && s.phase === 'running'; i++) {
      s = runner(avoid(s), { type: 'tick', dt: STEP });
      seen.push(...s.obstacles.filter((o) => runnerScore(s) < BIRD_FROM_SCORE && o.kind === 'bird'));
    }
    expect(early.phase).toBeDefined();
    expect(seen).toEqual([]);
  });

  it('spaces obstacles so each one can be landed and jumped again', () => {
    for (let seed = 1; seed <= 20; seed++) {
      let s = running(seed);
      const starts = new Map<number, number>();
      for (let i = 0; i < 40 / STEP && s.phase === 'running'; i++) {
        s = runner(avoid(s), { type: 'tick', dt: STEP });
        for (const o of s.obstacles) if (!starts.has(o.id)) starts.set(o.id, s.distance);
      }
      const at = [...starts.values()];
      for (let i = 1; i < at.length; i++) expect(at[i] - at[i - 1]).toBeGreaterThanOrEqual(START_SPEED * MIN_GAP_SECONDS * 0.95);
    }
  });

  it('caps speed and the size of a single step', () => {
    const fast = runner({ ...running(), speed: MAX_SPEED, nextObstacleAt: Infinity }, { type: 'tick', dt: 5 });
    expect(fast.speed).toBe(MAX_SPEED);
    expect(fast.distance).toBeLessThan(MAX_SPEED / 20);
    expect(runner(fast, { type: 'tick', dt: Number.NaN })).toBe(fast);
  });

  it('a careful player survives the first stretch on every seed', () => {
    for (let seed = 1; seed <= 25; seed++) expect(play(running(seed), 15, true).phase, `seed ${seed}`).toBe('running');
  });
});
