import { ImageResponse } from 'next/og';
import { getPostBySlug, getAllPostSlugs } from '@/lib/wordpress';
import { stripHtml } from '@/lib/utils';

export const alt = 'Blog post by Ganesh Prasad Bhatt';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Image(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  const title = post?.title ?? 'Blog Post';
  const date = post?.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  const excerpt = post?.excerpt ? stripHtml(post.excerpt).slice(0, 120) : '';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {date && (
            <div
              style={{
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '20px',
              }}
            >
              {date}
            </div>
          )}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.2,
              marginBottom: '20px',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          {excerpt && (
            <div
              style={{
                fontSize: '22px',
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: 1.4,
                maxWidth: '800px',
              }}
            >
              {excerpt}
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(76, 110, 245, 0.4)',
              fontSize: '20px',
              fontWeight: 700,
              color: 'white',
            }}
          >
            GB
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>
              Ganesh Prasad Bhatt
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>
              ganeshbhatt.com.np
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
