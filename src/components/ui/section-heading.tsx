import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  as?: 'h1' | 'h2' | 'h3';
  eyebrow?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = 'left',
  className,
  titleClassName,
  subtitleClassName,
  as: Tag = 'h2',
  eyebrow,
}: SectionHeadingProps) {
  const isCentered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        isCentered && 'items-center text-center',
        className,
      )}
    >
      {/* Optional eyebrow label */}
      {eyebrow && (
        <span
          className={cn(
            'inline-flex items-center gap-1.5',
            'text-xs font-mono font-semibold uppercase tracking-[var(--tracking-caps)]',
            'text-primary-500 dark:text-primary-400',
          )}
        >
          {eyebrow}
        </span>
      )}

      {/* Title */}
      <Tag
        className={cn(
          'font-display font-bold leading-tight tracking-[var(--tracking-heading)]',
          'text-surface-900 dark:text-surface-50',
          'text-fluid-h2',
          titleClassName,
        )}
      >
        {title}
      </Tag>

      {/* Accent line — always left-aligned per spec */}
      <div
        className={cn(
          'w-12 h-1 rounded-full bg-primary-500',
          isCentered && 'self-center',
        )}
        aria-hidden="true"
      />

      {/* Subtitle */}
      {subtitle && (
        <p
          className={cn(
            'mt-1 text-fluid-body-lg leading-relaxed',
            'text-surface-600 dark:text-surface-400', // [UX-FIX] surface-500 (#78716c) fails WCAG AA on white; 600 gives 6.5:1
            isCentered && 'max-w-2xl',
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
