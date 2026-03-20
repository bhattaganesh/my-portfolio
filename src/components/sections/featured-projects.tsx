'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Github, Star, ArrowRight, Zap } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { projects as defaultProjects, type Project } from '@/data/projects';
import { cn } from '@/lib/utils';

interface Props {
  projects?: Project[];
}

/** Deterministic gradient for each project based on slug */
const PROJECT_GRADIENTS: Record<string, { from: string; to: string; via?: string }> = {
  spectra: { from: '#1e2f7a', via: '#4c6ef5', to: '#748ffc' },
  'ultimate-addons-gutenberg': { from: '#1a1f4e', via: '#3b5bdb', to: '#4c6ef5' },
  'zip-ai': { from: '#0f2027', via: '#2b3f9e', to: '#4c6ef5' },
};

function getGradient(slug: string): string {
  const g = PROJECT_GRADIENTS[slug] ?? { from: '#1e2f7a', via: '#3b5bdb', to: '#748ffc' };
  if (g.via) {
    return `linear-gradient(135deg, ${g.from} 0%, ${g.via} 55%, ${g.to} 100%)`;
  }
  return `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)`;
}

const TYPE_VARIANT: Record<Project['projectType'], 'default' | 'success' | 'secondary'> = {
  Work: 'default',
  'Open Source': 'success',
  Personal: 'secondary',
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const gradient = getGradient(project.slug);
  const visibleTech = project.techStack.slice(0, 4);
  const extraTech = project.techStack.length - 4;
  const visibleHighlights = project.highlights.slice(0, 2);

  return (
    <ScrollReveal direction="up" delay={index * 0.1} className="h-full">
      <article
        className={cn(
          'group relative flex flex-col h-full rounded-2xl overflow-hidden',
          'border border-surface-200 dark:border-surface-800',
          'bg-white dark:bg-surface-900',
          'shadow-sm hover:shadow-xl hover:shadow-primary-950/10 dark:hover:shadow-black/30',
          'hover:-translate-y-1.5 hover:border-primary-400/50 dark:hover:border-primary-600/50',
          'transition-all duration-300 ease-in-out',
        )}
        aria-label={`Project: ${project.title}`}
      >
        {/* ── Gradient Header ── */}
        <div
          className="relative h-44 flex flex-col justify-end p-6 overflow-hidden"
          style={{ background: gradient }}
        >
          {/* Background texture */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10" aria-hidden="true" />
          {/* Subtle radial glow */}
          <div
            className="absolute top-0 right-0 w-40 h-40 opacity-30 rounded-full"
            aria-hidden="true"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            }}
          />

          {/* Type badge — top right */}
          <div className="absolute top-4 right-4">
            <Badge variant={TYPE_VARIANT[project.projectType]}>
              {project.projectType}
            </Badge>
          </div>

          {/* Year — top left */}
          <div className="absolute top-4 left-4">
            <span className="text-xs font-mono text-white/60 bg-black/20 px-2 py-0.5 rounded-md">
              {project.projectYear}
            </span>
          </div>

          {/* Title */}
          <h3 className="relative z-10 text-xl font-bold font-display text-white leading-snug drop-shadow-sm">
            {project.title}
          </h3>
        </div>

        {/* ── Card Body ── */}
        <div className="flex flex-col gap-4 p-6 flex-1">
          {/* Excerpt */}
          <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed line-clamp-3">
            {project.excerpt}
          </p>

          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-1.5" aria-label="Tech stack">
            {visibleTech.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-[11px]">
                {tech}
              </Badge>
            ))}
            {extraTech > 0 && (
              <Badge variant="outline" className="text-[11px]">
                +{extraTech} more
              </Badge>
            )}
          </div>

          {/* Highlights */}
          {visibleHighlights.length > 0 && (
            <ul className="flex flex-col gap-1.5 mt-auto" role="list" aria-label="Key highlights">
              {visibleHighlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-xs text-surface-600 dark:text-surface-400">
                  <Star
                    className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5 fill-yellow-500/30"
                    aria-hidden="true"
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Card Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50">
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} on GitHub`}
                className="inline-flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 transition-colors duration-150 group/link"
              >
                <Github className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="font-medium">Source</span>
              </a>
            )}
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${project.title} live site`}
                className="inline-flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors duration-150 ml-3"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="font-medium">Live</span>
              </a>
            )}
          </div>
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors duration-150 group/read"
            aria-label={`Read more about ${project.title}`}
          >
            Details
            <ArrowRight
              className="w-3 h-3 group-hover/read:translate-x-0.5 transition-transform duration-150"
              aria-hidden="true"
            />
          </Link>
        </div>
      </article>
    </ScrollReveal>
  );
}

export function FeaturedProjects({ projects }: Props) {
  const items = (projects && projects.length > 0 ? projects : defaultProjects).filter(
    (p) => p.isFeatured,
  );

  return (
    <section
      className="py-20 lg:py-28 bg-surface-50 dark:bg-surface-900"
      aria-label="Featured projects"
    >
      <Container>
        <div className="flex flex-col gap-12">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <ScrollReveal direction="up" delay={0}>
              <SectionHeading
                eyebrow="Featured Work"
                title="Projects I'm proud of"
                subtitle="Production software used by millions of WordPress users around the world."
                as="h2"
              />
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.1} className="shrink-0">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors duration-150 group whitespace-nowrap"
              >
                All Projects
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                  aria-hidden="true"
                />
              </Link>
            </ScrollReveal>
          </div>

          {/* Project cards grid */}
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {items.map((project, idx) => (
                <ProjectCard key={project.slug} project={project} index={idx} />
              ))}
            </div>
          ) : (
            <ScrollReveal direction="up">
              <div className="flex flex-col items-center justify-center gap-4 py-20 rounded-2xl border-2 border-dashed border-surface-200 dark:border-surface-800">
                <Zap className="w-10 h-10 text-surface-300 dark:text-surface-600" aria-hidden="true" />
                <p className="text-surface-500 dark:text-surface-400 text-base font-medium">
                  No featured projects yet
                </p>
              </div>
            </ScrollReveal>
          )}

        </div>
      </Container>
    </section>
  );
}

export default FeaturedProjects;
