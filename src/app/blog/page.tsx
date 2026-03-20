import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { BlogPostList } from '@/components/blog/blog-post-list';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Blog – Ganesh Prasad Bhatt',
  description:
    'Technical articles on WordPress, React, PHP, and full-stack development by Ganesh Prasad Bhatt.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
};

export default function BlogPage() {
  return (
    <div className="pt-24 pb-16">
      <Container>
        <ScrollReveal direction="up" delay={0}>
          <SectionHeading
            as="h1"
            title="Blog"
            subtitle="Thoughts on WordPress, React, performance, and the craft of building software"
            className="mb-12"
          />
        </ScrollReveal>

        <BlogPostList />
      </Container>
    </div>
  );
}
