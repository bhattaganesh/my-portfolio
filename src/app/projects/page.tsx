import type { Metadata } from 'next';
import { Briefcase } from 'lucide-react';
import { projects } from '@/data/projects';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ProjectCard } from '@/components/projects/project-card';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title:
    'Projects by Ganesh Prasad Bhatt — WordPress Plugins, Gutenberg Page Builders, React Apps & LMS',
  description:
    'Explore projects by Ganesh Prasad Bhatt — Spectra Blocks (Gutenberg page builder, 1M+ sites), Masteriyo LMS, WP Agent AI, Everest Forms, and more. WordPress development, React apps, and open source contributions.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/projects`,
  },
};

export default function ProjectsPage() {

  return (
    <div className="pt-24 pb-16">
      <Container>
        <ScrollReveal direction="up" delay={0}>
          <SectionHeading
            as="h1"
            title="Projects"
            subtitle="A selection of work I'm proud of — from 1M+ user plugins to open source contributions"
            className="mb-12"
          />
        </ScrollReveal>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-20 rounded-2xl border-2 border-dashed border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-primary-400" aria-hidden="true" />
            </div>
            <div className="text-center max-w-xs">
              <p className="text-base font-semibold text-surface-700 dark:text-surface-300">
                No projects found
              </p>
              <p className="text-sm text-surface-400 dark:text-surface-500 mt-1 leading-relaxed">
                Check back soon for updates on my latest work.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <ScrollReveal key={project.slug} direction="up" delay={idx * 0.08} className="h-full">
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
