import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { excerpt, loadNotes, publishedNotes } from './index';

describe('archived notes', () => {
  it('loads all six archived notes, newest first, and none is published before Ganesh approves it', () => {
    const notes = loadNotes();
    expect(notes).toHaveLength(6);
    expect(notes.map((n) => n.publishedAt)).toEqual([...notes.map((n) => n.publishedAt)].sort().reverse());
    expect(publishedNotes()).toEqual([]);
  });

  it('produces plain-text excerpts without markup or raw entities', () => {
    for (const note of loadNotes()) {
      const text = excerpt(note);
      expect(text.length, note.slug).toBeGreaterThan(20);
      expect(text.length, note.slug).toBeLessThanOrEqual(181);
      expect(text, note.slug).not.toMatch(/<[a-z]|&[#a-z0-9]+;/i);
    }
  });

  it('fails loudly on an invalid or mismatched file instead of skipping it', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'notes-'));
    fs.writeFileSync(path.join(dir, 'bad.json'), JSON.stringify({ slug: 'bad', title: 'x' }));
    expect(() => loadNotes(dir)).toThrow(/Invalid note bad\.json/);
    const good = loadNotes()[0];
    fs.writeFileSync(path.join(dir, 'bad.json'), JSON.stringify({ ...good, blocks: [{ type: 'paragraph', inlines: [{ t: 'link', href: 'javascript:alert(1)', children: [] }] }] }));
    expect(() => loadNotes(dir)).toThrow(/Invalid note/);
    fs.rmSync(path.join(dir, 'bad.json'));
    fs.writeFileSync(path.join(dir, 'other.json'), JSON.stringify(good));
    expect(() => loadNotes(dir)).toThrow(/mismatched slug/);
    fs.rmSync(dir, { recursive: true });
  });
});
