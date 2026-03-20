import React from 'react';
import { cn } from '@/lib/utils';

type SkeletonVariant = 'text' | 'heading' | 'avatar' | 'card' | 'button' | 'badge' | 'block';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  className?: string;
  width?: string;
  height?: string;
  lines?: number;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: 'w-full h-4 rounded',
  heading: 'w-3/4 h-8 rounded-md',
  avatar: 'w-10 h-10 rounded-full shrink-0',
  card: 'w-full aspect-video rounded-xl',
  button: 'w-28 h-10 rounded-lg',
  badge: 'w-16 h-5 rounded-full',
  block: 'w-full h-full rounded-xl',
};

const baseClasses =
  'animate-pulse bg-surface-200 dark:bg-surface-700';

export function Skeleton({
  variant = 'text',
  className,
  width,
  height,
  lines,
  style,
  ...props
}: SkeletonProps) {
  /* Multi-line text skeleton */
  if (variant === 'text' && lines && lines > 1) {
    return (
      <div className={cn('flex flex-col gap-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variantClasses.text,
              /* Last line is shorter for a natural text look */
              i === lines - 1 && 'w-4/5',
            )}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}

/* ── Composed skeletons for common content patterns ── */

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6',
        'flex flex-col gap-4',
        className,
      )}
    >
      <Skeleton variant="card" />
      <div className="flex flex-col gap-2">
        <Skeleton variant="heading" />
        <Skeleton variant="text" lines={3} />
      </div>
      <div className="flex gap-2 mt-2">
        <Skeleton variant="badge" />
        <Skeleton variant="badge" />
        <Skeleton variant="badge" />
      </div>
      <div className="flex gap-3 mt-auto pt-4 border-t border-surface-100 dark:border-surface-800">
        <Skeleton variant="button" />
        <Skeleton variant="button" width="6rem" />
      </div>
    </div>
  );
}

export function SkeletonProfile({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Skeleton variant="avatar" width="3rem" height="3rem" />
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  );
}

export function SkeletonBlogPost({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Skeleton variant="card" />
      <div className="flex items-center gap-3">
        <Skeleton variant="badge" />
        <Skeleton variant="text" width="5rem" />
      </div>
      <Skeleton variant="heading" />
      <Skeleton variant="text" lines={3} />
      <div className="flex justify-between items-center pt-4 border-t border-surface-100 dark:border-surface-800">
        <Skeleton variant="text" width="4rem" />
        <Skeleton variant="button" width="5rem" />
      </div>
    </div>
  );
}

export default Skeleton;
