import { ImageResponse } from 'next/og';
import { LEGACY_PROJECT_SLUGS } from '@/content/work';
import { SITE_CONFIG } from '@/lib/constants';

export const dynamic = 'force-static';
export const alt = `${SITE_CONFIG.name} – work`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Legacy /projects/<slug>/ URLs, kept so old shared links still have a preview. */
export function generateStaticParams() {
  return Object.keys(LEGACY_PROJECT_SLUGS).map((slug) => ({ slug }));
}

/** Generic preview; the old project data it used to read contained unverified metrics. */
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: '#f6f3ec', color: '#16181c' }}>
        <div style={{ fontSize: 28, color: '#55595f' }}>{SITE_CONFIG.name}</div>
        <div style={{ fontSize: 80, fontWeight: 800, marginTop: 16 }}>Selected work</div>
      </div>
    ),
    size,
  );
}
