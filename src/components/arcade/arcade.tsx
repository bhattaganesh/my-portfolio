'use client';

import { useEffect, useRef, useState } from 'react';
import { arcadeStorage, loadBests, NO_SCORES, type Bests, type GameId } from '@/arcade/scores';
import { MergeGame } from './merge-game';
import { RunnerGame } from './runner-game';
import { SnakeGame } from './snake-game';
import './arcade.css';

interface GameCard {
  id: GameId;
  title: string;
  blurb: string;
  controls: string;
  art: React.ReactNode;
}

const GAMES: readonly GameCard[] = [
  {
    id: 'runner',
    title: 'Summit Run',
    blurb: 'An endless trail run in the Himalayas. Jump the rocks, duck the choughs, and keep going into the night.',
    controls: 'Space / ↑ jump · ↓ duck · tap',
    art: (
      <svg viewBox="0 0 120 64" aria-hidden="true" focusable="false">
        <path d="M0 50 L18 30 L28 38 L46 14 L62 34 L76 22 L96 42 L120 28 V64 H0 Z" fill="currentColor" opacity="0.18" />
        <rect x="0" y="52" width="120" height="1.5" fill="currentColor" />
        <g fill="currentColor">
          <rect x="22" y="34" width="9" height="12" rx="1" />
          <rect x="24" y="30" width="6" height="5" />
          <rect x="22" y="46" width="3" height="6" />
          <rect x="28" y="46" width="3" height="6" />
        </g>
        <rect x="18" y="35" width="5" height="8" fill="var(--arc-accent)" />
        <rect x="25" y="28" width="3" height="2" fill="var(--arc-accent)" />
        <path d="M70 52 a9 9 0 0 1 18 0 z M90 52 a6 6 0 0 1 12 0 z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'snake',
    title: 'Snake',
    blurb: 'The classic. Eat to grow, speed up as you go, and never bite your own tail.',
    controls: 'Arrows / WASD · swipe',
    art: (
      <svg viewBox="0 0 120 64" aria-hidden="true" focusable="false">
        <g fill="currentColor">
          {[
            [20, 40], [30, 40], [40, 40], [50, 40], [50, 30], [60, 30], [70, 30], [80, 30], [80, 20],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="9" height="9" rx="2.5" opacity={1 - i * 0.06} />
          ))}
        </g>
        <circle cx="96" cy="24.5" r="4" fill="var(--arc-accent)" />
      </svg>
    ),
  },
  {
    id: 'merge',
    title: '2048',
    blurb: 'Slide the tiles, merge the twins, and reach 2048. Calm, clever and very hard to put down.',
    controls: 'Arrows / WASD · swipe',
    art: (
      <svg viewBox="0 0 120 64" aria-hidden="true" focusable="false">
        {[
          [34, 8, '2', 0.12],
          [62, 8, '4', 0.22],
          [34, 36, '8', 0.4],
          [62, 36, '16', 1],
        ].map(([x, y, label, o]) => (
          <g key={String(label)}>
            <rect x={Number(x)} y={Number(y)} width="24" height="22" rx="4" fill={label === '16' ? 'var(--arc-accent)' : 'currentColor'} opacity={Number(o)} />
            <text x={Number(x) + 12} y={Number(y) + 15} textAnchor="middle" fontSize="10" fontWeight="700" fill={label === '16' ? '#fff' : 'currentColor'}>
              {label}
            </text>
          </g>
        ))}
      </svg>
    ),
  },
];

/**
 * The Arcade: a game shelf with three real games and best scores remembered on this device.
 * Choosing a game opens it in place, with a Back button to return to the shelf.
 */
export function Arcade() {
  const [game, setGame] = useState<GameId | null>(null);
  const [bests, setBests] = useState<Bests>(NO_SCORES);
  const shelfRef = useRef<HTMLDivElement>(null);
  const lastPicked = useRef<GameId | null>(null);

  useEffect(() => {
    if (game !== null) return;
    // Scores live in the browser, so the shelf reads them after hydration and whenever it reappears.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBests(loadBests(arcadeStorage()));
    if (lastPicked.current) shelfRef.current?.querySelector<HTMLElement>(`[data-game="${lastPicked.current}"]`)?.focus();
  }, [game]);

  if (game) {
    const card = GAMES.find((g) => g.id === game)!;
    return (
      <div className="arc arc-playing">
        <div className="arc-top">
          <button type="button" className="arc-back" onClick={() => setGame(null)}>
            <span aria-hidden="true">‹</span> Games
          </button>
          <h3 className="arc-title">{card.title}</h3>
          <span className="arc-controls" aria-hidden="true">{card.controls}</span>
        </div>
        {game === 'runner' && <RunnerGame autoFocus />}
        {game === 'snake' && <SnakeGame autoFocus />}
        {game === 'merge' && <MergeGame autoFocus />}
      </div>
    );
  }

  return (
    <div className="arc" ref={shelfRef}>
      <div className="arc-hero">
        <p className="arc-eyebrow">Arcade</p>
        <h3 className="arc-title">Take a break</h3>
        <p className="arc-lead">Three games, built from scratch for this site. They work with a keyboard, a mouse or touch, and your best scores stay on this device.</p>
      </div>
      <ul className="arc-shelf">
        {GAMES.map((g) => (
          <li key={g.id}>
            <button
              type="button"
              className="arc-card"
              data-game={g.id}
              onClick={() => {
                lastPicked.current = g.id;
                setGame(g.id);
              }}
            >
              <span className="arc-art">{g.art}</span>
              <span className="arc-card-title">{g.title}</span>
              <span className="arc-card-blurb">{g.blurb}</span>
              <span className="arc-card-foot">
                <span>{g.controls}</span>
                <span>{bests[g.id] > 0 ? `Best ${bests[g.id]}` : 'Play'}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
