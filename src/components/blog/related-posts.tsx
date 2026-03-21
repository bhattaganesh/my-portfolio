import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/types';
import { formatDate, readingTime, stripHtml } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-surface-200 dark:border-surface-800">
      <h2 className="text-xl font-bold font-display text-surface-900 dark:text-surface-100 mb-6">
        Related Posts
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden hover:border-primary-500/40 hover:shadow-md dark:hover:shadow-black/20 transition-all duration-200"
          >
            {post.featuredImage && (
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.featuredImage.node.altText || post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-4 flex flex-col gap-2 flex-1">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug line-clamp-2">
                {post.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-surface-500 dark:text-surface-400 mt-auto">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" aria-hidden="true" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {readingTime(stripHtml(post.content || ''))} min
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
