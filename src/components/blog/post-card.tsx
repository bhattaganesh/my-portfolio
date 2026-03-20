import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/lib/types';
import { formatDate, readingTime, stripHtml } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  post: BlogPost;
  className?: string;
  /**
   * When true the card uses a horizontal (landscape) layout
   * instead of the default vertical (portrait) card.
   */
  horizontal?: boolean;
  /** Mark as priority (eager load) for above-the-fold images (LCP). */
  priority?: boolean;
}

/** Deterministic gradient placeholder for posts without a featured image */
const GRADIENT_PLACEHOLDERS = [
  'linear-gradient(135deg, #1e2f7a 0%, #4c6ef5 100%)',
  'linear-gradient(135deg, #0d1b4b 0%, #3b5bdb 100%)',
  'linear-gradient(135deg, #1a1f4e 0%, #748ffc 100%)',
  'linear-gradient(135deg, #141f56 0%, #2b3f9e 100%)',
  'linear-gradient(135deg, #0f172a 0%, #4c6ef5 60%, #748ffc 100%)',
];

function gradientForSlug(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return GRADIENT_PLACEHOLDERS[hash % GRADIENT_PLACEHOLDERS.length];
}

export function PostCard({ post, className, horizontal = false, priority = false }: Props) {
  const primaryCategory = post.categories.nodes[0] ?? null;
  const imageNode = post.featuredImage?.node ?? null;
  const excerptText = stripHtml(post.excerpt).trim();
  const readMins = readingTime(post.content);

  return (
    <article
      className={cn(
        'group relative flex overflow-hidden rounded-2xl',
        'border border-surface-200 dark:border-surface-800',
        'bg-white dark:bg-surface-900',
        'shadow-sm hover:shadow-xl hover:shadow-surface-900/8 dark:hover:shadow-black/30',
        'hover:-translate-y-1.5 hover:border-primary-300/60 dark:hover:border-primary-700/40',
        'transition-all duration-300 ease-in-out',
        horizontal ? 'flex-row h-48' : 'flex-col h-full',
        className,
      )}
      aria-label={`Blog post: ${post.title}`}
    >
      {/* ── Image / Gradient header ── */}
      <div
        className={cn(
          'relative overflow-hidden shrink-0',
          horizontal ? 'w-48 h-full' : 'w-full aspect-video',
        )}
      >
        {imageNode ? (
          <Image
            src={imageNode.sourceUrl}
            alt={imageNode.altText || post.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={horizontal ? '192px' : '(max-width: 768px) 100vw, 33vw'}
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
            style={{ background: gradientForSlug(post.slug) }}
            aria-hidden="true"
          >
            {/* Decorative grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-15" aria-hidden="true" />
          </div>
        )}

        {/* Gradient fade into card body */}
        {!horizontal && (
          <div
            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(to top, rgba(255,255,255,0.05) 0%, transparent 100%)',
            }}
          />
        )}

        {/* Category badge — overlaid top-left */}
        {primaryCategory && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-semibold">
              <Tag className="w-2.5 h-2.5" aria-hidden="true" />
              {primaryCategory.name}
            </span>
          </div>
        )}
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col gap-3 p-5 flex-1 min-w-0">
        {/* Title */}
        <h3 className="font-display font-bold text-fluid-h3 leading-snug text-surface-900 dark:text-surface-50 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150">
          <Link
            href={`/blog/${post.slug}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-900 rounded-sm"
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {excerptText && (
          <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed line-clamp-3 flex-1">
            {excerptText}
          </p>
        )}

        {/* Footer: date + reading time + read more */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-surface-100 dark:border-surface-800 mt-auto">
          <div className="flex items-center gap-3 text-xs text-surface-400 dark:text-surface-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <time className="font-mono" dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {readMins} min read
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors duration-150 group/read shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
            aria-label={`Read more: ${post.title}`}
          >
            Read more
            <ArrowRight
              className="w-3 h-3 group-hover/read:translate-x-0.5 transition-transform duration-150"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
