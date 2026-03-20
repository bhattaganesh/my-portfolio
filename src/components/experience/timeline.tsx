import React from 'react';
import { Briefcase, GraduationCap, MapPin, ExternalLink, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import type { ExperienceItem } from '@/data/experience';
import { cn } from '@/lib/utils';

interface Props {
  items: ExperienceItem[];
}

interface TimelineItemProps {
  item: ExperienceItem;
  index: number;
  isLast: boolean;
}

function TimelineItem({ item, index, isLast }: TimelineItemProps) {
  const isWork = item.type === 'work';

  return (
    <ScrollReveal direction="up" delay={index * 0.08}>
      <div className="relative flex gap-6">

        {/* ── Left: Icon column + connecting line ── */}
        <div className="relative flex flex-col items-center shrink-0">
          {/* Icon bubble */}
          <div
            className={cn(
              'relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0',
              'ring-4 ring-white dark:ring-surface-950',
              isWork
                ? 'bg-primary-600 dark:bg-primary-700 shadow-lg shadow-primary-500/30'
                : 'bg-surface-200 dark:bg-surface-700',
            )}
            aria-hidden="true"
          >
            {isWork ? (
              <Briefcase className="w-4 h-4 text-white" aria-hidden="true" />
            ) : (
              <GraduationCap className="w-4 h-4 text-surface-600 dark:text-surface-300" aria-hidden="true" />
            )}
          </div>

          {/* Vertical connecting line */}
          {!isLast && (
            <div
              className="absolute top-10 bottom-0 w-0.5 bg-surface-200 dark:bg-surface-800"
              style={{ left: '50%', transform: 'translateX(-50%)' }}
              aria-hidden="true"
            />
          )}
        </div>

        {/* ── Right: Card ── */}
        <div
          className={cn(
            'flex-1 mb-10 rounded-2xl border transition-all duration-300',
            'p-5 sm:p-6',
            isWork
              ? [
                  'bg-white dark:bg-surface-900',
                  'border-surface-200 dark:border-surface-800',
                  'hover:border-primary-300 dark:hover:border-primary-700/60',
                  'hover:shadow-md hover:shadow-primary-500/5',
                ].join(' ')
              : [
                  'bg-surface-50 dark:bg-surface-900/60',
                  'border-surface-100 dark:border-surface-800/60',
                ].join(' '),
          )}
        >
          {/* Top row: title + date pill */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div className="min-w-0">
              <h3
                className={cn(
                  'font-display font-bold leading-snug',
                  isWork
                    ? 'text-lg sm:text-xl text-surface-900 dark:text-surface-50'
                    : 'text-base sm:text-lg text-surface-800 dark:text-surface-200',
                )}
              >
                {item.title}
              </h3>

              {/* Organisation + external link */}
              <p
                className={cn(
                  'mt-0.5 font-medium',
                  isWork
                    ? 'text-primary-600 dark:text-primary-400 text-sm'
                    : 'text-surface-500 dark:text-surface-400 text-sm',
                )}
              >
                {item.organization}
              </p>
            </div>

            {/* Date range pill */}
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-50 dark:bg-primary-950/60 border border-primary-100 dark:border-primary-900/60 text-primary-700 dark:text-primary-300 text-xs font-mono whitespace-nowrap">
                <Calendar className="w-3 h-3" aria-hidden="true" />
                {item.startDate} — {item.endDate}
              </span>
            </div>
          </div>

          {/* Location */}
          {item.location && (
            <div className="flex items-center gap-1.5 text-surface-400 dark:text-surface-500 text-xs mb-3">
              <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span>{item.location}</span>
            </div>
          )}

          {/* Description bullets */}
          {item.description.length > 0 && (
            <ul className="flex flex-col gap-1.5 mb-4" role="list">
              {item.description.map((point, i) => (
                <li
                  key={i}
                  className={cn(
                    'flex items-start gap-2 text-sm leading-relaxed',
                    isWork
                      ? 'text-surface-600 dark:text-surface-400'
                      : 'text-surface-500 dark:text-surface-500',
                  )}
                >
                  <span
                    className={cn(
                      'mt-2 w-1.5 h-1.5 rounded-full shrink-0',
                      isWork ? 'bg-primary-500' : 'bg-surface-400',
                    )}
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>
          )}

          {/* Tech badges — only for work items */}
          {isWork && item.technologies && item.technologies.length > 0 && (
            <div
              className="flex flex-wrap gap-1.5 pt-3 border-t border-surface-100 dark:border-surface-800"
              aria-label="Technologies used"
            >
              {item.technologies.map((tech) => (
                <Badge key={tech} variant="default" className="text-[11px]">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

export function Timeline({ items }: Props) {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 rounded-2xl border-2 border-dashed border-surface-200 dark:border-surface-800">
        <p className="text-surface-400 dark:text-surface-500 text-sm">No experience items to display.</p>
      </div>
    );
  }

  return (
    <div
      className="relative"
      role="list"
      aria-label="Experience timeline"
    >
      {items.map((item, idx) => (
        <div key={`${item.organization}-${item.startDate}`} role="listitem">
          <TimelineItem
            item={item}
            index={idx}
            isLast={idx === items.length - 1}
          />
        </div>
      ))}
    </div>
  );
}

export default Timeline;
