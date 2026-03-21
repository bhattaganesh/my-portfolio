import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { skillCategories, type SkillCategory, type SkillLevel } from '@/data/skills';
import { cn } from '@/lib/utils';

// [UX-FIX] Replaced indigo/violet (not in design system) with primary palette shades for consistency
const CARD_ACCENTS = [
  { border: 'hover:border-primary-500/40', icon: 'bg-primary-500/10 text-primary-600' },
  { border: 'hover:border-primary-500/40', icon: 'bg-primary-500/10 text-primary-600' },
  { border: 'hover:border-primary-600/40', icon: 'bg-primary-600/10 text-primary-700' },
  { border: 'hover:border-primary-700/40', icon: 'bg-primary-700/10 text-primary-800' },
] as const;

const LEVEL_DOTS: Record<SkillLevel, { count: number; color: string; label: string }> = {
  expert:       { count: 3, color: 'bg-primary-500', label: 'Expert' },
  advanced:     { count: 2, color: 'bg-primary-400', label: 'Advanced' },
  intermediate: { count: 1, color: 'bg-primary-300', label: 'Intermediate' },
};

interface SkillCardProps {
  category: SkillCategory;
  accentIndex: number;
}

function SkillCard({ category, accentIndex }: SkillCardProps) {
  const accent = CARD_ACCENTS[accentIndex % CARD_ACCENTS.length];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as unknown as Record<string, React.FC<any>>)[category.icon];

  return (
    <div
      className={cn(
        'group flex flex-col gap-5 p-6 h-full rounded-2xl',
        'bg-white dark:bg-surface-900',
        'border border-surface-200 dark:border-surface-800',
        accent.border,
        'transition-all duration-300',
        'hover:shadow-lg dark:hover:shadow-black/20',
      )}
    >
      {/* Icon + category name */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
            accent.icon,
          )}
          aria-hidden="true"
        >
          {IconComponent ? (
            <IconComponent className="w-4.5 h-4.5" aria-hidden="true" />
          ) : (
            <span className="text-sm font-bold">{category.category[0]}</span>
          )}
        </div>
        <h3 className="text-base font-bold font-display text-surface-900 dark:text-surface-50 leading-snug">
          {category.category}
        </h3>
      </div>

      {/* Skill pills with proficiency dots */}
      <div className="flex flex-wrap gap-2" role="list" aria-label={`${category.category} technologies`}>
        {category.skills.map((skill) => {
          const dots = LEVEL_DOTS[skill.level];
          return (
            <span
              key={skill.name}
              role="listitem"
              title={`${skill.name} — ${dots.label}`}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
                'bg-surface-100 dark:bg-surface-800',
                'text-surface-700 dark:text-surface-300',
                'text-sm font-medium',
                'border border-surface-200/80 dark:border-surface-700/80',
                'transition-colors duration-150',
                'hover:bg-surface-200 dark:hover:bg-surface-700',
                'cursor-default',
              )}
            >
              {skill.name}
              <span className="flex items-center gap-0.5" aria-label={dots.label}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'w-1 h-1 rounded-full',
                      i < dots.count ? dots.color : 'bg-surface-300 dark:bg-surface-600',
                    )}
                    aria-hidden="true"
                  />
                ))}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function SkillsGrid() {
  return (
    <section
      className="py-20 lg:py-28 bg-surface-50 dark:bg-surface-950"
      aria-label="Tech stack"
    >
      <Container>
        <div className="flex flex-col gap-12">

          <ScrollReveal direction="up" delay={0}>
            <SectionHeading
              eyebrow="Tech Stack"
              title="What I build with"
              subtitle="Languages, frameworks, and tools I use daily in production."
              as="h2"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {skillCategories.map((category, idx) => (
              <ScrollReveal key={category.category} direction="up" delay={idx * 0.08} className="h-full">
                <SkillCard category={category} accentIndex={idx} />
              </ScrollReveal>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}

export default SkillsGrid;
