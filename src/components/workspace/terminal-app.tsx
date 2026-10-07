'use client';

import { useEffect, useRef, useState } from 'react';
import { MAX_INPUT_LENGTH, candidates, complete, pushHistory, run, type Context, type Effect, type Line } from '@/workspace/terminal';

interface Entry {
  id: number;
  input?: string;
  lines: Line[];
}

interface TerminalAppProps {
  ctx: Context;
  onEffect: (effect: Effect) => void;
}

const SUGGESTED = ['help', 'about', 'projects', 'journey', 'resume', 'contact'];
const WELCOME: Entry = { id: 0, lines: [{ kind: 'text', text: 'Welcome to Ganesh Workspace. Type help, or pick a command below.', tone: 'muted' }] };

/**
 * Simulated portfolio terminal with history, Tab completion that never traps focus,
 * and clickable command chips as an alternative to typing.
 */
export function TerminalApp({ ctx, onEffect }: TerminalAppProps) {
  const [entries, setEntries] = useState<Entry[]>([WELCOME]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const nextId = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [entries]);

  const submit = (input: string) => {
    const result = run(input, ctx);
    setHistory((h) => pushHistory(h, input));
    setCursor(null);
    setValue('');
    if (result.effect?.type === 'clear') {
      setEntries([]);
      return;
    }
    setEntries((list) => [...list, { id: nextId.current++, input, lines: result.lines }]);
    if (result.effect) onEffect(result.effect);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      const completion = complete(value);
      if (completion.changed) {
        e.preventDefault();
        setValue(completion.value);
      }
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (history.length === 0) return;
      e.preventDefault();
      const last = history.length - 1;
      const next = e.key === 'ArrowUp' ? (cursor === null ? last : Math.max(0, cursor - 1)) : cursor === null ? null : cursor + 1 > last ? null : cursor + 1;
      setCursor(next);
      setValue(next === null ? '' : history[next]);
    }
  };

  const matches = value.trim() ? candidates(value) : [];
  const hint = matches.length > 1 ? `Matches: ${matches.join(', ')}` : '';

  return (
    <div className="gw-term">
      <div ref={logRef} className="gw-term-log" role="log" aria-live="polite" aria-label="Terminal output">
        {entries.map((entry) => (
          <div key={entry.id} className="gw-term-entry">
            {entry.input !== undefined && (
              <p className="gw-term-echo">
                <span className="gw-term-prompt" aria-hidden="true">ganesh@workspace ~ %</span> {entry.input}
              </p>
            )}
            {entry.lines.map((line, i) => (
              <TerminalLine key={i} line={line} onCommand={submit} />
            ))}
          </div>
        ))}
      </div>
      <form
        className="gw-term-input"
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
      >
        <label htmlFor="gw-term-field">
          <span aria-hidden="true">ganesh@workspace ~ %</span>
          <span className="sr-only">Command</span>
        </label>
        <input
          id="gw-term-field"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setCursor(null);
          }}
          onKeyDown={onKeyDown}
          maxLength={MAX_INPUT_LENGTH}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-describedby="gw-term-hint"
        />
      </form>
      <p id="gw-term-hint" className="gw-term-hint" aria-live="polite">{hint}</p>
      <div className="gw-term-chips" role="group" aria-label="Run a command">
        {SUGGESTED.map((c) => (
          <button key={c} type="button" onClick={() => submit(c)}>{c}</button>
        ))}
      </div>
    </div>
  );
}

function TerminalLine({ line, onCommand }: { line: Line; onCommand: (command: string) => void }) {
  if (line.kind === 'text') return <p data-tone={line.tone}>{line.text}</p>;
  if (line.kind === 'commands') {
    return (
      <p className="gw-term-cmds">
        {line.commands.map((c) => (
          <button key={c} type="button" className="gw-term-cmd" onClick={() => onCommand(c)}>{c}</button>
        ))}
      </p>
    );
  }
  if (line.kind === 'command') {
    return (
      <p>
        <button type="button" className="gw-term-cmd" onClick={() => onCommand(line.command)}>{line.label}</button>
      </p>
    );
  }
  const external = line.href.startsWith('http');
  return (
    <p>
      <a href={line.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {line.label}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    </p>
  );
}
