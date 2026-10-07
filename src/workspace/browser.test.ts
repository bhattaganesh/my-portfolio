import { describe, expect, it } from 'vitest';
import { HOME, INITIAL_BROWSER, MAX_TABS, activeTab, browse, currentAddress, resolve, type BrowserAction, type BrowserState } from './browser';

const kind = (input: string) => resolve(input).route.kind;

describe('address resolution', () => {
  it('maps internal addresses, portfolio paths and portfolio URLs to the same pages', () => {
    for (const input of ['ganesh://work/spectra', 'GANESH://Work/Spectra/', '/work/spectra/', 'https://www.ganeshbhatt.com.np/work/spectra/', 'ganeshbhatt.com.np/work/spectra']) {
      expect(resolve(input), input).toEqual({ address: 'ganesh://work/spectra', route: { kind: 'case', slug: 'spectra' } });
    }
    expect(resolve('')).toEqual({ address: HOME, route: { kind: 'home' } });
    expect(kind('ganesh://github')).toBe('profile');
    expect(kind('ganesh://lab/ship-it')).toBe('shipit');
    expect(kind('ganesh://notes')).toBe('notes');
  });

  it('treats unknown internal pages and plain words as not found', () => {
    expect(kind('ganesh://work/not-a-project')).toBe('notFound');
    expect(kind('ganesh://settings')).toBe('notFound');
    expect(kind('spectra architecture')).toBe('notFound');
    expect(kind('/admin')).toBe('notFound');
  });

  it('turns other web addresses into explicit external links, always over https', () => {
    expect(resolve('https://example.com/a?b=1')).toEqual({ address: 'https://example.com/a?b=1', route: { kind: 'external', href: 'https://example.com/a?b=1' } });
    expect(resolve('http://example.com').route).toEqual({ kind: 'external', href: 'https://example.com/' });
    expect(resolve('github.com/bhattaganesh').route).toEqual({ kind: 'external', href: 'https://github.com/bhattaganesh' });
    expect(kind('https://www.ganeshbhatt.com.np/unknown/')).toBe('external');
  });

  it('blocks every non-web scheme and credentials in URLs, whatever their spelling', () => {
    for (const input of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', ' javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'vbscript:msgbox(1)', 'file:///etc/passwd', 'chrome://settings', 'https://user:pass@example.com']) {
      expect(kind(input), input).toBe('blocked');
    }
  });

  it('never resolves protocol-relative or whitespace-split schemes into links', () => {
    expect(kind('//evil.example/x')).toBe('notFound');
    expect(kind('java\tscript:alert(1)')).toBe('notFound');
    expect(kind('<img src=x onerror=alert(1)>')).toBe('notFound');
  });

  it('rejects overlong input before parsing', () => {
    expect(kind(`https://example.com/${'a'.repeat(3000)}`)).toBe('notFound');
  });
});

describe('tabs and history', () => {
  const run = (actions: BrowserAction[], from: BrowserState = INITIAL_BROWSER) => actions.reduce(browse, from);

  it('goes back and forward, and a new navigation drops the forward history', () => {
    let s = run([{ type: 'navigate', input: '/work/' }, { type: 'navigate', input: 'ganesh://work/masteriyo' }, { type: 'back' }]);
    expect(currentAddress(s)).toBe('ganesh://work');
    s = browse(s, { type: 'forward' });
    expect(currentAddress(s)).toBe('ganesh://work/masteriyo');
    s = run([{ type: 'back' }, { type: 'back' }, { type: 'navigate', input: 'ganesh://github' }], s);
    expect(activeTab(s).entries).toEqual([HOME, 'ganesh://github']);
    expect(browse(s, { type: 'forward' })).toBe(s);
  });

  it('does not add a history entry for the page already shown', () => {
    const s = browse(INITIAL_BROWSER, { type: 'navigate', input: 'ganesh://home' });
    expect(s).toBe(INITIAL_BROWSER);
  });

  it('keeps separate history per tab and caps the number of tabs', () => {
    let s = run([{ type: 'navigate', input: '/work/' }, { type: 'newTab' }]);
    expect(currentAddress(s)).toBe(HOME);
    s = browse(s, { type: 'switchTab', id: 1 });
    expect(currentAddress(s)).toBe('ganesh://work');
    for (let i = 0; i < 10; i++) s = browse(s, { type: 'newTab' });
    expect(s.tabs).toHaveLength(MAX_TABS);
    expect(browse(s, { type: 'newTab' })).toBe(s);
  });

  it('closing the active tab activates its neighbour, and closing the last one leaves a fresh tab', () => {
    let s = run([{ type: 'newTab' }, { type: 'newTab' }, { type: 'switchTab', id: 2 }, { type: 'closeTab', id: 2 }]);
    expect(s.tabs.map((t) => t.id)).toEqual([1, 3]);
    expect(s.active).toBe(3);
    s = run([{ type: 'closeTab', id: 1 }, { type: 'navigate', input: '/work/' }, { type: 'closeTab', id: 3 }], s);
    expect(s.tabs).toHaveLength(1);
    expect(currentAddress(s)).toBe(HOME);
    expect(browse(s, { type: 'closeTab', id: 99 })).toBe(s);
  });
});
