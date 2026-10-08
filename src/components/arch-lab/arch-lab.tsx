'use client';

import { useId, useMemo, useState } from 'react';
import { DEFAULT_CONFIG, DURATION, OUTAGE_WINDOW, SPIKE_WINDOW, explain, simulate, type LabConfig, type LabRun } from '@/lab/arch-lab/sim';
import './arch-lab.css';

const CHART = { w: 600, h: 150, left: 40, right: 8, top: 10, bottom: 22 } as const;
const PLOT_W = CHART.w - CHART.left - CHART.right;
const PLOT_H = CHART.h - CHART.top - CHART.bottom;

const x = (t: number) => CHART.left + (t / (DURATION - 1)) * PLOT_W;
const niceMax = (value: number) => {
  if (value <= 0) return 10;
  const step = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / step) * step;
};
const formatWait = (wait: number | null) => (wait === null ? 'database down' : `${wait.toFixed(1)} s`);

interface Option<T> {
  value: T;
  label: string;
}

/**
 * A labelled radio group for one lab setting.
 *
 * @param props.legend Visible group name.
 * @param props.options Choices in display order.
 * @param props.value The current choice.
 * @param props.onPick Called with the newly chosen value.
 */
function Setting<T extends string | number | boolean>({ legend, options, value, onPick }: { legend: string; options: Option<T>[]; value: T; onPick: (v: T) => void }) {
  const name = useId();
  return (
    <fieldset className="lab-setting">
      <legend>{legend}</legend>
      {options.map((o) => (
        <label key={String(o.value)}>
          <input type="radio" name={name} checked={o.value === value} onChange={() => onPick(o.value)} />
          {o.label}
        </label>
      ))}
    </fieldset>
  );
}

/**
 * Shaded spike and outage periods, so both charts share the same time landmarks.
 *
 * @param props.config The settings that decide which windows exist.
 */
function Windows({ config }: { config: LabConfig }) {
  return (
    <>
      {config.traffic === 'spike' && (
        <g className="lab-band">
          <rect x={x(SPIKE_WINDOW.from)} y={CHART.top} width={x(SPIKE_WINDOW.to) - x(SPIKE_WINDOW.from)} height={PLOT_H} />
          <text x={x(SPIKE_WINDOW.from) + 4} y={CHART.top + 12}>spike</text>
        </g>
      )}
      {config.outage && (
        <g className="lab-band lab-band-outage">
          <rect x={x(OUTAGE_WINDOW.from)} y={CHART.top} width={x(OUTAGE_WINDOW.to) - x(OUTAGE_WINDOW.from)} height={PLOT_H} />
          <text x={x(OUTAGE_WINDOW.from) + 4} y={CHART.top + 24}>outage</text>
        </g>
      )}
    </>
  );
}

/**
 * Axes shared by both charts: a recessive baseline grid, a y maximum and 0/30/60 s ticks.
 *
 * @param props.max The y-axis maximum.
 */
function Axes({ max }: { max: number }) {
  const base = CHART.top + PLOT_H;
  return (
    <g className="lab-axes">
      <line x1={CHART.left} x2={CHART.w - CHART.right} y1={CHART.top} y2={CHART.top} />
      <line x1={CHART.left} x2={CHART.w - CHART.right} y1={base} y2={base} />
      <text x={CHART.left - 6} y={CHART.top + 4} textAnchor="end">{max}</text>
      <text x={CHART.left - 6} y={base + 4} textAnchor="end">0</text>
      {[0, 30, 59].map((t) => (
        <text key={t} x={x(t)} y={CHART.h - 4} textAnchor={t === 0 ? 'start' : t === 59 ? 'end' : 'middle'}>{t === 59 ? '60 s' : `${t} s`}</text>
      ))}
    </g>
  );
}

/**
 * Line chart of the waiting line with a hover crosshair and tooltip.
 *
 * @param props.run The simulated run.
 * @param props.config The settings, for annotation bands.
 */
function QueueChart({ run, config }: { run: LabRun; config: LabConfig }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(run.peakQueue);
  const y = (v: number) => CHART.top + PLOT_H - (v / max) * PLOT_H;
  const path = run.seconds.map((s, i) => `${i ? 'L' : 'M'}${x(s.t).toFixed(1)} ${y(s.queue).toFixed(1)}`).join(' ');
  const point = hover === null ? null : run.seconds[hover];
  return (
    <figure className="lab-chart">
      <figcaption>Requests waiting in line</figcaption>
      <div className="lab-plot">
        <svg
          viewBox={`0 0 ${CHART.w} ${CHART.h}`}
          aria-hidden="true"
          focusable="false"
          onPointerMove={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            const t = Math.round(((((e.clientX - box.left) / box.width) * CHART.w - CHART.left) / PLOT_W) * (DURATION - 1));
            setHover(Math.max(0, Math.min(DURATION - 1, t)));
          }}
          onPointerLeave={() => setHover(null)}
        >
          <Windows config={config} />
          <Axes max={max} />
          <path d={path} className="lab-line" />
          {point && (
            <g className="lab-cross">
              <line x1={x(point.t)} x2={x(point.t)} y1={CHART.top} y2={CHART.top + PLOT_H} />
              <circle cx={x(point.t)} cy={y(point.queue)} r={4.5} />
            </g>
          )}
        </svg>
        {point && (
          <p className="lab-tip" style={{ left: `${(x(point.t) / CHART.w) * 100}%` }}>
            <strong>{point.t} s</strong>
            <br />
            {point.queue} waiting · wait {formatWait(point.wait)}
          </p>
        )}
      </div>
    </figure>
  );
}

