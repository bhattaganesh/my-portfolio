/**
 * Architecture Lab: a deterministic, second-by-second model of one service with an optional cache,
 * a bounded waiting line in front of database workers, a traffic spike and a database outage.
 * All numbers are invented for illustration ("Simulation · made-up numbers").
 */

export type Traffic = 'steady' | 'spike';
export type Recovery = 'failFast' | 'queue';

export interface LabConfig {
  traffic: Traffic;
  cache: boolean;
  workers: 1 | 2 | 3 | 4;
  outage: boolean;
  recovery: Recovery;
}

export interface Second {
  t: number;
  arrivals: number;
  cacheHits: number;
  processed: number;
  failed: number;
  /** Requests still waiting at the end of this second. */
  queue: number;
  /** Seconds a new request would wait at the current pace; null while the database is down. */
  wait: number | null;
}

export interface LabRun {
  seconds: Second[];
  totals: { arrivals: number; served: number; failed: number; leftWaiting: number };
  peakQueue: number;
  peakWait: number | null;
}

/** Length of a run in seconds. */
export const DURATION = 60;
/** Requests per second outside the spike, and during it. */
export const STEADY_RATE = 40;
export const SPIKE_RATE = 160;
export const SPIKE_WINDOW = { from: 20, to: 35 } as const;
/** The database is unreachable for these seconds when the outage is switched on. */
export const OUTAGE_WINDOW = { from: 30, to: 40 } as const;
/** Requests one database worker completes per second. */
export const WORKER_RATE = 25;
/** Share of requests the cache answers when it is on (in tenths, to keep the model in whole numbers). */
export const CACHE_HIT_TENTHS = 8;
/** Longest the waiting line may get; anything beyond it is turned away. */
export const QUEUE_LIMIT = 600;

export const DEFAULT_CONFIG: Readonly<LabConfig> = Object.freeze({ traffic: 'spike', cache: false, workers: 2, outage: false, recovery: 'queue' });

const inWindow = (t: number, w: { from: number; to: number }) => t >= w.from && t < w.to;

/**
 * Runs the model for DURATION seconds.
 *
 * @param config The visitor's choices.
 * @returns Per-second figures and totals; served + failed + leftWaiting always equals arrivals.
 */
export function simulate(config: LabConfig): LabRun {
  const seconds: Second[] = [];
  let queue = 0;
  let served = 0;
  let failed = 0;
  let arrivals = 0;
  for (let t = 0; t < DURATION; t++) {
    const incoming = config.traffic === 'spike' && inWindow(t, SPIKE_WINDOW) ? SPIKE_RATE : STEADY_RATE;
    const cacheHits = config.cache ? (incoming * CACHE_HIT_TENTHS) / 10 : 0;
    const misses = incoming - cacheHits;
    const down = config.outage && inWindow(t, OUTAGE_WINDOW);
    const capacity = down ? 0 : config.workers * WORKER_RATE;

    let failedNow = 0;
    if (down && config.recovery === 'failFast') {
      failedNow += misses;
    } else {
      queue += misses;
    }
    const processed = Math.min(queue, capacity);
    queue -= processed;
    if (queue > QUEUE_LIMIT) {
      failedNow += queue - QUEUE_LIMIT;
      queue = QUEUE_LIMIT;
    }

    arrivals += incoming;
    served += cacheHits + processed;
    failed += failedNow;
    seconds.push({ t, arrivals: incoming, cacheHits, processed, failed: failedNow, queue, wait: capacity === 0 ? null : queue / capacity });
  }
  const waits = seconds.map((s) => s.wait).filter((w): w is number => w !== null);
  return {
    seconds,
    totals: { arrivals, served, failed, leftWaiting: queue },
    peakQueue: Math.max(...seconds.map((s) => s.queue)),
    peakWait: waits.length ? Math.max(...waits) : null,
  };
}

/**
 * Plain-language observations about a run, most important first.
 *
 * @param config The choices that produced the run.
 * @param run The run to describe.
 * @returns Short sentences that only state what the run's numbers show.
 */
export function explain(config: LabConfig, run: LabRun): string[] {
  const notes: string[] = [];
  const capacity = config.workers * WORKER_RATE;
  const missRate = (rate: number) => (config.cache ? (rate * (10 - CACHE_HIT_TENTHS)) / 10 : rate);
  const spikeLoad = missRate(config.traffic === 'spike' ? SPIKE_RATE : STEADY_RATE);
  if (spikeLoad > capacity) {
    notes.push(`At the busiest point ${spikeLoad} requests a second need the database, but ${config.workers} worker${config.workers > 1 ? 's' : ''} can handle ${capacity}, so a line builds up.`);
  } else {
    notes.push(`The database never gets more than ${spikeLoad} requests a second, within the ${capacity} the workers can handle.`);
  }
  if (config.cache) notes.push(`The cache answers ${CACHE_HIT_TENTHS * 10}% of requests without touching the database.`);
  if (config.outage) {
    notes.push(
      config.recovery === 'failFast'
        ? 'During the outage every request that needs the database fails straight away; users see errors, but nothing piles up for later.'
        : 'During the outage requests wait in line instead of failing; once the database is back the workers clear the backlog, so users wait instead of seeing errors.',
    );
  }
  if (run.totals.failed > 0 && run.peakQueue >= QUEUE_LIMIT) notes.push(`The line hit its limit of ${QUEUE_LIMIT}, so ${run.totals.failed} requests were turned away.`);
  if (run.totals.leftWaiting > 0) notes.push(`${run.totals.leftWaiting} requests are still waiting when the minute ends.`);
  if (run.totals.failed === 0 && run.totals.leftWaiting === 0) notes.push('Every request was answered within the minute.');
  return notes;
}
