import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: [
    'bg-primary-100 text-primary-700',
    'dark:bg-primary-950 dark:text-primary-300',
    'border border-primary-200 dark:border-primary-900',
  ].join(' '),

  secondary: [
    'bg-surface-100 text-surface-700',
    'dark:bg-surface-800 dark:text-surface-300',
    'border border-surface-200 dark:border-surface-700',
  ].join(' '),

  outline: [
    'bg-transparent text-primary-600',
    'border border-primary-400',
    'dark:text-primary-400 dark:border-primary-500',
  ].join(' '),

  success: [
    'bg-green-100 text-green-700',
    'dark:bg-green-950 dark:text-green-300',
    'border border-green-200 dark:border-green-900',
  ].join(' '),

  warning: [
    'bg-yellow-100 text-yellow-700',
    'dark:bg-yellow-950 dark:text-yellow-300',
    'border border-yellow-200 dark:border-yellow-900',
  ].join(' '),

  danger: [
    'bg-red-100 text-red-700',
    'dark:bg-red-950 dark:text-red-300',
    'border border-red-200 dark:border-red-900',
  ].join(' '),
};

export function Badge({
  variant = 'default',
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        'text-xs font-medium',
        'px-2.5 py-0.5 rounded-full',
        'transition-colors duration-150',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