/**
 * Bar chart of requests that failed each second, shown only when any failed.
 *
 * @param props.run The simulated run.
 * @param props.config The settings, for annotation bands.
 */
function FailureChart({ run, config }: { run: LabRun; config: LabConfig }) {
  const peak = Math.max(...run.seconds.map((s) => s.failed));
  const max = niceMax(peak);
  const barW = PLOT_W / DURATION - 2;
  return (
    <figure className="lab-chart">
      <figcaption>
        <span className="lab-status" aria-hidden="true">✕</span> Failed requests per second
      </figcaption>
      <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} aria-hidden="true" focusable="false">
        <Windows config={config} />
        <Axes max={max} />
        {run.seconds
          .filter((s) => s.failed > 0)
          .map((s) => {
            const h = (s.failed / max) * PLOT_H;
            return <rect key={s.t} className="lab-bar" x={x(s.t) - barW / 2} y={CHART.top + PLOT_H - h} width={barW} height={h} rx={Math.min(2, barW / 2)} />;
          })}
      </svg>
    </figure>
  );
}

/**
 * Architecture Lab: change traffic, caching, workers and failure handling, and watch the effect on a
 * simulated minute of requests. Deterministic and bounded; the numbers are illustrative.
 *
 * @param props.headingLevel Level of the lab's title, so it nests under its host.
 */
export function ArchLab({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const [config, setConfig] = useState<LabConfig>(DEFAULT_CONFIG);
  const run = useMemo(() => simulate(config), [config]);
  const notes = useMemo(() => explain(config, run), [config, run]);
  const set = <K extends keyof LabConfig>(key: K) => (value: LabConfig[K]) => setConfig((c) => ({ ...c, [key]: value }));
  const H = `h${headingLevel}` as const;

  return (
    <div className="lab">
      <p className="lab-eyebrow">Simulation · made-up numbers</p>
      <H className="lab-title">Architecture Lab</H>
      <p className="lab-lead">One minute of traffic to a service: a cache in front, database workers behind a waiting line. Change one thing and watch what happens.</p>

      <form className="lab-controls" onSubmit={(e) => e.preventDefault()}>
        <Setting legend="Traffic" value={config.traffic} onPick={set('traffic')} options={[{ value: 'steady', label: 'Steady, 40 a second' }, { value: 'spike', label: 'Spike to 160 for 15 s' }]} />
        <Setting legend="Cache" value={config.cache} onPick={set('cache')} options={[{ value: false, label: 'Off' }, { value: true, label: 'On, answers 80%' }]} />
        <Setting
          legend="Database workers (25 a second each)"
          value={config.workers}
          onPick={set('workers')}
          options={([1, 2, 3, 4] as const).map((n) => ({ value: n, label: String(n) }))}
        />
        <Setting legend="Database" value={config.outage} onPick={set('outage')} options={[{ value: false, label: 'Healthy' }, { value: true, label: 'Down for 10 s' }]} />
        <Setting
          legend="While the database is down"
          value={config.recovery}
          onPick={set('recovery')}
          options={[{ value: 'failFast', label: 'Fail fast' }, { value: 'queue', label: 'Hold requests in line' }]}
        />
      </form>

      <dl className="lab-stats">
        <div><dt>Answered</dt><dd>{run.totals.served}</dd></div>
        <div><dt>Failed</dt><dd>{run.totals.failed}</dd></div>
        <div><dt>Still waiting</dt><dd>{run.totals.leftWaiting}</dd></div>
        <div><dt>Longest wait</dt><dd>{run.peakWait === null ? '–' : `${run.peakWait.toFixed(1)} s`}</dd></div>
      </dl>

      <section aria-label="What happened" aria-live="polite" className="lab-notes">
        <ul>
          {notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      </section>

      <QueueChart run={run} config={config} />
      {run.totals.failed > 0 ? <FailureChart run={run} config={config} /> : <p className="lab-ok">No requests failed.</p>}

      <details className="lab-table">
        <summary>Show the numbers, second by second</summary>
        <div className="lab-table-scroll" tabIndex={0} role="region" aria-label="Simulated requests per second">
          <table>
            <caption className="sr-only">Requests per second in this run</caption>
                        <thead>
              <tr>
                <th scope="col">Second</th>
                <th scope="col">Arrived</th>
                <th scope="col">From cache</th>
                <th scope="col">Database</th>
                <th scope="col">Failed</th>
                <th scope="col">Waiting</th>
              </tr>
            </thead>
            <tbody>
              {run.seconds.map((s) => (
                <tr key={s.t}>
                  <th scope="row">{s.t}</th>
                  <td>{s.arrivals}</td>
                  <td>{s.cacheHits}</td>
                  <td>{s.processed}</td>
                  <td>{s.failed}</td>
                  <td>{s.queue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
