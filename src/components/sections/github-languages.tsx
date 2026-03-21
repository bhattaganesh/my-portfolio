'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';
import { useGithubStats } from '@/hooks/use-github-stats';
import { SITE_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

// Hardcoded from GitHub profile — contributions require GraphQL + auth to fetch live
const TOTAL_CONTRIBUTIONS = 1782;
const CONTRIBUTIONS_SINCE = 'Apr 2019';

const LANG_COLORS: Record<string, { color: string; bg: string }> = {
  JavaScript: { color: 'bg-yellow-400',  bg: 'bg-yellow-400/10 text-yellow-700 dark:text-yellow-300' },
  TypeScript: { color: 'bg-blue-500',    bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-300' },
  PHP:        { color: 'bg-violet-500',  bg: 'bg-violet-500/10 text-violet-700 dark:text-violet-300' },
  HTML:       { color: 'bg-orange-500',  bg: 'bg-orange-500/10 text-orange-700 dark:text-orange-300' },
  CSS:        { color: 'bg-pink-500',    bg: 'bg-pink-500/10 text-pink-700 dark:text-pink-300' },
};

// Approximate language percentages from GitHub profile
const LANG_PERCENTAGES: Record<string, number> = {
  JavaScript: 64,
  HTML: 22,
  CSS: 6,
  PHP: 3,
  TypeScript: 5,
};

function SkeletonPill() {
  return <div className="h-8 w-28 rounded-lg bg-surface-200 dark:bg-surface-700 animate-pulse" />;
}

export function GithubLanguages() {
  const { stats, loading } = useGithubStats();

  const topLangs = stats?.topLanguages.slice(0, 5) ?? [];

  return (
    <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-950">
        <div className="flex items-center gap-2">
          <Github className="w-4 h-4 text-surface-500 dark:text-surface-400" />
          <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">
            github.com/bhattaganesh
          </span>
        </div>
        <Link
          href={SITE_CONFIG.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors"
        >
          View Profile →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-surface-100 dark:divide-surface-800">

        {/* Hero stat: Total Contributions */}
        <ScrollReveal direction="up" delay={0} className="col-span-1">
          <div className="flex flex-col items-center justify-center px-6 py-8 text-center bg-gradient-to-b from-primary-50 to-white dark:from-primary-950/30 dark:to-surface-900">
            <span className="text-4xl font-bold font-display text-primary-600 dark:text-primary-400 tracking-tight">
              {TOTAL_CONTRIBUTIONS.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-surface-700 dark:text-surface-300 mt-1">
              Total Contributions
            </span>
            <span className="text-xs text-surface-400 dark:text-surface-500 mt-1">
              Since {CONTRIBUTIONS_SINCE}
            </span>
          </div>
        </ScrollReveal>

        {/* PRs + Commits */}
        <div className="col-span-2 divide-y divide-surface-100 dark:divide-surface-800">

          <ScrollReveal direction="up" delay={0.08}>
            <div className="flex items-center justify-between px-8 py-5">
              <span className="text-sm text-surface-500 dark:text-surface-400 font-medium">
                Pull Requests
              </span>
              {loading ? (
                <SkeletonPill />
              ) : (
                <span className="text-2xl font-bold font-display text-surface-900 dark:text-white">
                  {stats?.totalPRs ?? 79}+
                </span>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.14}>
            <div className="flex items-center justify-between px-8 py-5">
              <span className="text-sm text-surface-500 dark:text-surface-400 font-medium">
                Commits
              </span>
              {loading ? (
                <SkeletonPill />
              ) : (
                <span className="text-2xl font-bold font-display text-surface-900 dark:text-white">
                  {stats?.totalCommits ?? 177}+
                </span>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <div className="flex items-center justify-between px-8 py-5">
              <span className="text-sm text-surface-500 dark:text-surface-400 font-medium">
                Public Repos
              </span>
              {loading ? (
                <SkeletonPill />
              ) : (
                <span className="text-2xl font-bold font-display text-surface-900 dark:text-white">
                  {stats?.publicRepos ?? 23}
                </span>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Language bar */}
      <div className="px-6 py-5 border-t border-surface-100 dark:border-surface-800 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500">
          Most Used Languages
        </p>

        {/* Stacked bar */}
        <div className="flex h-2 rounded-full overflow-hidden gap-px">
          {Object.entries(LANG_PERCENTAGES).map(([lang, pct]) => (
            <div
              key={lang}
              className={cn('h-full', LANG_COLORS[lang]?.color ?? 'bg-surface-300')}
              style={{ width: `${pct}%` }}
              title={`${lang}: ${pct}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pt-1">
          {(loading ? Object.keys(LANG_PERCENTAGES) : topLangs).map((lang) => {
            const pct = LANG_PERCENTAGES[lang];
            const style = LANG_COLORS[lang];
            return (
              <span
                key={lang}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium',
                  style?.bg ?? 'bg-surface-100 text-surface-600',
                )}
              >
                <span className={cn('w-2 h-2 rounded-full', style?.color ?? 'bg-surface-400')} />
                {lang}
                {pct && <span className="opacity-60">{pct}%</span>}
              </span>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="px-6 py-3 border-t border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-950">
        <p className="text-[11px] text-surface-400 dark:text-surface-600">
          Professional work is in private org repos at Brainstorm Force & ThemeGrill
        </p>
      </div>
    </div>
  );
}
