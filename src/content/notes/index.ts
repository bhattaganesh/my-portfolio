import fs from 'node:fs';
import path from 'node:path';
import { noteSchema, type Inline, type Note } from './schema';

/** Archived notes captured from the previous site; see docs/engineering-atlas/evidence.md for provenance. */
const ARCHIVE_DIR = path.join(process.cwd(), 'src', 'content', 'notes', 'archive');
/** Longest excerpt shown in listings and feeds. */
const EXCERPT_LENGTH = 180;

/**
 * Loads and validates every archived note. Build-time only.
 *
 * @param dir Folder of note JSON files.
 * @returns All notes, newest first.
 * @throws When a file is unreadable or fails validation, so a broken archive fails the build instead of shipping empty.
 */
export function loadNotes(dir: string = ARCHIVE_DIR): Note[] {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const result = noteSchema.safeParse(JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')));
      if (!result.success) throw new Error(`Invalid note ${file}: ${result.error.message}`);
      if (`${result.data.slug}.json` !== file) throw new Error(`Note ${file} has mismatched slug "${result.data.slug}"`);
      return result.data;
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * Notes Ganesh has approved for publication.
 *
 * @returns Published notes, newest first; empty until a note is approved.
 */
export function publishedNotes(): Note[] {
  return loadNotes().filter((note) => note.published);
}

function plain(inlines: Inline[]): string {
  return inlines.map((i) => ('value' in i ? i.value : plain(i.children))).join('');
}

/**
 * Builds a plain-text excerpt from a note's first paragraph.
 *
 * @param note The note.
 * @param max Maximum length before truncating at a word boundary.
 * @returns Plain text with no markup or entities.
 */
export function excerpt(note: Note, max: number = EXCERPT_LENGTH): string {
  const first = note.blocks.find((b) => b.type === 'paragraph');
  const text = first && 'inlines' in first ? plain(first.inlines).trim() : '';
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(' ', max)).trimEnd()}…`;
}
