import { describe, expect, it } from 'vitest';
import { ROUNDS, type Outcome, type Pass } from './content';
import { INITIAL_STATE, currentResult, reduce, score, type GameAction, type GameState } from './engine';

const outcomes = (pass: Pass) => Object.fromEntries(pass.options.map((o) => [o.id, pass.results[o.id].outcome]));
const round = (id: string) => ROUNDS.find((r) => r.id === id)!;
const passes = ROUNDS.flatMap((r) => [
  { name: `${r.id} base`, pass: r.base as Pass },
  { name: `${r.id} twist`, pass: r.twist as Pass },
]);

describe('Ship It content', () => {
  it('pins the exact outcome of every option in every pass', () => {
    expect(outcomes(round('catalogue').base)).toEqual({ servers: 'none', query: 'viable', cache: 'viable', spinner: 'partial' });
    expect(outcomes(round('catalogue').twist)).toEqual({ servers: 'none', query: 'viable', cache: 'worsened', spinner: 'partial', split: 'viable' });
    expect(outcomes(round('payments').base)).toEqual({ retries: 'worsened', queue: 'partial', remember: 'viable', both: 'viable' });
    expect(outcomes(round('payments').twist)).toEqual({ retries: 'worsened', queue: 'partial', remember: 'partial', both: 'viable', reconcile: 'viable' });
    expect(outcomes(round('editor').base)).toEqual({ wait: 'partial', redraw: 'viable', local: 'viable', server: 'none' });
    expect(outcomes(round('editor').twist)).toEqual({ wait: 'partial', redraw: 'viable', local: 'partial', server: 'none', batch: 'viable' });
  });

  it.each(passes)('$name has a result for every option, four or five options, and at least two viable fixes', ({ pass }) => {
    expect(Object.keys(pass.results).sort()).toEqual(pass.options.map((o) => o.id).sort());
    expect(pass.options.length).toBeGreaterThanOrEqual(4);
    expect(pass.options.length).toBeLessThanOrEqual(5);
    expect(Object.values(pass.results).filter((r) => r.outcome === 'viable').length).toBeGreaterThanOrEqual(2);
  });

  it('adds exactly one option in each twist and keeps the base options', () => {
    for (const r of ROUNDS) {
      const base = r.base.options.map((o) => o.id);
      const twist = r.twist.options.map((o) => o.id);
      expect(twist.slice(0, base.length)).toEqual(base);
      expect(twist).toHaveLength(base.length + 1);
    }
  });

  it('separates reliable processing from duplicate handling in the payment round', () => {
    for (const pass of [round('payments').base, round('payments').twist]) {
      const queue = pass.results.queue.claims;
      expect(queue.reliableProcessing).toBe(true);
      expect(queue.duplicateEffects).toBeGreaterThan(0);
      for (const result of Object.values(pass.results)) {
        if (!result.claims.idempotentBoundary) {
          expect(result.claims.duplicateEffects).toBeGreaterThan(0);
          expect(result.outcome).not.toBe('viable');
        }
        if (result.outcome === 'viable') {
          expect(result.claims.idempotentBoundary && result.claims.reliableProcessing).toBe(true);
          expect(result.claims.duplicateEffects).toBe(0);
        }
      }
    }
  });

  it('only counts remembering payments alone as reliable while the provider keeps resending', () => {
    expect(round('payments').base.results.remember.claims.reliableProcessing).toBe(true);
    expect(round('payments').twist.results.remember.claims.reliableProcessing).toBe(false);
  });

  it('never calls a data-leaking fix anything but worse', () => {
    for (const { pass } of passes) {
      for (const result of Object.values(pass.results)) if (result.claims.leaksData) expect(result.outcome).toBe('worsened');
    }
  });

  it('explains why client-side checks do not stop server redelivery', () => {
    expect(round('payments').whyNot?.answer).toMatch(/provider resends/i);
  });
});

describe('Ship It engine', () => {
  const play = (actions: GameAction[], from: GameState = INITIAL_STATE) => actions.reduce(reduce, from);

  it('plays all three rounds with twists to the end', () => {
    const s = play([
      { type: 'start' },
      { type: 'select', option: 'query' },
      { type: 'confirm' },
      { type: 'twist' },
      { type: 'select', option: 'cache' },
      { type: 'confirm' },
      { type: 'next' },
      { type: 'select', option: 'both' },
      { type: 'confirm' },
      { type: 'next' },
      { type: 'select', option: 'redraw' },
      { type: 'confirm' },
      { type: 'twist' },
      { type: 'select', option: 'batch' },
      { type: 'confirm' },
      { type: 'next' },
    ]);
    expect(s.phase).toBe('done');
    expect(s.picks.map((p) => `${p.round}/${p.pass}/${p.outcome}`)).toEqual([
      'catalogue/base/viable',
      'catalogue/twist/worsened',
      'payments/base/viable',
      'editor/base/viable',
      'editor/twist/viable',
    ]);
    expect(score(s.picks)).toEqual({ played: 5, viable: 4 });
  });

  it('shows the result of the confirmed choice', () => {
    const s = play([{ type: 'start' }, { type: 'select', option: 'servers' }, { type: 'confirm' }]);
    expect(currentResult(s)?.headline).toBe('Four servers, same six seconds');
  });

  it('lets the player try a different fix, keeping only the latest pick for that pass', () => {
    const s = play([{ type: 'start' }, { type: 'select', option: 'servers' }, { type: 'confirm' }, { type: 'retry' }, { type: 'select', option: 'query' }, { type: 'confirm' }]);
    expect(s.picks).toEqual([{ round: 'catalogue', pass: 'base', option: 'query', outcome: 'viable' }]);
  });

  it('returns the identical state for actions that do not apply', () => {
    const intro = INITIAL_STATE;
    for (const a of [{ type: 'confirm' }, { type: 'next' }, { type: 'twist' }, { type: 'retry' }, { type: 'select', option: 'query' }, { type: 'restart' }] as GameAction[]) {
      expect(reduce(intro, a)).toBe(intro);
    }
    const choosing = reduce(intro, { type: 'start' });
    expect(reduce(choosing, { type: 'confirm' })).toBe(choosing);
    expect(reduce(choosing, { type: 'select', option: 'reconcile' })).toBe(choosing);
    expect(reduce(choosing, { type: 'next' })).toBe(choosing);
    const picked = reduce(choosing, { type: 'select', option: 'query' });
    expect(reduce(picked, { type: 'select', option: 'query' })).toBe(picked);
    const twisted = play([{ type: 'confirm' }, { type: 'twist' }, { type: 'select', option: 'split' }, { type: 'confirm' }], picked);
    expect(reduce(twisted, { type: 'twist' })).toBe(twisted);
  });

  it('replays from the first round with nothing carried over', () => {
    const done: GameState = { ...INITIAL_STATE, phase: 'done', round: 2, picks: [{ round: 'editor', pass: 'base', option: 'wait', outcome: 'partial' as Outcome }] };
    const fresh = reduce(done, { type: 'restart' });
    expect(fresh).toEqual({ phase: 'choose', round: 0, pass: 'base', selected: null, picks: [] });
  });
});
