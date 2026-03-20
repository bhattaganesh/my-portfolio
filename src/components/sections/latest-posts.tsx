import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { PostCard } from '@/components/blog/post-card';
import { SkeletonBlogPost } from '@/components/ui/skeleton';
import type { BlogPost } from '@/lib/types';

interface Props {
  posts: BlogPost[];
  loading?: boolean;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 rounded-2xl border-2 border-dashed border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50">
      <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
        <BookOpen className="w-7 h-7 text-primary-400" aria-hidden="true" />
      </div>
      <div className="text-center max-w-xs">
        <p className="text-base font-semibold text-surface-700 dark:text-surface-300">
          Blog posts coming soon
        </p>
        <p className="text-sm text-surface-400 dark:text-surface-500 mt-1 leading-relaxed">
          I&apos;m working on in-depth articles about full-stack development, WordPress, and React.
          Stay tuned!
        </p>
      </div>
    </div>
  );
}

export function LatestPosts({ posts, loading = false }: Props) {
  return (
    <section
      className="py-20 lg:py-28 bg-white dark:bg-surface-950"
      aria-label="Latest blog posts"
    >
      <Container>
        <div className="flex flex-col gap-12">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <ScrollReveal direction="up" delay={0}>
              <SectionHeading
                eyebrow="Writing"
                title="Latest from the blog"
                subtitle="Thoughts on software engineering, WordPress, and things I&apos;m learning."
                as="h2"
              />
            </ScrollReveal>

            {posts.length > 0 && (
              <ScrollReveal direction="right" delay={0.1} className="shrink-0">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors duration-150 group whitespace-nowrap"
                >
                  All Posts
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </Link>
              </ScrollReveal>
            )}
          </div>

          {/* Content */}
          {loading ? (
            /* Skeleton state */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {[0, 1, 2].map((i) => (
                <SkeletonBlogPost key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <ScrollReveal direction="up" delay={0.1}>
              <EmptyState />
            </ScrollReveal>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
              role="list"
              aria-label="Latest blog posts"
            >
              {posts.slice(0, 3).map((post, idx) => (
                <ScrollReveal key={post.id} direction="up" delay={idx * 0.1} className="h-full">
                  <PostCard post={post} priority={idx < 3} />
                </ScrollReveal>
              ))}
            </div>
          )}

        </div>
      </Container>
    </section>
  );
}

export default LatestPosts;
