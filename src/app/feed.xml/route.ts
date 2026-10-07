import { excerpt, publishedNotes } from '@/content/notes';
import { SITE_CONFIG } from '@/lib/constants';

export const dynamic = 'force-static';

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/** RSS feed of approved notes only; it stays valid with zero items until a note is published. */
export function GET() {
  const items = publishedNotes()
    .map((note) => {
      const link = `${SITE_CONFIG.url}/notes/${note.slug}/`;
      return `
    <item>
      <title>${escapeXml(note.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(excerpt(note))}</description>
      <pubDate>${new Date(note.publishedAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)}</title>
    <link>${SITE_CONFIG.url}/</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>en</language>
    <atom:link href="${SITE_CONFIG.url}/feed.xml" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
