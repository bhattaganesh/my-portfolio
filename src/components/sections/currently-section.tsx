import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { currentlyItems, type CurrentItem } from '@/data/currently';
import { cn } from '@/lib/utils';

interface CurrentCardProps {
  item: CurrentItem;
  index: number;
}

function CurrentCard({ item, index }: CurrentCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as unknown as Record<string, React.FC<any>>)[item.icon];

  const categoryColors: Record<string, string> = {
    Building: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    Learning: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    Exploring: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  };

  const colorClass = categoryColors[item.category] ?? 'bg-primary-500/10 text-primary-600 dark:text-primary-400';

  return (
    <ScrollReveal direction="up" delay={index * 0.08} className="h-full">
      <div
        className={cn(
          'flex gap-4 p-5 rounded-2xl h-full',
          'bg-white dark:bg-surface-900',
          'border border-surface-200 dark:border-surface-800',
          'hover:shadow-md dark:hover:shadow-black/20',
          'transition-all duration-300',
        )}
      >
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
            colorClass,
          )}
          aria-hidden="true"
        >
          {IconComponent && <IconComponent className="w-4.5 h-4.5" />}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500 mb-0.5">
            {item.category}
          </p>
          <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 leading-snug mb-1">
            {item.label}
          </p>
          <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
            {item.detail}
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function CurrentlySection() {
  return (
    <section className="py-20 lg:py-28" aria-label="What I'm up to">
      <Container>
        <div className="flex flex-col gap-12">
          <ScrollReveal direction="up" delay={0}>
            <SectionHeading
              eyebrow="Right Now"
              title="What I'm up to"
              subtitle="A snapshot of what I'm building, learning, and exploring at the moment."
              as="h2"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {currentlyItems.map((item, i) => (
              <CurrentCard key={item.label} item={item} index={i} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
