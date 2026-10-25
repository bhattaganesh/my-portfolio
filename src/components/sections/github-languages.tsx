import Link from 'next/link';
import { Github } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import type { GithubStats } from '@/lib/github';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

interface Props {
  stats: GithubStats;
}

/**
 * GitHub activity card: contributions, PRs, commits, repos and a language bar, from build-time stats.
 */
export function GithubLanguages({ stats }: Props) {
  const rows = [
    { label: 'Pull Requests', value: stats.pullRequests.toLocaleString('en-US') },
    { label: 'Commits', value: stats.commits.toLocaleString('en-US') },
    { label: 'Public Repos', value: stats.publicRepos.toLocaleString('en-US') },
  ];

  return (
    <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-950">
        <div className="flex items-center gap-2">
          <Github className="w-4 h-4 text-surface-500 dark:text-surface-400" />
          <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">
            github.com/{SITE_CONFIG.socials.github.split('/').pop()}
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

        <ScrollReveal direction="up" delay={0} className="col-span-1">
          <div className="flex flex-col items-center justify-center h-full px-6 py-8 text-center bg-gradient-to-b from-primary-50 to-white dark:from-primary-950/30 dark:to-surface-900">
            <span className="text-4xl font-bold font-display text-primary-600 dark:text-primary-400 tracking-tight">
              {stats.totalContributions.toLocaleString('en-US')}
            </span>
            <span className="text-sm font-semibold text-surface-700 dark:text-surface-300 mt-1">
              Contributions
            </span>
            <span className="text-xs text-surface-500 dark:text-surface-400 mt-1">
              Since {stats.contributionsSince}
            </span>
          </div>
        </ScrollReveal>

        <div className="col-span-2 divide-y divide-surface-100 dark:divide-surface-800">
          {rows.map((row, i) => (
            <ScrollReveal key={row.label} direction="up" delay={0.08 + i * 0.06}>
              <div className="flex items-center justify-between px-8 py-5">
                <span className="text-sm text-surface-500 dark:text-surface-400 font-medium">
                  {row.label}
                </span>
                <span className="text-2xl font-bold font-display text-surface-900 dark:text-white">
                  {row.value}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Language bar */}
      {stats.languages.length > 0 && (
        <div className="px-6 py-5 border-t border-surface-100 dark:border-surface-800 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-surface-500 dark:text-surface-400">
            Languages in Public Repos
          </p>

          <div className="flex h-2 rounded-full overflow-hidden gap-px" role="img" aria-label={stats.languages.map((l) => `${l.name} ${l.percent}%`).join(', ')}>
            {stats.languages.map((lang) => (
              <div
                key={lang.name}
                className="h-full"
                style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
                title={`${lang.name}: ${lang.percent}%`}
              />
            ))}
          </div>

          <ul className="flex flex-wrap gap-2 pt-1">
            {stats.languages.map((lang) => (
              <li
                key={lang.name}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} aria-hidden="true" />
                {lang.name}
                <span className="text-surface-500 dark:text-surface-400">{lang.percent}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer note */}
      <div className="px-6 py-3 border-t border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-950">
        <p className="text-xs text-surface-500 dark:text-surface-400">
          Most of my work at ThemeGrill and Brainstorm Force is in private repositories, counted above without detail.
        </p>
      </div>
    </div>
  );
}
