import { GraphQLClient } from 'graphql-request';
import type { BlogPost, PageInfo } from '@/lib/types';

export const WORDPRESS_GRAPHQL_ENDPOINT =
  process.env.WORDPRESS_GRAPHQL_ENDPOINT ||
  'https://dev-ganesh-portfolio-api.pantheonsite.io/graphql';

function getClient(revalidate: number = 3600) {
  return new GraphQLClient(WORDPRESS_GRAPHQL_ENDPOINT, {
    headers: {},
    next: { revalidate },
  } as ConstructorParameters<typeof GraphQLClient>[1]);
}

// ─── BLOG POSTS ──────────────────────────────────────────────

export const GET_POSTS = `
  query GetPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id slug title excerpt content date modified
        featuredImage { node { sourceUrl altText mediaDetails { width height } } }
        categories { nodes { id name slug } }
      }
    }
  }
`;

const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id slug title content excerpt date modified
      featuredImage { node { sourceUrl altText mediaDetails { width height } } }
      categories { nodes { id name slug } }
      tags { nodes { id name slug } }
    }
  }
`;

const GET_ALL_POST_SLUGS = `
  query GetAllPostSlugs {
    posts(first: 100, where: { status: PUBLISH }) { nodes { slug } }
  }
`;

const GET_ALL_POST_SLUGS_WITH_DATES = `
  query GetAllPostSlugsWithDates {
    posts(first: 100, where: { status: PUBLISH }) { nodes { slug modified } }
  }
`;

export async function getPosts(
  first: number = 9,
  after?: string
): Promise<{ posts: BlogPost[]; pageInfo: PageInfo }> {
  try {
    const client = getClient();
    const data = await client.request<{
      posts: {
        nodes: BlogPost[];
        pageInfo: PageInfo;
      };
    }>(GET_POSTS, { first, after: after ?? null });
    return {
      posts: data.posts.nodes,
      pageInfo: data.posts.pageInfo,
    };
  } catch {
    return { posts: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const client = getClient();
    const data = await client.request<{ post: BlogPost | null }>(GET_POST_BY_SLUG, { slug });
    return data.post ?? null;
  } catch {
    return null;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const client = getClient();
    const data = await client.request<{ posts: { nodes: { slug: string }[] } }>(GET_ALL_POST_SLUGS);
    return data.posts.nodes.map((p) => p.slug);
  } catch {
    return [];
  }
}

export async function getAllPostSlugsWithDates(): Promise<{ slug: string; modified: string }[]> {
  try {
    const client = getClient();
    const data = await client.request<{
      posts: { nodes: { slug: string; modified: string }[] };
    }>(GET_ALL_POST_SLUGS_WITH_DATES);
    return data.posts.nodes;
  } catch {
    return [];
  }
}

export async function getLatestPosts(count: number = 3): Promise<BlogPost[]> {
  const { posts } = await getPosts(count);
  return posts;
}

