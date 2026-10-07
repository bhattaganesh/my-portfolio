/**
 * Ship It game state. A pure reducer with no timers, randomness or storage: an action that does not
 * apply in the current phase returns the identical state object.
 */
import { ROUNDS, type Outcome, type Pass, type Result, type Round } from './content';

export type PassKind = 'base' | 'twist';
export type Phase = 'intro' | 'choose' | 'result' | 'done';

export interface Pick {
  round: Round['id'];
  pass: PassKind;
  option: string;
  outcome: Outcome;
}

export interface GameState {
  phase: Phase;
  round: number;
  pass: PassKind;
  selected: string | null;
  /** One entry per pass played, in order; a retried pass replaces its earlier entry. */
  picks: readonly Pick[];
}

export type GameAction =
  | { type: 'start' }
  | { type: 'select'; option: string }
  | { type: 'confirm' }
  | { type: 'retry' }
  | { type: 'twist' }
  | { type: 'next' }
  | { type: 'restart' };

export const INITIAL_STATE: GameState = Object.freeze({ phase: 'intro', round: 0, pass: 'base', selected: null, picks: [] });

/**
 * Returns the pass being played.
 *
 * @param state Current game state.
 * @returns The base or twist pass of the current round.
 */
export function currentPass(state: GameState): Pass {
  const round = ROUNDS[state.round];
  return state.pass === 'twist' ? round.twist : round.base;
}

/**
 * Returns the result of the confirmed choice.
 *
 * @param state A state in the `result` phase.
 * @returns The result for the selected option, or null outside the result phase.
 */
export function currentResult(state: GameState): Result | null {
  if (state.phase !== 'result' || !state.selected) return null;
  return currentPass(state).results[state.selected] ?? null;
}

/**
 * Applies one player action.
 *
 * @param state Current game state.
 * @param action What the player did.
 * @returns The next state, or the same object when the action does not apply.
 */
export function reduce(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'start':
      return state.phase === 'intro' ? { ...state, phase: 'choose' } : state;
    case 'select': {
      if (state.phase !== 'choose' || state.selected === action.option) return state;
      return currentPass(state).options.some((o) => o.id === action.option) ? { ...state, selected: action.option } : state;
    }
    case 'confirm': {
      if (state.phase !== 'choose' || !state.selected) return state;
      const round = ROUNDS[state.round];
      const pick: Pick = { round: round.id, pass: state.pass, option: state.selected, outcome: currentPass(state).results[state.selected].outcome };
      const picks = [...state.picks.filter((p) => !(p.round === pick.round && p.pass === pick.pass)), pick];
      return { ...state, phase: 'result', picks };
    }
    case 'retry':
      return state.phase === 'result' ? { ...state, phase: 'choose', selected: null } : state;
    case 'twist':
      return state.phase === 'result' && state.pass === 'base' ? { ...state, phase: 'choose', pass: 'twist', selected: null } : state;
    case 'next':
      if (state.phase !== 'result') return state;
      if (state.round === ROUNDS.length - 1) return { ...state, phase: 'done', selected: null };
      return { ...state, phase: 'choose', round: state.round + 1, pass: 'base', selected: null };
    case 'restart':
      return state === INITIAL_STATE ? state : { ...INITIAL_STATE, phase: 'choose' };
  }
}

/**
 * Summarises a finished run.
 *
 * @param picks The player's picks.
 * @returns How many passes were played and how many ended with a viable fix.
 */
export function score(picks: readonly Pick[]): { played: number; viable: number } {
  return { played: picks.length, viable: picks.filter((p) => p.outcome === 'viable').length };
}
