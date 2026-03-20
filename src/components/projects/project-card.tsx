import React from 'react';
import Link from 'next/link';
import { ExternalLink, Github, Star, ArrowRight } from 'lucide-react';
import type { Project } from '@/data/projects';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  project: Project;
  className?: string;
  /**
   * When true renders a more compact variant — useful for listing pages
   * where a full-size card would be too heavy.
   */
  compact?: boolean;
}

/** Deterministic per-project header gradients */
const PROJECT_GRADIENTS: Record<string, string> = {
  spectra:
    'linear-gradient(135deg, #1e2f7a 0%, #4c6ef5 55%, #748ffc 100%)',
  'ultimate-addons-gutenberg':
    'linear-gradient(135deg, #1a1f4e 0%, #3b5bdb 55%, #4c6ef5 100%)',
  'zip-ai':
    'linear-gradient(135deg, #0f2027 0%, #2b3f9e 55%, #4c6ef5 100%)',
};

function getGradient(slug: string): string {
  return (
    PROJECT_GRADIENTS[slug] ??
    'linear-gradient(135deg, #1e2f7a 0%, #3b5bdb 55%, #748ffc 100%)'
  );
}

const TYPE_VARIANT: Record<Project['projectType'], 'default' | 'success' | 'secondary'> = {
  Work: 'default',
  'Open Source': 'success',
  Personal: 'secondary',
};

export function ProjectCard({ project, className, compact = false }: Props) {
  const gradient = getGradient(project.slug);
  const visibleTech = project.techStack.slice(0, 4);
  const extraTech = project.techStack.length - 4;
  const visibleHighlights = project.highlights.slice(0, 2);

  return (
    <article
      className={cn(
        'group relative flex flex-col h-full rounded-2xl overflow-hidden',
        'border border-surface-200 dark:border-surface-800',
        'bg-white dark:bg-surface-900',
        'shadow-sm',
        'hover:shadow-xl hover:shadow-primary-950/10 dark:hover:shadow-black/30',
        'hover:-translate-y-1.5 hover:border-primary-400/50 dark:hover:border-primary-700/50',
        'transition-all duration-300 ease-in-out',
        className,
      )}
      aria-label={`Project: ${project.title}`}
    >
      {/* ── Gradient header ── */}
      <div
        className={cn(
          'relative flex flex-col justify-end overflow-hidden',
          compact ? 'h-36 p-5' : 'h-44 p-6',
        )}
        style={{ background: gradient }}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" aria-hidden="true" />
        {/* Radial highlight */}
        <div
          className="absolute top-0 right-0 w-40 h-40 opacity-20 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.25) 0%, transparent 60%)',
          }}
        />

        {/* Year — top left */}
        <div className="absolute top-4 left-4">
          <span className="text-xs font-mono text-white/60 bg-black/20 px-2 py-0.5 rounded-md">
            {project.projectYear}
          </span>
        </div>

        {/* Type badge — top right */}
        <div className="absolute top-4 right-4">
          <Badge variant={TYPE_VARIANT[project.projectType]} className="text-[11px]">
            {project.projectType}
          </Badge>
        </div>

        {/* Title */}
        <h3
          className={cn(
            'relative z-10 font-display font-bold text-white leading-snug drop-shadow-sm',
            compact ? 'text-lg' : 'text-xl',
          )}
        >
          <Link
            href={`/projects/${project.slug}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
          >
            {project.title}
          </Link>
        </h3>
      </div>

      {/* ── Card body ── */}
      <div className={cn('flex flex-col gap-4 flex-1', compact ? 'p-5' : 'p-6')}>
        {/* Excerpt */}
        <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed line-clamp-3">
          {project.excerpt}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5" aria-label="Tech stack">
          {visibleTech.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-[11px]">
              {tech}
            </Badge>
          ))}
          {extraTech > 0 && (
            <Badge variant="outline" className="text-[11px]">
              +{extraTech}
            </Badge>
          )}
        </div>

        {/* Highlights */}
        {visibleHighlights.length > 0 && (
          <ul className="flex flex-col gap-1.5 mt-auto" role="list" aria-label="Project highlights">
            {visibleHighlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 text-xs text-surface-600 dark:text-surface-400"
              >
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

      {/* ── Card footer ── */}
      <div
        className={cn(
          'flex items-center justify-between border-t border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50',
          compact ? 'px-5 py-3' : 'px-6 py-4',
        )}
      >
        {/* External links */}
        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} on GitHub`}
              className="inline-flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
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
              aria-label={`Visit ${project.title} live`}
              className="inline-flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="font-medium">Live</span>
            </a>
          )}
        </div>

        {/* Details link */}
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors duration-150 group/arrow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
          aria-label={`View details for ${project.title}`}
        >
          Details
          <ArrowRight
            className="w-3 h-3 group-hover/arrow:translate-x-0.5 transition-transform duration-150"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}

export default ProjectCard;
