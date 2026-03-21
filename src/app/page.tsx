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
  title:
    'Ganesh Prasad Bhatt — WordPress & React Developer Nepal | Gutenberg Expert | Full-Stack Software Engineer',
  description:
    'Ganesh Prasad Bhatt is a senior full-stack developer from Nepal — WordPress expert, Gutenberg page builder specialist, React JS expert, PHP developer, LMS expert, and AI developer. Core engineer on Spectra Blocks at Brainstorm Force, powering 1M+ WordPress sites.',
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
