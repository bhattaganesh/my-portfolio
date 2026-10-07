import { ImageResponse } from 'next/og';
import { loadNotes } from '@/content/notes';
import { SITE_CONFIG } from '@/lib/constants';

export const dynamic = 'force-static';
export const alt = `${SITE_CONFIG.name} – articles are being revised`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return loadNotes().map((note) => ({ slug: note.slug }));
}

/** Generic preview for legacy article URLs; it deliberately names no unpublished article. */
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: '#f6f3ec', color: '#16181c' }}>
        <div style={{ fontSize: 28, color: '#55595f' }}>{SITE_CONFIG.name}</div>
        <div style={{ fontSize: 72, fontWeight: 800, marginTop: 16 }}>Articles are being revised</div>
      </div>
    ),
    size,
  );
}
