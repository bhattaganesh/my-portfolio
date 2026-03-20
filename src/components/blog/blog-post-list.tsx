'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GraphQLClient } from 'graphql-request';
import { BookOpen, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WORDPRESS_GRAPHQL_ENDPOINT, GET_POSTS } from '@/lib/wordpress';
import type { BlogPost, PageInfo } from '@/lib/types';
import { PostCard } from '@/components/blog/post-card';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

const POSTS_PER_PAGE = 9;
const ALL_CATEGORY = 'all';

interface PostsResponse {
  posts: {
    nodes: BlogPost[];
    pageInfo: PageInfo;
  };
}

async function fetchPosts(after?: string): Promise<{ posts: BlogPost[]; pageInfo: PageInfo }> {
  const client = new GraphQLClient(WORDPRESS_GRAPHQL_ENDPOINT);
  const data = await client.request<PostsResponse>(GET_POSTS, {
    first: POSTS_PER_PAGE,
    after: after ?? null,
  });
  return { posts: data.posts.nodes, pageInfo: data.posts.pageInfo };
}

export function BlogPostList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({ hasNextPage: false, endCursor: null });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchPosts();
      setPosts(data.posts);
      setPageInfo(data.pageInfo);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  async function handleLoadMore() {
    if (!pageInfo.endCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchPosts(pageInfo.endCursor);
      setPosts((prev) => [...prev, ...data.posts]);
      setPageInfo(data.pageInfo);
    } catch {
      setError(true);
    } finally {
      setLoadingMore(false);
    }
  }

  // Extract unique categories from all loaded posts
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const post of posts) {
      for (const cat of post.categories.nodes) {
        if (!map.has(cat.slug)) {
          map.set(cat.slug, cat.name);
        }
      }
    }
    // Sort alphabetically by name
    return Array.from(map.entries())
      .sort(([, a], [, b]) => a.localeCompare(b))
      .map(([slug, name]) => ({ slug, name }));
  }, [posts]);

  // Filter posts by active category
  const filteredPosts = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return posts;
    return posts.filter((post) =>
      post.categories.nodes.some((cat) => cat.slug === activeCategory),
    );
  }, [posts, activeCategory]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-surface-200 dark:bg-surface-800" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-surface-200 dark:bg-surface-800 rounded w-3/4" />
              <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-full" />
              <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20 rounded-2xl border-2 border-dashed border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50">
        <p className="text-base font-semibold text-surface-700 dark:text-surface-300">
          Failed to load posts
        </p>
        <button
          type="button"
          onClick={loadInitial}
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold',
            'bg-primary-600 hover:bg-primary-500 text-white',
            'transition-all duration-200',
          )}
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
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
            I write about WordPress, React, and full-stack development.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Category filter pills */}
      {categories.length > 1 && (
        <nav className="flex flex-wrap gap-2 mb-8" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => setActiveCategory(ALL_CATEGORY)}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              activeCategory === ALL_CATEGORY
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700',
            )}
          >
            All
          </button>
          {categories.map(({ slug, name }) => (
            <button
              key={slug}
              type="button"
              onClick={() => setActiveCategory(slug)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                activeCategory === slug
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700',
              )}
            >
              {name}
            </button>
          ))}
        </nav>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredPosts.map((post, idx) => (
          <ScrollReveal key={post.id} direction="up" delay={idx * 0.08} className="h-full">
            <PostCard post={post} priority={idx < 3} />
          </ScrollReveal>
        ))}
      </div>

      {/* Empty state for filtered results */}
      {filteredPosts.length === 0 && activeCategory !== ALL_CATEGORY && (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
            No posts in this category yet.
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory(ALL_CATEGORY)}
            className="text-sm font-semibold text-primary-500 hover:text-primary-400 transition-colors"
          >
            View all posts
          </button>
        </div>
      )}

      {pageInfo.hasNextPage && (
        <nav className="flex items-center justify-center py-8" aria-label="Load more posts">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold',
              'bg-primary-600 hover:bg-primary-500 text-white',
              'hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary-500/25',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0',
            )}
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Loading…
              </>
            ) : (
              'Load More Posts'
            )}
          </button>
        </nav>
      )}
    </>
  );
}
