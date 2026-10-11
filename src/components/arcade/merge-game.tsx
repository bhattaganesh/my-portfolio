'use client';

import { useEffect, useRef, useState } from 'react';
import { GOAL, SIDE, initialMerge, move, type MergeDir, type MergeState } from '@/arcade/merge';
import { freshSeed } from '@/arcade/rng';
import { arcadeStorage, loadBests, recordScore } from '@/arcade/scores';
import { DirectionPad, keyDirection, useSwipe } from './controls';
import './arcade.css';

const ROWS = Array.from({ length: SIDE }, (_, r) => r);

/**
 * 2048: slide the tiles with arrow keys, WASD or a swipe; equal tiles merge. The board is a real
 * table, so screen readers can read it, and every move announces what changed.
 */
export function MergeGame({ autoFocus = false }: { autoFocus?: boolean }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<MergeState | null>(null);
  const [best, setBest] = useState(0);
  const [keepGoing, setKeepGoing] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // The first board is random, so it is created only in the browser to keep server and client output equal.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(initialMerge(freshSeed()));
    setBest(loadBests(arcadeStorage()).merge);
    if (autoFocus) boardRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const slide = (dir: MergeDir) => {
    if (!state) return;
    const next = move(state, dir);
    if (next === state) {
      setAnnouncement(`Nothing moves ${dir}.`);
      return;
    }
    setState(next);
    const gained = next.score - state.score;
    if (next.over) {
      const storage = arcadeStorage();
      const bests = recordScore(storage, loadBests(storage), 'merge', next.score);
      setBest(bests.merge);
      setAnnouncement(`No moves left. Final score ${next.score}. Best ${bests.merge}.`);
    } else if (next.won && !state.won) {
      setAnnouncement(`You made ${GOAL}! Score ${next.score}. Keep going if you like.`);
    } else {
      const top = Math.max(...next.board);
      setAnnouncement(`Moved ${dir}.${gained ? ` Plus ${gained}.` : ''} Score ${next.score}. Highest tile ${top}.`);
    }
  };

  const restart = () => {
    const current = state;
    if (current && current.score > 0) {
      const storage = arcadeStorage();
      setBest(recordScore(storage, loadBests(storage), 'merge', current.score).merge);
    }
    setState(initialMerge(freshSeed()));
    setKeepGoing(false);
    setAnnouncement('New game.');
    boardRef.current?.focus({ preventScroll: true });
  };

  const swipe = useSwipe(slide);
  const score = state?.score ?? 0;
  const showWin = state?.won && !keepGoing && !state.over;

  return (
    <div className="arc-merge">
      <div className="arc-scorebar">
        <span>Score <strong>{score}</strong></span>
        <span>Best <strong>{Math.max(best, score)}</strong></span>
        <button type="button" className="arc-btn arc-btn-small" onClick={restart}>
          New game
        </button>
      </div>
      <div
        ref={boardRef}
        className="arc-stage arc-tiles"
        tabIndex={0}
        role="application"
        aria-roledescription="game"
        aria-label="2048 board. Arrow keys or W A S D slide the tiles."
        aria-describedby="arc-merge-table"
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          const dir = keyDirection(e.key);
          if (dir) {
            e.preventDefault();
            slide(dir);
          }
        }}
        {...swipe}
      >
        <div id="arc-merge-table" className="arc-grid" role="table" aria-label="Board, row by row">
          {ROWS.map((r) => (
              <div key={r} role="row" className="arc-grid-row">
                {ROWS.map((c) => {
                  const i = r * SIDE + c;
                  const value = state?.board[i] ?? 0;
                  return (
                    <div
                      key={c}
                      role="cell"
                      className="arc-cell"
                      data-value={value || undefined}
                      data-merged={state?.merged.includes(i) || undefined}
                      data-new={state?.spawned === i || undefined}
                    >
                      {value ? value : <span className="sr-only">empty</span>}
                    </div>
                  );
                })}
              </div>
          ))}
        </div>
        {(state?.over || showWin) && (
          <div className="arc-overlay arc-over">
            <p className="arc-over-title">{state?.over ? 'No moves left' : `You made ${GOAL}!`}</p>
            <div className="arc-row">
              {showWin && (
                <button type="button" className="arc-btn" onClick={() => {
                    setKeepGoing(true);
                    boardRef.current?.focus({ preventScroll: true });
                  }}>
                  Keep going
                </button>
              )}
              <button type="button" className="arc-btn" onClick={restart}>
                <span aria-hidden="true">↻</span> New game
              </button>
            </div>
          </div>
        )}
      </div>
      <DirectionPad onPress={slide} />
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </div>
  );
}
