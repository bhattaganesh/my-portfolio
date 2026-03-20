import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero/hero-section';
import { AboutPreview } from '@/components/sections/about-preview';
import { FeaturedProjects } from '@/components/sections/featured-projects';
import { SkillsGrid } from '@/components/sections/skills-grid';
import { LatestPosts } from '@/components/sections/latest-posts';
import { CtaSection } from '@/components/sections/cta-section';
import { getLatestPosts } from '@/lib/wordpress';
import { projects as fallbackProjects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'Ganesh Prasad Bhatt – Senior Full-Stack Developer',
  description:
    'Senior Full-Stack Developer from Nepal specializing in PHP, React, WordPress, and Gutenberg. Building at Brainstorm Force.',
};

export default async function HomePage() {
  const latestPosts = await getLatestPosts(3);

  return (
    <>
      <HeroSection />
      <AboutPreview />
      <FeaturedProjects projects={fallbackProjects} />
      <SkillsGrid />
      <LatestPosts posts={latestPosts} />
      <CtaSection />
    </>
  );
}
