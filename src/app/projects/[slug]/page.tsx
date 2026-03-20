import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, Star, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { projects } from '@/data/projects';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<'/projects/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} – Ganesh Prasad Bhatt`,
    description: project.excerpt,
    alternates: {
      canonical: `${SITE_CONFIG.url}/projects/${slug}`,
    },
  };
}

/** Deterministic gradient per project slug */
const PROJECT_GRADIENTS: Record<string, { from: string; to: string }> = {
  spectra: { from: '#1e2f7a', to: '#748ffc' },
  'ultimate-addons-gutenberg': { from: '#1a1f4e', to: '#4c6ef5' },
  'zip-ai': { from: '#0f2027', to: '#4c6ef5' },
};

function getGradient(slug: string): string {
  const g = PROJECT_GRADIENTS[slug] ?? { from: '#2b3f9e', to: '#4c6ef5' };
  return `linear-gradient(135deg, ${g.from}, ${g.to})`;
}

export default async function ProjectDetailPage(
  props: PageProps<'/projects/[slug]'>,
) {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const gradient = getGradient(project.slug);

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
        name: 'Projects',
        item: `${SITE_CONFIG.url}/projects`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: `${SITE_CONFIG.url}/projects/${slug}`,
      },
    ],
  };

  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    applicationCategory: 'WebApplication',
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    ...(project.projectUrl && { url: project.projectUrl }),
    ...(project.githubUrl && { codeRepository: project.githubUrl }),
  };

  return (
    <main className="pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <Container>
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Hero gradient banner */}
        <div
          className="rounded-2xl p-8 mb-8 text-white"
          style={{ background: gradient }}
        >
          <Badge className="mb-4 bg-white/20 text-white border-0 hover:bg-white/30">
            {project.projectType}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-display mb-3 leading-tight">
            {project.title}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">{project.excerpt}</p>
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-3 text-surface-900 dark:text-surface-100 font-display">
                About this project
              </h2>
              <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-surface-100 font-display">
                Key Highlights
              </h2>
              <ul className="space-y-3">
                {project.highlights.map((highlight, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-surface-600 dark:text-surface-400"
                  >
                    <Star className="w-4 h-4 text-primary-500 mt-0.5 shrink-0 fill-primary-500/20" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Tech stack */}
            <div className="rounded-xl border border-surface-200 dark:border-surface-800 p-5 bg-surface-50 dark:bg-surface-900">
              <h3 className="font-semibold mb-3 text-surface-900 dark:text-surface-100">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </div>

            {/* Links & meta */}
            <div className="rounded-xl border border-surface-200 dark:border-surface-800 p-5 bg-surface-50 dark:bg-surface-900 space-y-4">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  View Live
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:underline text-sm font-medium transition-colors"
                >
                  <Github className="w-4 h-4 shrink-0" />
                  View on GitHub
                </a>
              )}
              <div className="flex items-center gap-2 text-surface-500 dark:text-surface-500 text-sm">
                <Calendar className="w-4 h-4 shrink-0" />
                {project.projectYear}
              </div>
            </div>

            {/* Back to all projects */}
            <Link
              href="/projects"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Projects
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
