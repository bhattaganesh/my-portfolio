'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { ROUNDS, type Outcome } from '@/lab/ship-it/content';
import { INITIAL_STATE, currentPass, currentResult, reduce, score } from '@/lab/ship-it/engine';
import './ship-it.css';

const OUTCOME_LABEL: Record<Outcome, string> = { viable: 'Works', partial: 'Partly works', none: 'No change', worsened: 'Made it worse' };
const OUTCOME_MARK: Record<Outcome, string> = { viable: '✓', partial: '◐', none: '–', worsened: '✕' };

interface ShipItProps {
  /** Level of the game's own headings, so it nests under the host page or window title. */
  headingLevel?: 2 | 3;
  /** Extra line in the intro, e.g. how minimizing or closing affects a run. */
  note?: string;
}

/**
 * Ship It: a three-round engineering game with plain-language choices, consequences, an optional
 * harder twist per round and a debrief. Native form controls give keyboard and touch support.
 */
export function ShipIt({ headingLevel = 2, note }: ShipItProps) {
  const [state, dispatch] = useReducer(reduce, INITIAL_STATE);
  const [technical, setTechnical] = useState(false);
  const [hint, setHint] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const H = `h${headingLevel}` as const;
  const Sub = `h${headingLevel + 1}` as 'h3' | 'h4';

  // Each new screen takes focus on its heading, but never on first render (that would steal focus on load).
  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [state.phase, state.round, state.pass]);

  const act = (action: Parameters<typeof dispatch>[0]) => {
    moved.current = true;
    setHint('');
    dispatch(action);
  };

  const round = ROUNDS[state.round];

  if (state.phase === 'intro') {
    return (
      <div className="si">
        <p className="si-eyebrow">Simulation · made-up numbers</p>
        <H ref={headingRef} tabIndex={-1} className="si-title">Ship It</H>
        <p>Three short production problems. For each one, pick the fix you would ship and see what happens to the system.</p>
        <ul className="si-rules">
          <li>Every choice is in plain language; engineering terms are one switch away.</li>
          <li>Each round has an optional harder twist that changes one assumption.</li>
          <li>Nothing is saved or sent anywhere. It takes about five minutes.</li>
          {note && <li>{note}</li>}
        </ul>
        <button type="button" className="si-btn si-primary" onClick={() => act({ type: 'start' })}>
          Start round 1
        </button>
      </div>
    );
  }

  if (state.phase === 'done') {
    const { played, viable } = score(state.picks);
    return (
      <div className="si">
        <p className="si-eyebrow">Simulation · made-up numbers</p>
        <H ref={headingRef} tabIndex={-1} className="si-title">Debrief</H>
        <p className="si-score">
          {viable} of {played} fixes you shipped worked.
        </p>
        <ol className="si-debrief">
          {ROUNDS.map((r) => (
            <li key={r.id}>
              <Sub>{r.title}</Sub>
              <ul>
                {state.picks
                  .filter((p) => p.round === r.id)
                  .map((p) => {
                    const pass = p.pass === 'twist' ? r.twist : r.base;
                    return (
                      <li key={p.pass}>
                        <span className={`si-badge si-${p.outcome}`}>
                          <span aria-hidden="true">{OUTCOME_MARK[p.outcome]}</span> {OUTCOME_LABEL[p.outcome]}
                        </span>{' '}
                        {p.pass === 'twist' ? 'Twist: ' : ''}
                        {pass.options.find((o) => o.id === p.option)?.label}
                      </li>
                    );
                  })}
              </ul>
              <p className="si-lesson">{r.lesson}</p>
            </li>
          ))}
        </ol>
        <button type="button" className="si-btn si-primary" onClick={() => act({ type: 'restart' })}>
          Play again
        </button>
      </div>
    );
  }

  const pass = currentPass(state);
  const isTwist = state.pass === 'twist';
  const result = currentResult(state);
  const last = state.round === ROUNDS.length - 1;

  return (
    <div className="si">
      <div className="si-progress">
        <p className="si-eyebrow">Simulation · made-up numbers</p>
        <ol aria-label="Progress">
          {ROUNDS.map((r, i) => (
            <li key={r.id} aria-current={i === state.round ? 'step' : undefined} data-done={i < state.round || undefined}>
              <span className="sr-only">Round {i + 1}: </span>
              {r.title}
            </li>
          ))}
        </ol>
      </div>

      {state.phase === 'choose' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!state.selected) {
              setHint('Pick a fix first.');
              return;
            }
            act({ type: 'confirm' });
          }}
        >
          <H ref={headingRef} tabIndex={-1} className="si-title">
            Round {state.round + 1}: {round.title}
            {isTwist && <span className="si-twist-tag"> · harder twist</span>}
          </H>
          <p>{round.story}</p>
          {isTwist && (
            <p className="si-callout">
              <strong>What changed:</strong> {round.twist.change}
            </p>
          )}
          <dl className="si-metric">
            <dt>{pass.metric.label}</dt>
            <dd>{pass.metric.before}</dd>
          </dl>
          <fieldset className="si-options">
            <legend>What do you ship?</legend>
            {pass.options.map((o) => (
              <label key={o.id} className="si-option" data-selected={state.selected === o.id || undefined}>
                <input type="radio" name="si-fix" value={o.id} checked={state.selected === o.id} onChange={() => act({ type: 'select', option: o.id })} />
                <span>
                  <strong>{o.label}</strong>
                  <span className="si-detail">{o.detail}</span>
                  {technical && <span className="si-tech">{o.technical}</span>}
                </span>
              </label>
            ))}
          </fieldset>
          <label className="si-toggle">
            <input type="checkbox" checked={technical} onChange={(e) => setTechnical(e.target.checked)} />
            Show engineering terms
          </label>
          <div className="si-actions">
            <button type="submit" className="si-btn si-primary">
              Ship it
            </button>
            <p className="si-hint" role="status">{hint}</p>
          </div>
        </form>
      )}

      {state.phase === 'result' && result && state.selected && (
        <div className="si-stack">
          <p className={`si-badge si-${result.outcome}`} aria-hidden="true">
            {OUTCOME_MARK[result.outcome]} {OUTCOME_LABEL[result.outcome]}
          </p>
          {/* The outcome is part of the heading's name, because focus lands on the heading after shipping. */}
          <H ref={headingRef} tabIndex={-1} className="si-title">
            <span className="sr-only">{OUTCOME_LABEL[result.outcome]}: </span>
            {result.headline}
          </H>
          <p>{result.explanation}</p>
          <dl className="si-metric">
            <dt>{pass.metric.label}</dt>
            <dd>
              {pass.metric.before} <span aria-hidden="true">→</span>
              <span className="sr-only"> became </span> {result.after}
            </dd>
          </dl>
          <details className="si-details" open={technical || undefined}>
            <summary>In engineering terms</summary>
            <p>
              You shipped: <strong>{pass.options.find((o) => o.id === state.selected)?.technical}</strong>.
            </p>
          </details>
          {round.whyNot && (
            <aside className="si-callout" aria-label="A common question">
              <strong>{round.whyNot.question}</strong> {round.whyNot.answer}
            </aside>
          )}
          <div className="si-actions">
            {!isTwist && (
              <button type="button" className="si-btn si-primary" onClick={() => act({ type: 'twist' })}>
                Try the harder twist
              </button>
            )}
            <button type="button" className={`si-btn${isTwist ? ' si-primary' : ''}`} onClick={() => act({ type: 'next' })}>
              {last ? 'See the debrief' : `Next: round ${state.round + 2}`}
            </button>
            <button type="button" className="si-btn" onClick={() => act({ type: 'retry' })}>
              Try a different fix
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
