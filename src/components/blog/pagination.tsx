'use client';

import React, { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  hasNextPage: boolean;
  endCursor: string | null;
  hasPreviousPage?: boolean;
}

export function Pagination({ hasNextPage, endCursor, hasPreviousPage = false }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleNext() {
    if (!hasNextPage || !endCursor) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('after', endCursor);
    params.delete('before');
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  function handlePrevious() {
    if (!hasPreviousPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete('after');
    params.delete('before');
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  /* Don't render if there's nothing to paginate */
  if (!hasNextPage && !hasPreviousPage) return null;

  return (
    <nav
      className="flex items-center justify-center gap-3 py-8"
      aria-label="Blog pagination"
    >
      {/* Previous */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={!hasPreviousPage || isPending}
        aria-label="Go to previous page"
        className={cn(
          'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold',
          'border border-surface-300 dark:border-surface-700',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          hasPreviousPage && !isPending
            ? [
                'bg-white dark:bg-surface-900',
                'text-surface-700 dark:text-surface-300',
                'hover:bg-surface-50 dark:hover:bg-surface-800',
                'hover:border-surface-400 dark:hover:border-surface-600',
                'hover:-translate-y-0.5 hover:shadow-sm',
              ].join(' ')
            : 'bg-surface-50 dark:bg-surface-900/50 text-surface-300 dark:text-surface-600 cursor-not-allowed opacity-50',
        )}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        )}
        Previous
      </button>

      {/* Separator dot */}
      <span
        className="w-1.5 h-1.5 rounded-full bg-surface-300 dark:bg-surface-600"
        aria-hidden="true"
      />

      {/* Next */}
      <button
        type="button"
        onClick={handleNext}
        disabled={!hasNextPage || isPending}
        aria-label="Go to next page"
        className={cn(
          'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold',
          'border border-surface-300 dark:border-surface-700',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          hasNextPage && !isPending
            ? [
                'bg-primary-600 hover:bg-primary-500',
                'text-white border-primary-600 hover:border-primary-500',
                'hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary-500/25',
              ].join(' ')
            : 'bg-surface-50 dark:bg-surface-900/50 text-surface-300 dark:text-surface-600 cursor-not-allowed opacity-50',
        )}
      >
        Next
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
    </nav>
  );
}

export default Pagination;
