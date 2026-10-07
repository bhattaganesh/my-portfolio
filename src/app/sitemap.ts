import type { MetadataRoute } from 'next';
import { publishedNotes } from '@/content/notes';
import { work } from '@/content/work';
import { SITE_CONFIG } from '@/lib/constants';

export const dynamic = 'force-static';

/** Canonical, trailing-slash URLs only; legacy redirect pages are deliberately left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_CONFIG.url}${path}`;
  return [
    { url: url('/'), priority: 1 },
    { url: url('/work/'), priority: 0.9 },
    ...work.map((item) => ({ url: url(`/work/${item.slug}/`), priority: item.flagship ? 0.8 : 0.6 })),
    { url: url('/journey/'), priority: 0.7 },
    { url: url('/contact/'), priority: 0.7 },
    { url: url('/lab/ship-it/'), priority: 0.4 },
    { url: url('/workspace/'), priority: 0.4 },
    ...publishedNotes().map((note) => ({ url: url(`/notes/${note.slug}/`), lastModified: note.publishedAt, priority: 0.6 })),
  ];
}
