import type { MetadataRoute } from 'next';
import { getAllPostSlugsWithDates } from '@/lib/wordpress';
import { projects } from '@/data/projects';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.ganeshbhatt.com.np';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postSlugsWithDates = await getAllPostSlugsWithDates();
  const portfolioSlugs = projects.map((p) => p.slug);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/experience`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = postSlugsWithDates.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const projectPages: MetadataRoute.Sitemap = portfolioSlugs.map((slug) => ({
    url: `${BASE_URL}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...projectPages];
}
