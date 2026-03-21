'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function BlogSearch({ value, onChange, className }: BlogSearchProps) {
  return (
    <div className={cn('relative', className)}>
      <label htmlFor="blog-search" className="sr-only">
        Search posts
      </label>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none"
        aria-hidden="true"
      />
      <input
        id="blog-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search posts…"
        className={cn(
          'w-full pl-9 pr-9 py-2 rounded-lg text-sm',
          'bg-surface-100 dark:bg-surface-800',
          'border border-surface-200 dark:border-surface-700',
          'text-surface-900 dark:text-surface-100',
          'placeholder:text-surface-400 dark:placeholder:text-surface-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-colors duration-150',
        )}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
