import { SITE_CONFIG } from '@/lib/constants';

/** Career entries shown publicly; `current` stays false until employment is confirmed. */
export interface Role {
  title: string;
  organization: string;
  start: string;
  end: string | null;
  current: boolean;
}

export const profile = {
  name: 'Ganesh Bhatt',
  summary: 'Senior full-stack engineer working across WordPress, Gutenberg, React and PHP, based in Kathmandu, Nepal.',
  email: SITE_CONFIG.email,
  links: [
    { label: 'LinkedIn', href: SITE_CONFIG.socials.linkedin },
    { label: 'GitHub', href: SITE_CONFIG.socials.github },
  ],
} as const;

export const roles: readonly Role[] = [
  { title: 'Software Developer', organization: 'Brainstorm Force', start: 'Jan 2025', end: null, current: false },
  { title: 'PHP Developer', organization: 'ThemeGrill', start: 'Dec 2021', end: 'Jan 2025', current: false },
  { title: 'Laravel Developer (intern)', organization: 'Zenlab', start: 'Jun 2021', end: 'Nov 2021', current: false },
];

export const education = { title: 'B.Sc. CSIT', organization: 'Tribhuvan University', years: '2016 – 2021' } as const;

/**
 * Formats a role's dates without implying current employment unless it is confirmed.
 *
 * @param role The career entry to describe.
 * @returns "Dec 2021 – Jan 2025", "Jan 2025 – present" when confirmed, or "joined Jan 2025".
 */
export function roleDates(role: Role): string {
  if (role.end) return `${role.start} – ${role.end}`;
  return role.current ? `${role.start} – present` : `joined ${role.start}`;
}
