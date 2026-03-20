import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { skillCategories, type SkillCategory } from '@/data/skills';
import { cn } from '@/lib/utils';

// [UX-FIX] Replaced indigo/violet (not in design system) with primary palette shades for consistency
const CARD_ACCENTS = [
  { border: 'hover:border-primary-500/40', icon: 'bg-primary-500/10 text-primary-600' },
  { border: 'hover:border-primary-500/40', icon: 'bg-primary-500/10 text-primary-600' },
  { border: 'hover:border-primary-600/40', icon: 'bg-primary-600/10 text-primary-700' },
  { border: 'hover:border-primary-700/40', icon: 'bg-primary-700/10 text-primary-800' },
] as const;

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

      {/* Skill pills — clean, no level labels */}
      <div className="flex flex-wrap gap-2" role="list" aria-label={`${category.category} technologies`}>
        {category.skills.map((skill) => (
          <span
            key={skill}
            role="listitem"
            className={cn(
              'inline-flex items-center px-3 py-1.5 rounded-lg',
              'bg-surface-100 dark:bg-surface-800',
              'text-surface-700 dark:text-surface-300',
              'text-sm font-medium',
              'border border-surface-200/80 dark:border-surface-700/80',
              'transition-colors duration-150',
              'hover:bg-surface-200 dark:hover:bg-surface-700',
            )}
          >
            {skill}
          </span>
        ))}
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
              title="Tools I ship with"
              subtitle="Technologies I use daily to build fast, maintainable production software."
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
