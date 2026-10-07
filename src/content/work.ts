/**
 * Shared, publishable project content for the Atlas pages and the Workspace.
 * Sources and evidence status are tracked in docs/engineering-atlas/evidence.md, never here.
 */
export interface WorkLink {
  label: string;
  href: string;
}

export interface WorkItem {
  slug: string;
  title: string;
  summary: string;
  role: string;
  organization: string;
  year: string;
  stack: string[];
  owned: string;
  links: WorkLink[];
  flagship: boolean;
}

export const work: readonly WorkItem[] = [
  {
    slug: 'spectra',
    title: 'Spectra',
    summary:
      'Rewriting a Gutenberg page builder used on 1M+ sites without breaking the sites already on it.',
    role: 'Software Developer',
    organization: 'Brainstorm Force',
    year: '2025',
    stack: ['PHP', 'React', 'Gutenberg', 'REST API'],
    owned:
      'Designed key architectural components and built many of the major features for the ground-up rewrite, released as a beta in 2025.',
    links: [
      { label: 'Spectra on wordpress.org', href: 'https://wordpress.org/plugins/ultimate-addons-for-gutenberg/' },
    ],
    flagship: true,
  },
  {
    slug: 'masteriyo',
    title: 'Masteriyo LMS',
    summary:
      'A React single-page admin and REST backend for a WordPress learning platform, with payments and AI course drafting.',
    role: 'PHP Developer',
    organization: 'ThemeGrill',
    year: '2021 – 2025',
    stack: ['PHP', 'React', 'Chakra UI', 'React Query', 'MySQL'],
    owned:
      'Developed the React frontend (Chakra UI, React Hook Form, React Query) and backend features: payment gateways, ChatGPT course generation, export/import and student progress reporting.',
    links: [{ label: 'masteriyo.com', href: 'https://masteriyo.com' }],
    flagship: true,
  },
  {
    slug: 'wp-agent-ai',
    title: 'WP Agent AI',
    summary: 'An open-source framework that brings LLM-powered agents into WordPress and the Gutenberg editor.',
    role: 'Author',
    organization: 'Personal, open source',
    year: '2025',
    stack: ['PHP', 'React', 'Gutenberg', 'OpenAI API'],
    owned: 'Built it: an open-source AI agent framework that integrates LLM capabilities into WordPress and the Gutenberg editor.',
    links: [{ label: 'Source on GitHub', href: 'https://github.com/bhattaganesh/wp-agent-ai' }],
    flagship: true,
  },
  {
    slug: 'everest-forms',
    title: 'Everest Forms',
    summary: 'A WordPress form builder with payment, storage and CRM integrations.',
    role: 'PHP Developer',
    organization: 'ThemeGrill',
    year: '2021 – 2025',
    stack: ['PHP', 'JavaScript', 'WordPress', 'REST API'],
    owned:
      'Built discount coupons, cloud storage (Amazon S3, OneDrive), Authorize.Net payments and CRM/email marketing integrations (ZohoCRM, Sendinblue, Drip, GetResponse).',
    links: [{ label: 'everestforms.net', href: 'https://everestforms.net' }],
    flagship: false,
  },
  {
    slug: 'user-registration',
    title: 'User Registration',
    summary: 'A WordPress plugin for custom registration and login forms.',
    role: 'PHP Developer',
    organization: 'ThemeGrill',
    year: '2021 – 2025',
    stack: ['PHP', 'JavaScript', 'WordPress', 'MySQL'],
    owned: 'Implemented passwordless login, conditional logic, CAPTCHA and a geo-location addon.',
    links: [{ label: 'wpuserregistration.com', href: 'https://wpuserregistration.com' }],
    flagship: false,
  },
];

/**
 * Finds a work item by its slug.
 *
 * @param slug The URL-safe identifier of the project.
 * @returns The matching item, or undefined when no project has that slug.
 */
export function findWork(slug: string): WorkItem | undefined {
  return work.find((item) => item.slug === slug);
}

/** Old /projects/<slug>/ URLs from the previous site and the work item that replaces each one. */
export const LEGACY_PROJECT_SLUGS: Readonly<Record<string, string>> = {
  'spectra-v3': 'spectra',
  spectra: 'spectra',
  'masteriyo-lms': 'masteriyo',
  'wp-agent-ai': 'wp-agent-ai',
  'everest-forms': 'everest-forms',
  'user-registration': 'user-registration',
};
