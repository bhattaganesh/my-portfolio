import { describe, expect, it } from 'vitest';
import { GOAL, canMove, initialMerge, move, slideLine, type MergeState } from './merge';
import { initialSnake, snake, snakeInterval, type SnakeState } from './snake';

describe('Snake engine', () => {
  const start = (seed = 1): SnakeState => snake(initialSnake(seed), { type: 'restart', seed });
  const ticks = (s: SnakeState, n: number) => Array.from({ length: n }).reduce<SnakeState>((acc) => snake(acc, { type: 'tick' }), s);

  it('starts on the first turn or arrow in the travel direction, never on a reversal', () => {
    const ready = initialSnake(1);
    expect(snake(ready, { type: 'turn', dir: 'left' })).toBe(ready);
    expect(snake(ready, { type: 'tick' })).toBe(ready);
    expect(snake(ready, { type: 'turn', dir: 'right' }).phase).toBe('running');
    expect(snake(ready, { type: 'turn', dir: 'up' }).queue).toEqual(['up']);
  });

  it('moves one cell per tick and keeps its length without food', () => {
    const s = { ...start(), food: { x: 0, y: 0 } };
    const next = snake(s, { type: 'tick' });
    expect(next.body[0]).toEqual({ x: s.body[0].x + 1, y: s.body[0].y });
    expect(next.body).toHaveLength(3);
  });

  it('grows and scores when eating, and places new food on a free cell', () => {
    const s = start(3);
    const fed = snake({ ...s, food: { x: s.body[0].x + 1, y: s.body[0].y } }, { type: 'tick' });
    expect(fed.body).toHaveLength(4);
    expect(fed.score).toBe(1);
    expect(fed.food).not.toBeNull();
    expect(fed.body.some((c) => c.x === fed.food!.x && c.y === fed.food!.y)).toBe(false);
  });

  it('queues two quick turns so a U-turn inside one tick works, but never reverses into itself', () => {
    let s: SnakeState = { ...start(), food: { x: 0, y: 0 } };
    s = snake(snake(s, { type: 'turn', dir: 'up' }), { type: 'turn', dir: 'left' });
    expect(s.queue).toEqual(['up', 'left']);
    s = ticks(s, 2);
    expect(s.dir).toBe('left');
    expect(s.phase).toBe('running');
    expect(snake(s, { type: 'turn', dir: 'right' })).toBe(s);
  });

  it('ends at a wall and when biting itself', () => {
    expect(ticks({ ...start(), food: { x: 0, y: 0 } }, 20).phase).toBe('over');
    let s: SnakeState = { ...start(), body: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }], dir: 'right', food: { x: 0, y: 0 } };
    s = snake(snake(s, { type: 'turn', dir: 'down' }), { type: 'tick' });
    expect(s.phase).toBe('over');
  });

  it('may move into the cell the tail is leaving', () => {
    const s: SnakeState = { ...start(), body: [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }], dir: 'up', queue: ['left'], food: { x: 0, y: 0 } };
    expect(snake(s, { type: 'tick' }).phase).toBe('running');
  });

  it('wins when the board is full', () => {
    const s: SnakeState = { ...initialSnake(1, 2), phase: 'running', body: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }], dir: 'down', food: { x: 0, y: 1 } };
    expect(snake(s, { type: 'tick' }).phase).toBe('won');
  });

  it('is deterministic and speeds up as it grows, within a floor', () => {
    expect(initialSnake(9)).toEqual(initialSnake(9));
    expect(snakeInterval(10)).toBeLessThan(snakeInterval(0));
    expect(snakeInterval(1000)).toBe(65);
  });
});

describe('2048 engine', () => {
  const board = (rows: number[][]): MergeState => ({ ...initialMerge(1), board: rows.flat() });

  it('merges each pair once, towards the move', () => {
    expect(slideLine([2, 2, 2, 2]).line).toEqual([4, 4, 0, 0]);
    expect(slideLine([2, 2, 4, 0]).line).toEqual([4, 4, 0, 0]);
    expect(slideLine([4, 0, 0, 4])).toEqual({ line: [8, 0, 0, 0], points: 8, merged: [0] });
    expect(slideLine([2, 4, 2, 4]).line).toEqual([2, 4, 2, 4]);
  });

  it('moves in all four directions and adds one tile after a real move', () => {
    const s = board([
      [2, 0, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const left = move(s, 'left');
    expect(left.board[0]).toBe(4);
    expect(left.score).toBe(4);
    expect(left.board.filter((v) => v !== 0)).toHaveLength(2);
    expect(move(s, 'down').board[12]).toBe(2);
    expect(move(s, 'down').board[15]).toBe(2);
    expect(move(s, 'right').board[3]).toBe(4);
  });

  it('returns the same state when nothing can move that way', () => {
    const s = board([
      [2, 4, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    expect(move(s, 'left')).toBe(s);
    expect(move(s, 'up')).toBe(s);
  });

  it('detects the end of the game and the goal tile', () => {
    const stuck = [2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2];
    expect(canMove(stuck)).toBe(false);
    const almost = board([
      [1024, 1024, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    expect(move(almost, 'left').won).toBe(true);
    expect(move(almost, 'left').board[0]).toBe(GOAL);
    const over = { ...almost, over: true };
    expect(move(over, 'left')).toBe(over);
  });

  it('starts with two tiles and is deterministic', () => {
    const s = initialMerge(11);
    expect(s.board.filter((v) => v !== 0)).toHaveLength(2);
    expect(initialMerge(11)).toEqual(s);
  });
});
