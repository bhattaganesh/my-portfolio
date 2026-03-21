'use client';

import { useState, useEffect } from 'react';

export interface GithubStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  topLanguages: string[];
}

interface GithubUser {
  public_repos: number;
  followers: number;
}

interface GithubRepo {
  stargazers_count: number;
  language: string | null;
  fork: boolean;
}

const GITHUB_USERNAME = 'bhattaganesh';

export function useGithubStats() {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
            headers: { Accept: 'application/vnd.github.v3+json' },
          }),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
            headers: { Accept: 'application/vnd.github.v3+json' },
          }),
        ]);

        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');

        const user: GithubUser = await userRes.json();
        const repos: GithubRepo[] = await reposRes.json();

        const ownRepos = repos.filter((r) => !r.fork);
        const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);

        const langCounts: Record<string, number> = {};
        for (const repo of ownRepos) {
          if (repo.language) langCounts[repo.language] = (langCounts[repo.language] ?? 0) + 1;
        }
        const topLanguages = Object.entries(langCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([lang]) => lang);

        // Fetch PR + commit counts separately so one failure doesn't break everything
        let totalPRs = 0;
        let totalCommits = 0;

        try {
          const prsRes = await fetch(
            `https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:pr&per_page=1`,
            { headers: { Accept: 'application/vnd.github.v3+json' } },
          );
          if (prsRes.ok) {
            const data = await prsRes.json();
            totalPRs = Number(data?.total_count) || 0;
          }
        } catch { /* ignore */ }

        try {
          const commitsRes = await fetch(
            `https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}&per_page=1`,
            { headers: { Accept: 'application/vnd.github.cloak-preview+json' } },
          );
          if (commitsRes.ok) {
            const data = await commitsRes.json();
            totalCommits = Number(data?.total_count) || 0;
          }
        } catch { /* ignore */ }

        if (!cancelled) {
          setStats({
            publicRepos: user.public_repos,
            followers: user.followers,
            totalStars,
            totalCommits,
            totalPRs,
            topLanguages,
          });
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
}
