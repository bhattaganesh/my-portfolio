import React from 'react';
import { cn } from '@/lib/utils';

type PaddingSize = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: PaddingSize;
  as?: React.ElementType;
}

const paddingClasses: Record<PaddingSize, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className,
  hover = false,
  padding = 'md',
  as: Component = 'div',
  ...props
}: CardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const El = Component as React.FC<any>;
  return (
    <El
      className={cn(
        /* base */
        'rounded-xl',
        'bg-white dark:bg-surface-900',
        'border border-surface-200 dark:border-surface-800',
        'shadow-sm',
        /* padding */
        paddingClasses[padding],
        /* hover */
        hover && [
          'cursor-pointer',
          'hover:shadow-md hover:-translate-y-1',
          'hover:border-surface-300 dark:hover:border-surface-700',
          'transition-all duration-200 ease-in-out',
        ],
        /* always include transition for border/shadow even without hover */
        !hover && 'transition-shadow duration-200',
        className,
      )}
      {...props}
    >
      {children}
    </El>
  );
}

/* ── Sub-components for compositional usage ── */

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function CardTitle({ children, className, as: Tag = 'h3', ...props }: CardTitleProps) {
  return (
    <Tag
      className={cn(
        'font-display text-fluid-h3 font-bold leading-snug tracking-[var(--tracking-subheading)] text-surface-900 dark:text-surface-50',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn('text-sm leading-relaxed text-surface-500 dark:text-surface-400', className)}
      {...props}
    >
      {children}
    </p>
  );
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className, ...props }: CardBodyProps) {
  return (
    <div className={cn('mt-4', className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        'mt-4 pt-4 flex items-center gap-3',
        'border-t border-surface-100 dark:border-surface-800',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
