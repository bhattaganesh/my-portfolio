import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { getGithubStats } from '@/lib/github';
import { GithubLanguages } from './github-languages';

const metrics = [
  {
    value: '6+',
    label: 'WordPress plugins',
    detail: 'User Registration, Masteriyo, Magazine Blocks, BlockArt, Everest Forms, Spectra',
  },
  {
    value: '4+',
    label: 'Years in production',
    detail: 'Professional full-stack engineering experience',
  },
  {
    value: '2',
    label: 'Product companies',
    detail: 'Brainstorm Force & ThemeGrill',
  },
  {
    value: '238',
    label: 'Masteriyo pull requests',
    detail: 'Merged across 2023–2026',
  },
] as const;

/**
 * "By the numbers" section: product metrics plus the build-time GitHub activity card.
 */
export async function GithubStats() {
  const github = await getGithubStats();

  return (
    <section
      className="py-20 lg:py-28 bg-surface-50 dark:bg-surface-950"
      aria-label="Professional impact and GitHub activity"
    >
      <Container>
        <div className="flex flex-col gap-12">

          <ScrollReveal direction="up" delay={0}>
            <SectionHeading
              eyebrow="Impact & Activity"
              title="By the numbers"
              subtitle="Product work at scale, plus my public GitHub activity."
              as="h2"
            />
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Left: professional impact */}
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric, i) => (
                <ScrollReveal key={metric.label} direction="up" delay={i * 0.08}>
                  <div className="flex flex-col gap-2 p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-800 transition-all duration-200 h-full">
                    <span className="text-4xl font-bold font-display text-surface-900 dark:text-white tracking-tight">
                      {metric.value}
                    </span>
                    <span className="text-sm font-semibold text-surface-700 dark:text-surface-200">
                      {metric.label}
                    </span>
                    <span className="text-xs text-surface-400 dark:text-surface-500 leading-relaxed mt-auto">
                      {metric.detail}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Right: GitHub activity card */}
            <ScrollReveal direction="up" delay={0.15}>
              <GithubLanguages stats={github} />
            </ScrollReveal>

          </div>
        </div>
      </Container>
    </section>
  );
}
