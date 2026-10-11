import { describe, expect, it } from 'vitest';
import { NO_SCORES, SCORES_KEY, loadBests, recordScore } from './scores';

const memory = (raw?: string) => {
  const data = new Map<string, string>(raw === undefined ? [] : [[SCORES_KEY, raw]]);
  return { data, getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
};

describe('arcade best scores', () => {
  it('starts at zero and keeps only new records', () => {
    const store = memory();
    let bests = loadBests(store);
    expect(bests).toEqual(NO_SCORES);
    bests = recordScore(store, bests, 'runner', 120);
    expect(recordScore(store, bests, 'runner', 90)).toBe(bests);
    expect(loadBests(store)).toEqual({ ...NO_SCORES, runner: 120 });
  });

  it.each(['{"runner":', JSON.stringify({ runner: -1, snake: 0, merge: 0 }), JSON.stringify({ runner: 1.5, snake: 0, merge: 0 }), JSON.stringify({ ...NO_SCORES, extra: 1 })])(
    'ignores invalid stored data: %s',
    (raw) => expect(loadBests(memory(raw))).toEqual(NO_SCORES),
  );

  it('works without storage and rejects impossible scores', () => {
    expect(loadBests(null)).toEqual(NO_SCORES);
    const bests = recordScore(null, NO_SCORES, 'snake', 7);
    expect(bests.snake).toBe(7);
    expect(recordScore(null, bests, 'snake', Number.NaN)).toBe(bests);
    expect(recordScore(null, bests, 'snake', 1e12)).toBe(bests);
  });
});
