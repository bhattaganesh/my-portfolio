/**
 * GitHub profile stats, fetched once at build time (the deploy workflow rebuilds daily).
 * Needs GITHUB_TOKEN for the GraphQL API; without it, or on any API error, the build
 * warns and falls back to SNAPSHOT so the site still ships.
 */

export const GITHUB_USERNAME = 'bhattaganesh';

const GRAPHQL_URL = 'https://api.github.com/graphql';
const TOP_LANGUAGE_COUNT = 5;
const OTHER_LANGUAGE_COLOR = '#9ca3af';

export interface LanguageShare {
  name: string;
  color: string;
  percent: number;
}

export interface GithubStats {
  totalContributions: number;
  contributionsSince: number;
  pullRequests: number;
  commits: number;
  publicRepos: number;
  languages: LanguageShare[];
}

/** Last known values (checked 25 Oct 2026), used only when the live fetch fails. */
const SNAPSHOT: GithubStats = {
  totalContributions: 3199,
  contributionsSince: 2019,
  pullRequests: 138,
  commits: 315,
  publicRepos: 31,
  languages: [
    { name: 'JavaScript', color: '#f1e05a', percent: 59 },
    { name: 'HTML', color: '#e34c26', percent: 21 },
    { name: 'CSS', color: '#663399', percent: 6 },
    { name: 'PHP', color: '#4F5D95', percent: 5 },
    { name: 'Blade', color: '#f7523f', percent: 2 },
    { name: 'Other', color: OTHER_LANGUAGE_COLOR, percent: 7 },
  ],
};

interface LanguageEdge {
  size: number;
  node: { name: string; color: string | null };
}

/**
 * Turns per-repository language byte counts into the top languages by share, plus "Other".
 *
 * @param edges Language edges from every repository.
 * @returns Shares in descending order whose percentages sum to 100 (empty when there is no code).
 */
export function summarizeLanguages(edges: LanguageEdge[]): LanguageShare[] {
  const totals = new Map<string, { color: string; size: number }>();
  for (const { size, node } of edges) {
    const current = totals.get(node.name);
    totals.set(node.name, { color: node.color ?? OTHER_LANGUAGE_COLOR, size: (current?.size ?? 0) + size });
  }

  const sorted = [...totals.entries()].sort((a, b) => b[1].size - a[1].size);
  const totalSize = sorted.reduce((sum, [, { size }]) => sum + size, 0);
  if (totalSize === 0) return [];

  const top = sorted.slice(0, TOP_LANGUAGE_COUNT).map(([name, { color, size }]) => ({
    name,
    color,
    percent: Math.round((size / totalSize) * 100),
  }));
  const otherPercent = 100 - top.reduce((sum, lang) => sum + lang.percent, 0);
  return otherPercent > 0 ? [...top, { name: 'Other', color: OTHER_LANGUAGE_COLOR, percent: otherPercent }] : top;
}

/**
 * Runs one GraphQL query against the GitHub API.
 *
 * @throws Error when the request fails or GitHub returns errors.
 */
async function graphql<T>(token: string, query: string): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL HTTP ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length || !json.data) throw new Error(`GitHub GraphQL: ${json.errors?.[0]?.message ?? 'no data'}`);
  return json.data;
}

/**
 * Builds one aliased contributionsCollection field per calendar year.
 *
 * @param fromYear First year to include.
 * @param toYear Last year to include.
 */
function yearlyContributionFields(fromYear: number, toYear: number): string {
  const fields: string[] = [];
  for (let year = fromYear; year <= toYear; year++) {
    fields.push(
      `y${year}: contributionsCollection(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z") { contributionCalendar { totalContributions } }`,
    );
  }
  return fields.join('\n');
}

/**
 * Fetches live stats for GITHUB_USERNAME.
 *
 * @throws Error on any API failure.
 */
async function fetchStats(token: string): Promise<GithubStats> {
  const profile = await graphql<{
    user: {
      createdAt: string;
      allRepos: { totalCount: number };
      repositories: {
        nodes: { languages: { edges: LanguageEdge[] } }[];
      };
    };
    prs: { issueCount: number };
  }>(
    token,
    `query {
      user(login: "${GITHUB_USERNAME}") {
        createdAt
        allRepos: repositories(ownerAffiliations: OWNER, privacy: PUBLIC) { totalCount }
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
          nodes { languages(first: 10) { edges { size node { name color } } } }
        }
      }
      prs: search(type: ISSUE, query: "author:${GITHUB_USERNAME} is:pr is:public") { issueCount }
    }`,
  );

  const since = new Date(profile.user.createdAt).getUTCFullYear();
  const years = await graphql<{ user: Record<string, { contributionCalendar: { totalContributions: number } }> }>(
    token,
    `query { user(login: "${GITHUB_USERNAME}") { ${yearlyContributionFields(since, new Date().getUTCFullYear())} } }`,
  );

  const commitsRes = await fetch(
    `https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}+is:public&per_page=1`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } },
  );
  if (!commitsRes.ok) throw new Error(`GitHub commit search HTTP ${commitsRes.status}`);
  const commits = Number(((await commitsRes.json()) as { total_count?: number }).total_count);
  if (!Number.isFinite(commits)) throw new Error('GitHub commit search: no total_count');

  // ponytail: first 100 public repos only; paginate if the account ever passes 100.
  const languageEdges = profile.user.repositories.nodes.flatMap((repo) => repo.languages.edges);

  return {
    totalContributions: Object.values(years.user).reduce(
      (sum, year) => sum + year.contributionCalendar.totalContributions,
      0,
    ),
    contributionsSince: since,
    pullRequests: profile.prs.issueCount,
    commits,
    publicRepos: profile.user.allRepos.totalCount,
    languages: summarizeLanguages(languageEdges),
  };
}

/**
 * Returns live GitHub stats, or the snapshot (with a build warning) when they can't be fetched.
 */
export async function getGithubStats(): Promise<GithubStats> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn('[github] GITHUB_TOKEN not set; using the snapshot GitHub stats.');
    return SNAPSHOT;
  }
  try {
    return await fetchStats(token);
  } catch (error) {
    console.warn(`[github] Live stats failed, using the snapshot: ${(error as Error).message}`);
    return SNAPSHOT;
  }
}
