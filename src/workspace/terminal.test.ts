import { describe, expect, it } from 'vitest';
import { HISTORY_LIMIT, MAX_INPUT_LENGTH, complete, editDistance, pushHistory, run } from './terminal';

const ctx = { resumeHref: null };
const allText = (input: string) =>
  run(input, ctx)
    .lines.map((l) => (l.kind === 'text' ? l.text : l.kind === 'commands' ? l.commands.join(' ') : l.label))
    .join('\n');

describe('terminal commands', () => {
  it('answers every listed command without an error line', () => {
    for (const c of ['help', 'about', 'projects', 'journey', 'skills', 'notes', 'resume', 'contact']) {
      const lines = run(c, ctx).lines;
      expect(lines.length, c).toBeGreaterThan(0);
      expect(lines.some((l) => l.kind === 'text' && l.tone === 'error'), c).toBe(false);
    }
  });

  it('is case-insensitive and ignores surrounding whitespace', () => {
    expect(run('  HeLp  ', ctx)).toEqual(run('help', ctx));
  });

  it('returns effects for clear, exit and opening a project', () => {
    expect(run('clear', ctx).effect).toEqual({ type: 'clear' });
    expect(run('exit', ctx).effect).toEqual({ type: 'exit' });
    expect(run('projects Spectra', ctx).effect).toEqual({ type: 'openProject', slug: 'spectra' });
  });

  it('rejects unknown projects and extra arguments', () => {
    expect(run('projects nope', ctx).effect).toBeUndefined();
    expect(allText('projects nope')).toMatch(/No project called/);
    expect(allText('about me')).toMatch(/doesn't take arguments/);
  });

  it('suggests a close command for typos and help otherwise', () => {
    expect(allText('jouney')).toMatch(/Did you mean journey\?/);
    expect(allText('zzzzzzzz')).toMatch(/Try help/);
  });

  it('treats hostile input as an unknown command and never echoes it as anything but text', () => {
    for (const input of ['; rm -rf /', '$(id)', '`whoami`', '<script>alert(1)</script>', '../../etc/passwd', 'sudo rm -rf /']) {
      const result = run(input, ctx);
      expect(result.effect, input).toBeUndefined();
      expect(result.lines.every((l) => l.kind === 'text' || l.kind === 'command'), input).toBe(true);
      expect(result.lines.some((l) => l.kind === 'command' && !['help', 'clear', 'exit', 'about', 'notes', 'skills', 'resume', 'contact', 'journey', 'projects'].includes(l.command)), input).toBe(false);
    }
  });

  it('rejects input over the length limit before parsing', () => {
    expect(allText('help'.padEnd(MAX_INPUT_LENGTH + 1, 'x'))).toMatch(/longer than/);
  });

  it('reports a missing résumé honestly and links one when it exists', () => {
    expect(allText('resume')).toMatch(/isn't published yet/);
    const withPdf = run('resume', { resumeHref: '/resume/cv.pdf' }).lines;
    expect(withPdf).toContainEqual({ kind: 'link', label: 'Download my résumé (PDF)', href: '/resume/cv.pdf' });
  });

  it('never presents an employer as current while employment is unconfirmed', () => {
    expect(allText('journey')).not.toMatch(/\b(now|present|currently)\b/i);
    expect(allText('journey')).toMatch(/joined Jan 2025 · Software Developer, Brainstorm Force/);
  });
});

describe('completion', () => {
  it('completes a unique command and adds a space when it takes an argument', () => {
    expect(complete('jou')).toMatchObject({ value: 'journey', changed: true });
    expect(complete('proj')).toMatchObject({ value: 'projects ', changed: true });
    expect(complete('projects sp')).toMatchObject({ value: 'projects spectra', changed: true });
  });

  it('reports no change when nothing can be extended, so Tab can move focus', () => {
    expect(complete('')).toMatchObject({ changed: false });
    expect(complete('zzz')).toMatchObject({ changed: false, candidates: [] });
    expect(complete('c')).toMatchObject({ changed: false, candidates: ['contact', 'clear'] });
    expect(complete('journey')).toMatchObject({ changed: false });
    expect(complete('help me')).toMatchObject({ changed: false });
  });

  it('completes an unambiguous partial word and leaves ambiguous project names alone', () => {
    expect(complete('cl')).toMatchObject({ value: 'clear', changed: true });
    expect(complete('projects ')).toMatchObject({ changed: false });
  });
});

describe('history and helpers', () => {
  it('skips blanks and repeats and caps its length', () => {
    let h: string[] = [];
    h = pushHistory(h, 'help');
    h = pushHistory(h, 'help');
    h = pushHistory(h, '   ');
    expect(h).toEqual(['help']);
    for (let i = 0; i < HISTORY_LIMIT + 10; i++) h = pushHistory(h, `cmd${i}`);
    expect(h).toHaveLength(HISTORY_LIMIT);
    expect(h[h.length - 1]).toBe(`cmd${HISTORY_LIMIT + 9}`);
  });

  it('computes edit distance', () => {
    expect(editDistance('jouney', 'journey')).toBe(1);
    expect(editDistance('', 'abc')).toBe(3);
  });
});
