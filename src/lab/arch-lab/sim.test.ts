import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, DURATION, OUTAGE_WINDOW, QUEUE_LIMIT, explain, simulate, type LabConfig } from './sim';

const ALL: LabConfig[] = (['steady', 'spike'] as const).flatMap((traffic) =>
  [false, true].flatMap((cache) =>
    ([1, 2, 3, 4] as const).flatMap((workers) =>
      [false, true].flatMap((outage) => (['failFast', 'queue'] as const).map((recovery) => ({ traffic, cache, workers, outage, recovery }))),
    ),
  ),
);

describe('architecture lab model', () => {
  it.each(ALL.map((c) => [JSON.stringify(c), c] as const))('conserves every request and respects the line limit: %s', (_name, config) => {
    const run = simulate(config);
    expect(run.seconds).toHaveLength(DURATION);
    expect(run.totals.served + run.totals.failed + run.totals.leftWaiting).toBe(run.totals.arrivals);
    for (const s of run.seconds) {
      expect(s.queue).toBeGreaterThanOrEqual(0);
      expect(s.queue).toBeLessThanOrEqual(QUEUE_LIMIT);
    }
  });

  it('is deterministic', () => {
    expect(simulate(DEFAULT_CONFIG)).toEqual(simulate(DEFAULT_CONFIG));
  });

  it('never gets worse with more workers or with the cache on', () => {
    for (const c of ALL) {
      const run = simulate(c);
      if (c.workers < 4) {
        const more = simulate({ ...c, workers: (c.workers + 1) as LabConfig['workers'] });
        expect(more.totals.failed).toBeLessThanOrEqual(run.totals.failed);
        expect(more.peakQueue).toBeLessThanOrEqual(run.peakQueue);
      }
      if (!c.cache) expect(simulate({ ...c, cache: true }).peakQueue).toBeLessThanOrEqual(run.peakQueue);
    }
  });

  it('handles steady traffic with two workers and no line', () => {
    const run = simulate({ traffic: 'steady', cache: false, workers: 2, outage: false, recovery: 'queue' });
    expect(run.peakQueue).toBe(0);
    expect(run.totals.failed).toBe(0);
  });

  it('builds a line during the spike that a cache prevents', () => {
    const base = { traffic: 'spike', workers: 2, outage: false, recovery: 'queue' } as const;
    expect(simulate({ ...base, cache: false }).peakQueue).toBeGreaterThan(0);
    expect(simulate({ ...base, cache: true }).peakQueue).toBe(0);
  });

  it('fails fast during an outage, or holds requests and serves them later', () => {
    const base = { traffic: 'steady', cache: false, workers: 4, outage: true } as const;
    const fast = simulate({ ...base, recovery: 'failFast' });
    expect(fast.totals.failed).toBe(40 * (OUTAGE_WINDOW.to - OUTAGE_WINDOW.from));
    expect(fast.peakQueue).toBe(0);
    const queued = simulate({ ...base, recovery: 'queue' });
    expect(queued.totals.failed).toBe(0);
    expect(queued.peakQueue).toBe(400);
    expect(queued.totals.leftWaiting).toBe(0);
    expect(queued.seconds[OUTAGE_WINDOW.from].wait).toBeNull();
  });

  it('turns requests away once the line is full, and says so', () => {
    const config: LabConfig = { traffic: 'spike', cache: false, workers: 1, outage: true, recovery: 'queue' };
    const run = simulate(config);
    expect(run.peakQueue).toBe(QUEUE_LIMIT);
    expect(run.totals.failed).toBeGreaterThan(0);
    expect(explain(config, run).join(' ')).toMatch(`requests were turned away`);
  });

  it('only claims everything was answered when nothing failed or is still waiting', () => {
    for (const c of ALL) {
      const run = simulate(c);
      const said = explain(c, run).includes('Every request was answered within the minute.');
      expect(said).toBe(run.totals.failed === 0 && run.totals.leftWaiting === 0);
    }
  });
});
