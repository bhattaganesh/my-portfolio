import { ImageResponse } from 'next/og';
import { projects } from '@/data/projects';

export const alt = 'Project by Ganesh Prasad Bhatt';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);

  const title = project?.title ?? 'Project';
  const excerpt = project?.excerpt ?? '';
  const techStack = project?.techStack?.slice(0, 5) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e2f7a 0%, #4c6ef5 50%, #748ffc 100%)',
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
          <div
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            Project
          </div>
          <div
            style={{
              fontSize: '52px',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.2,
              marginBottom: '20px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.75)',
              lineHeight: 1.4,
              maxWidth: '800px',
            }}
          >
            {excerpt}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {techStack.map((tech) => (
            <div
              key={tech}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                fontSize: '16px',
                color: 'white',
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
