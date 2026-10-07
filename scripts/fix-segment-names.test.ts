import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { fixSegmentNames } from './fix-segment-names.mjs';

let root: string;

const make = (files: string[]) => {
  root = mkdtempSync(path.join(tmpdir(), 'segments-'));
  for (const file of files) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), file);
  }
};
const list = () =>
  readdirSync(root, { recursive: true, withFileTypes: true })
    .map((entry) => path.relative(root, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'))
    .sort();

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('fixSegmentNames', () => {
  it('flattens the nested layout a Windows export writes', () => {
    make([
      '__next.__PAGE__.txt',
      'work/__next._tree.txt',
      'work/__next.work.txt',
      'work/__next.work/__PAGE__.txt',
      'work/spectra/__next.work.txt',
      'work/spectra/__next.work/$d$slug.txt',
      'work/spectra/__next.work/$d$slug/__PAGE__.txt',
      '_next/static/chunks/a.js',
    ]);
    expect(fixSegmentNames(root)).toBe(3);
    expect(list()).toEqual([
      '__next.__PAGE__.txt',
      '_next',
      '_next/static',
      '_next/static/chunks',
      '_next/static/chunks/a.js',
      'work',
      'work/__next._tree.txt',
      'work/__next.work.__PAGE__.txt',
      'work/__next.work.txt',
      'work/spectra',
      'work/spectra/__next.work.$d$slug.__PAGE__.txt',
      'work/spectra/__next.work.$d$slug.txt',
      'work/spectra/__next.work.txt',
    ]);
  });

  it('is a no-op on an already-dotted (Linux) export', () => {
    make(['work/__next.work.txt', 'work/__next.work.__PAGE__.txt', 'index.html']);
    const before = list();
    expect(fixSegmentNames(root)).toBe(0);
    expect(list()).toEqual(before);
  });

  it('refuses to overwrite an existing dotted file', () => {
    make(['work/__next.work/__PAGE__.txt', 'work/__next.work.__PAGE__.txt']);
    expect(() => fixSegmentNames(root)).toThrow(/Refusing to overwrite/);
  });
});
