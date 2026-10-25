import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero/hero-section';
import { AboutPreview } from '@/components/sections/about-preview';
import { FeaturedProjects } from '@/components/sections/featured-projects';
import { SkillsGrid } from '@/components/sections/skills-grid';
import { GithubStats } from '@/components/sections/github-stats';
import { CurrentlySection } from '@/components/sections/currently-section';
import { CtaSection } from '@/components/sections/cta-section';
import { projects as fallbackProjects } from '@/data/projects';

export const metadata: Metadata = {
  title:
    'Ganesh Prasad Bhatt — WordPress & React Developer Nepal | Gutenberg Expert | Full-Stack Software Engineer',
  description:
    'Ganesh Prasad Bhatt is a senior full-stack developer from Nepal — WordPress expert, Gutenberg page builder specialist, React JS expert, PHP developer, LMS expert, and AI developer. Senior Developer at ThemeGrill; previously worked on Spectra v3 at Brainstorm Force.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutPreview />
      <FeaturedProjects projects={fallbackProjects} />
      <SkillsGrid />
      <GithubStats />
      <CurrentlySection />
      <CtaSection />
    </>
  );
}
