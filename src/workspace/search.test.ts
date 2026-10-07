import { describe, expect, it } from 'vitest';
import { MAX_RESULTS, search, type SearchableApp } from './search';

const APPS: SearchableApp[] = [
  { id: 'projects', title: 'Projects', description: 'Case studies' },
  { id: 'terminal', title: 'Terminal', description: 'Portfolio commands' },
  { id: 'settings', title: 'Settings', description: 'Appearance and wallpaper' },
];

const titles = (q: string) => search(q, APPS).map((r) => `${r.kind}:${r.title}`);

describe('spotlight search', () => {
  it('lists the apps for an empty query', () => {
    expect(titles('  ')).toEqual(['app:Projects', 'app:Terminal', 'app:Settings']);
  });

  it('ranks exact and prefix title matches above matches in the details', () => {
    expect(titles('spectra')[0]).toBe('project:Spectra');
    expect(titles('wall')).toEqual(['app:Settings']);
    expect(titles('pro')[0]).toBe('app:Projects');
    expect(titles('pro')).toContain('command:projects');
  });

  it('matches the start of any word, case-insensitively', () => {
    expect(titles('AGENT')).toEqual(['project:WP Agent AI']);
    expect(titles('lms')).toContain('project:Masteriyo LMS');
  });

  it('finds projects by technology', () => {
    expect(titles('server-sent')).toEqual(['project:WP Agent AI']);
  });

  it('offers terminal commands except the ones that only work inside a terminal', () => {
    expect(titles('resume')).toEqual(['command:resume']);
    expect(titles('exit')).toEqual([]);
    expect(titles('clear')).toEqual([]);
  });

  it('treats hostile input as plain text with no results', () => {
    for (const q of ['<script>alert(1)</script>', '$(id)', '; rm -rf /', '.*', '../../etc/passwd']) expect(search(q, APPS)).toEqual([]);
  });

  it('caps the number of results', () => {
    expect(search('e', APPS).length).toBeLessThanOrEqual(MAX_RESULTS);
  });
});
