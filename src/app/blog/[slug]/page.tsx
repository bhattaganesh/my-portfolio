import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { getPostBySlug, getAllPostSlugs } from '@/lib/wordpress';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { formatDate, readingTime, stripHtml } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<'/blog/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: 'Post Not Found' };

  const description = stripHtml(post.excerpt || '').slice(0, 160) || stripHtml(post.content?.slice(0, 160) || '');

  return {
    title: `${post.title} – Ganesh Prasad Bhatt`,
    description,
    alternates: {
      canonical: `${SITE_CONFIG.url}/blog/${slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: post.featuredImage ? [post.featuredImage.node.sourceUrl] : [],
    },
  };
}

export default async function BlogPostPage(
  props: PageProps<'/blog/[slug]'>,
) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const readTime = readingTime(stripHtml(post.content || ''));

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.name,
      url: `${SITE_CONFIG.url}/about`,
    },
    publisher: {
      '@type': 'Person',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/blog/${slug}`,
    },
    ...(post.featuredImage && {
      image: post.featuredImage.node.sourceUrl,
    }),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_CONFIG.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_CONFIG.url}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_CONFIG.url}/blog/${slug}`,
      },
    ],
  };

  return (
    <div className="pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Container className="max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Category badges */}
        {post.categories.nodes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.nodes.map((cat) => (
              <Badge key={cat.slug}>{cat.name}</Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-surface-900 dark:text-surface-50 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-surface-500 dark:text-surface-400 text-sm mb-8">
          <Link
            href="/about"
            className="flex items-center gap-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <User className="w-4 h-4" />
            {SITE_CONFIG.name}
          </Link>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {readTime} min read
          </span>
        </div>

        {/* Featured image */}
        {post.featuredImage && (
          <div className="relative aspect-video w-full mb-10 rounded-2xl overflow-hidden">
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Post content */}
        <div
          className={[
            'prose prose-surface dark:prose-invert max-w-none',
            'prose-headings:font-display',
            'prose-a:text-primary-600 dark:prose-a:text-primary-400',
            'prose-code:font-mono prose-code:text-sm',
            'prose-img:rounded-xl',
            'prose-pre:rounded-xl',
          ].join(' ')}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags (if present) */}
        {post.tags && post.tags.nodes.length > 0 && (
          <div className="mt-10 pt-8 border-t border-surface-200 dark:border-surface-800">
            <p className="text-xs font-medium text-surface-400 uppercase tracking-widest mb-3">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.nodes.map((tag) => (
                <Badge key={tag.slug} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-surface-200 dark:border-surface-800">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </Container>
    </div>
  );
}
