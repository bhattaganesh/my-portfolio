'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Prevent layout shift during hydration — render a same-sized placeholder */
  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === 'dark';

  function handleToggle() {
    setTheme(isDark ? 'light' : 'dark');
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        /* Layout */
        'relative flex items-center justify-center',
        'w-9 h-9 rounded-lg',
        /* Color */
        'text-surface-500 dark:text-surface-400',
        'hover:text-surface-900 dark:hover:text-surface-100',
        /* Background */
        'hover:bg-surface-100 dark:hover:bg-surface-800',
        /* Transitions */
        'transition-colors duration-200 ease-in-out',
        /* Focus */
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-950',
        className,
      )}
    >
      {isDark ? (
        <Sun
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className="transition-transform duration-200 rotate-0 hover:rotate-12"
        />
      ) : (
        <Moon
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className="transition-transform duration-200 rotate-0 hover:-rotate-12"
        />
      )}
    </button>
  );
}

export default ThemeToggle;
