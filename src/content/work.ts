/**
 * Shared, publishable project content for the Atlas pages and the Workspace.
 * Sources and evidence status are tracked in docs/engineering-atlas/evidence.md, never here.
 */
export interface WorkLink {
  label: string;
  href: string;
}

/** One decision or flow stage in a case study, always tied to a public source that shows it. */
export interface CaseStudyPoint {
  title: string;
  detail: string;
  source: WorkLink;
}

/** Evidence-backed depth for a flagship project; omitted where no public source exists. */
export interface CaseStudy {
  decisions: CaseStudyPoint[];
  /** Ordered path of one request through the system, traced from the code. */
  flow: CaseStudyPoint[];
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
  caseStudy?: CaseStudy;
}

const WP_AGENT_AI_SRC = 'https://github.com/bhattaganesh/wp-agent-ai/blob/dff0e3c3e57ff4d95b81940b5913f7529cd0fc09';

/** A source link to a file in WP Agent AI at the commit the case study was traced from. */
const agentSource = (file: string): WorkLink => ({ label: file.split('/').pop() ?? file, href: `${WP_AGENT_AI_SRC}/${file}` });

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
    summary: 'An open-source Gutenberg plugin that turns a prompt into validated, editable blocks, with an AI sidebar and voice input.',
    role: 'Author',
    organization: 'Personal, open source',
    year: '2026',
    stack: ['PHP 8.1', 'React', 'Gutenberg', 'OpenRouter', 'Server-Sent Events'],
    owned:
      'All of it, as sole author: the PHP backend (REST and streaming endpoints, encryption, rate limiting), the two blocks, the editor sidebar and the settings app.',
    links: [{ label: 'Source on GitHub', href: 'https://github.com/bhattaganesh/wp-agent-ai' }],
    flagship: true,
    caseStudy: {
      decisions: [
        {
          title: 'Validate the whole answer before anything reaches the editor',
          detail:
            'The server reads the model’s token stream but does not forward it. It sends heartbeat comments to keep proxies from closing the connection, sanitizes the complete response, then sends the validated blocks one at a time, 300 ms apart. The editor never shows a half-parsed block, at the cost of true token-by-token streaming.',
          source: agentSource('includes/Ajax/ContentStreamHandler.php'),
        },
        {
          title: 'Treat model output as untrusted input',
          detail:
            'Generated JSON goes through an allowlist of block types and attribute keys (extensible with the wp_agent_ai_allowed_blocks filter). Wrapper text is stripped and truncated JSON is repaired or cut back to its complete blocks.',
          source: agentSource('includes/Services/BlockJsonSanitizer.php'),
        },
        {
          title: 'Encrypt the API key at rest',
          detail:
            'The OpenRouter key is stored encrypted with libsodium’s secretbox, using a key derived from the site’s AUTH_KEY and AUTH_SALT, and is decrypted only on the server when a request is made.',
          source: agentSource('includes/Services/Encryption.php'),
        },
        {
          title: 'Guard every generation request',
          detail:
            'Streaming endpoints check a nonce and the edit_posts capability, and a per-user, transient-based rate limiter rejects bursts before any paid API call.',
          source: agentSource('includes/Services/RateLimiter.php'),
        },
      ],
      flow: [
        {
          title: 'Prompt',
          detail: 'The block or sidebar posts the prompt, content type, tone and length to admin-ajax and reads the response as a stream.',
          source: agentSource('src/helpers/api/ContentStreamApi.js'),
        },
        {
          title: 'Guard',
          detail: 'The handler checks the nonce, the capability and the rate limit, then opens an event stream.',
          source: agentSource('includes/Ajax/ContentStreamHandler.php'),
        },
        {
          title: 'Generate',
          detail: 'The request goes to OpenRouter with streaming on; tokens are accumulated server-side.',
          source: agentSource('includes/Services/OpenRouterClient.php'),
        },
        {
          title: 'Validate',
          detail: 'The full answer is parsed and reduced to allowed blocks and attributes.',
          source: agentSource('includes/Services/BlockJsonSanitizer.php'),
        },
        {
          title: 'Insert',
          detail: 'Each block event becomes a real Gutenberg block (createBlock) and is placed as inner blocks the user can edit.',
          source: agentSource('src/blocks/ai-content/components/GenerateButton.js'),
        },
      ],
    },
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
