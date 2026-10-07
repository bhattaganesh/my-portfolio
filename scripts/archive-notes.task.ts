import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { htmlToBlocks } from '../src/content/notes/html-to-blocks';
import { noteSchema } from '../src/content/notes/schema';

const SNAPSHOT_DIR = path.join(__dirname, '..', 'docs', 'engineering-atlas', 'baseline', 'live-posts');
const OUT_DIR = path.join(__dirname, '..', 'src', 'content', 'notes', 'archive');
const SITE = 'https://www.ganeshbhatt.com.np';

test('archive the saved live posts as structured notes', async ({ page }) => {
  await page.setContent('<!doctype html><title>archive</title>');
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const files = fs.readdirSync(SNAPSHOT_DIR).filter((f) => f.endsWith('.html'));
  expect(files.length).toBeGreaterThan(0);

  for (const file of files) {
    const slug = path.basename(file, '.html');
    const html = fs.readFileSync(path.join(SNAPSHOT_DIR, file), 'utf8');
    const extracted = await page.evaluate((source) => {
      const doc = new DOMParser().parseFromString(source, 'text/html');
      const ld = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'))
        .map((s) => {
          try {
            return JSON.parse(s.textContent ?? '');
          } catch {
            return null;
          }
        })
        .find((d) => d?.['@type'] === 'BlogPosting');
      return {
        title: doc.querySelector('h1')?.textContent?.trim() ?? '',
        publishedAt: doc.querySelector('time[datetime]')?.getAttribute('datetime') ?? (typeof ld?.datePublished === 'string' ? ld.datePublished : ''),
        body: doc.querySelector('.prose')?.innerHTML ?? '',
      };
    }, html);
    expect(extracted.body, `${slug}: article body`).not.toBe('');

    const sourceUrl = `${SITE}/blog/${slug}/`;
    const blocks = await page.evaluate(htmlToBlocks, { html: extracted.body, base: sourceUrl });
    const note = noteSchema.parse({
      slug,
      title: extracted.title,
      publishedAt: extracted.publishedAt,
      published: false,
      provenance: {
        sourceUrl,
        capturedFrom: `docs/engineering-atlas/baseline/live-posts/${file}`,
        capturedAt: fs.statSync(path.join(SNAPSHOT_DIR, file)).mtime.toISOString().slice(0, 10),
      },
      blocks,
    });
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.json`), `${JSON.stringify(note, null, 2)}\n`);
  }
});
