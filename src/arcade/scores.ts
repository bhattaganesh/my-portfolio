/**
 * Best scores kept in the visitor's own browser. Stored values are validated on read, and a browser
 * that refuses storage simply keeps scores for the visit.
 */
import { z } from 'zod';

export const SCORES_KEY = 'gw.arcade.best.v1';
export const GAMES = ['runner', 'snake', 'merge'] as const;
export type GameId = (typeof GAMES)[number];
export type Bests = Record<GameId, number>;

/** Largest score accepted from storage; anything above it is treated as tampering. */
const MAX_SCORE = 10_000_000;
const schema = z.object(Object.fromEntries(GAMES.map((g) => [g, z.number().int().min(0).max(MAX_SCORE)])) as Record<GameId, z.ZodNumber>).strict();

export const NO_SCORES: Readonly<Bests> = Object.freeze({ runner: 0, snake: 0, merge: 0 });

/**
 * Reads the best scores.
 *
 * @param storage Usually window.localStorage; null when the browser blocks it.
 * @returns Validated scores, or zeros when absent or invalid.
 */
export function loadBests(storage: Pick<Storage, 'getItem'> | null): Bests {
  try {
    const raw = storage?.getItem(SCORES_KEY);
    if (!raw) return { ...NO_SCORES };
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : { ...NO_SCORES };
  } catch {
    return { ...NO_SCORES };
  }
}

/**
 * Records a score if it beats the best for that game.
 *
 * @param storage Where scores live, or null.
 * @param bests The current best scores.
 * @param game Which game finished.
 * @param score The score reached.
 * @returns The updated best scores (unchanged when the score is not a record).
 */
export function recordScore(storage: Pick<Storage, 'setItem'> | null, bests: Bests, game: GameId, score: number): Bests {
  if (!Number.isInteger(score) || score <= bests[game] || score > MAX_SCORE) return bests;
  const next = { ...bests, [game]: score };
  try {
    storage?.setItem(SCORES_KEY, JSON.stringify(next));
  } catch (error) {
    console.warn('Arcade: could not save the best score', error);
  }
  return next;
}

/**
 * localStorage, or null where touching it throws.
 *
 * @returns The storage object or null.
 */
export function arcadeStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
