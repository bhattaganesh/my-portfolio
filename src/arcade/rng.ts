/**
 * Small seeded random number generator (mulberry32). Pure: it returns the value and the next seed,
 * so game engines stay deterministic and replayable in tests.
 *
 * @param seed The current 32-bit seed.
 * @returns A value in [0, 1) and the seed to use next time.
 */
export function nextRandom(seed: number): [value: number, seed: number] {
  const next = (seed + 0x6d2b79f5) | 0;
  let t = next;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, next];
}

/**
 * A seed for a new game.
 *
 * @returns A 32-bit integer seed.
 */
export function freshSeed(): number {
  return (Math.random() * 2 ** 32) | 0;
}
