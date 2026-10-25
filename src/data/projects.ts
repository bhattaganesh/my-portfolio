export interface CaseStudy {
  challenge: string;
  solution: string;
  results: string[];
  metrics: { label: string; value: string }[];
}

export interface Project {
  slug: string;
  title: string;
  excerpt: string;
  /** Paragraphs separated by a blank line ("\n\n"). */
  description: string;
  techStack: string[];
  /** The product's own page, usually its wordpress.org plugin listing. */
  projectUrl?: string;
  githubUrl?: string;
  /** Public documentation for the product. */
  docsUrl?: string;
  /** The product's marketing site. */
  websiteUrl?: string;
  /** Public list of my commits in the product's repository. */
  commitsUrl?: string;
  projectType: 'Work' | 'Open Source' | 'Personal';
  projectYear: string;
  isFeatured: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  caseStudy?: CaseStudy;
}

const DEFAULT_GRADIENT = { from: '#1e2f7a', to: '#3b5bdb' };

/**
 * Header gradient for a project card or banner. Both stops are dark enough for white text to meet WCAG AA.
 *
 * @param project The project to colour.
 * @returns A CSS linear-gradient value.
 */
export function projectGradient(project: Project): string {
  const from = project.gradientFrom ?? DEFAULT_GRADIENT.from;
  const to = project.gradientTo ?? DEFAULT_GRADIENT.to;
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}

/**
 * Every fact here traces to the master CV (Documents/Resume-2026), Ganesh's own account, his merged pull requests,
 * or a public page. Install counts are wordpress.org figures checked on 24 Oct 2026; they describe each product.
 */
export const projects: Project[] = [
  {
    slug: 'masteriyo-lms',
    gradientFrom: '#4c1d95',
    gradientTo: '#7c3aed',
    title: 'Masteriyo — Learning Management System',
    excerpt:
      'The product I have shaped most: a WordPress LMS where I led backend development and built many of its core features.',
    description:
      'Masteriyo is a full learning management system for WordPress, with a React single-page admin built on a PHP REST API. I joined the product in 2023 and grew into leading its backend development, alongside the product’s team lead. Beyond the code, I reviewed pull requests, mentored newer developers and helped hire through technical interviews, and in 2026 I returned to the product as a Senior Developer.\n\n' +
      'Much of what instructors and students use every day came out of that work. For learning: AI course generation with OpenAI, SCORM support, course bundles, group courses, a certificate builder and password-protected courses. For selling: Razorpay and Lemon Squeezy payments, multiple currencies and WooCommerce products. For accounts and operations: email verification, two-factor authentication, QR-code login, bulk import and export with background processing, progress reporting, and tools that migrate courses from LifterLMS, MasterStudy and other LMS plugins. I also built its integrations with User Registration, Restrict Content Pro, Elementor and several email-marketing and CRM services.\n\n' +
      'Since returning, I have gone deeper rather than wider: a thorough security review of the REST API, a fix for large courses that were timing out, a “View as Student” preview for instructors, an Abilities API layer that lets AI agents work with the LMS, a migration engine rebuilt on Action Scheduler, and an H5P integration.',
    techStack: ['PHP', 'React', 'REST API', 'Chakra UI', 'React Query', 'MySQL', 'OpenAI API', 'Action Scheduler'],
    projectUrl: 'https://wordpress.org/plugins/learning-management-system/',
    docsUrl: 'https://docs.masteriyo.com/',
    websiteUrl: 'https://masteriyo.com/',
    projectType: 'Work',
    projectYear: '2023 – 25, 2026',
    isFeatured: true,
    caseStudy: {
      challenge:
        'An LMS has to keep growing with its customers: bigger courses, more ways to sell them, more integrations, and an API that every part of the product depends on, all without slowing down or opening security gaps.',
      solution:
        'Led the backend through its main growth years and built many of the features it is known for. Back on the product in 2026, I reviewed the REST API end to end for security and reworked the course-progress code so large courses no longer slow down as they grow.',
      results: [
        'AI course generation, course bundles, group courses, multiple currencies, SCORM and certificates',
        'Course migration from five other LMS plugins, rebuilt on Action Scheduler in 2026',
        'A hardened REST API, including fixes for two vulnerabilities rated CVSS 8.8',
        'Fixed timeouts on large courses by removing per-lesson database queries from course progress',
      ],
      metrics: [
        { label: 'Active installs', value: '6,000+' },
        { label: 'Merged pull requests', value: '238' },
        { label: 'Role', value: 'Backend lead' },
        { label: 'Years', value: '2023 – 25, 2026' },
      ],
    },
  },
  {
    slug: 'spectra-v3',
    gradientFrom: '#312e81',
    gradientTo: '#4f46e5',
    title: 'Spectra Blocks (Spectra v3)',
    excerpt:
      'Core developer on the ground-up rebuild of Spectra, working on its core architecture and building many of its major blocks and extensions.',
    description:
      'Spectra is a Gutenberg block plugin with 1,000,000+ active installs. Soon after I joined Brainstorm Force, the team began rebuilding it from scratch as Spectra v3: current WordPress and Gutenberg standards, Block API v3, the Interactivity API, tighter core compatibility and AI features. The rebuild shipped several betas inside the original plugin before the team released it as a separate plugin, Spectra Blocks, and renamed the original Spectra Legacy.\n\n' +
      'I was a core developer on the rebuild from its first commits and worked on its core architecture: the plugin structure, the first blocks, the extension framework and the REST API layer. On top of that foundation I built many of its major features: the Post and Countdown blocks, the Pro Loop Builder, the Content block (co-built with the team), and extensions such as Dynamic Content, Animations, Motion Effects, Responsive Controls and Sticky Container. Along the way I moved the block set to Block API v3, wrote developer documentation, and resolved the WordPress.org review findings for Spectra Blocks.',
    techStack: ['PHP', 'React', 'JavaScript', 'Gutenberg', 'Block API v3', 'Interactivity API', 'REST API'],
    projectUrl: 'https://wordpress.org/plugins/spectra-blocks/',
    docsUrl: 'https://wpspectra.com/docs/',
    websiteUrl: 'https://wpspectra.com/',
    projectType: 'Work',
    projectYear: '2025 – 2026',
    isFeatured: true,
    caseStudy: {
      challenge:
        'Rebuild a block plugin with 1,000,000+ active installs from scratch, to today’s WordPress standards, without losing what made it popular.',
      solution:
        'Started with the foundation: the plugin structure, how blocks are registered, an extension framework that lets one feature work across every block, and the REST API layer. Then built major blocks and extensions on top of it, with documentation for the developers extending them.',
      results: [
        'Several v3 betas shipped inside the original Spectra plugin',
        'Released as its own plugin, Spectra Blocks; the original became Spectra Legacy',
        'Blocks built on Block API v3 and the Interactivity API',
        'Developer documentation for the Pro Loop Builder and the move to Block API v3',
      ],
      metrics: [
        { label: 'Spectra Blocks installs', value: '60,000+' },
        { label: 'Spectra Legacy installs', value: '1,000,000+' },
        { label: 'My commits', value: '1,049' },
        { label: 'Months on the team', value: '15' },
      ],
    },
  },
  {
    slug: 'user-registration',
    gradientFrom: '#064e3b',
    gradientTo: '#047857',
    title: 'User Registration & Membership',
    excerpt:
      'Registration, login and paid memberships for 50,000+ sites. I work across its payments, features and code quality.',
    description:
      'User Registration & Membership (originally User Registration) powers custom registration and login forms and paid memberships on more than 50,000 WordPress sites.\n\n' +
      'My first stint on it, in 2022–23, was feature work: passwordless login, profile completeness, conditional logic for the submit button, bulk option uploads, email-change confirmation and a CAPTCHA for password resets, along with a rework of login-form processing and fixes for user-reported security issues.\n\n' +
      'Since 2026 I have concentrated on the parts that carry real money. I have made subscription billing dependable across PayPal, Stripe and Authorize.Net, resolving critical payment and renewal issues and refactoring the legacy code behind them. I also extended WooCommerce content restriction, improved the accessibility of the front-end forms against WCAG 2.2 AA, trimmed what loads on every public page, and reworked the setup wizard, settings search and Tools screen.',
    techStack: ['PHP', 'JavaScript', 'WordPress', 'PayPal', 'Stripe', 'Authorize.Net', 'REST API', 'MySQL'],
    projectUrl: 'https://wordpress.org/plugins/user-registration/',
    docsUrl: 'https://docs.wpuserregistration.com/',
    websiteUrl: 'https://wpuserregistration.com/',
    githubUrl: 'https://github.com/themegrill/user-registration',
    commitsUrl: 'https://github.com/themegrill/user-registration/commits?author=bhattaganesh',
    projectType: 'Work',
    projectYear: '2022 – 23, 2026',
    isFeatured: true,
    caseStudy: {
      challenge:
        'A membership plugin carries real money: sign-ups, upgrades, renewals and cancellations across several payment gateways, on tens of thousands of sites. It has to stay dependable while it keeps gaining features.',
      solution:
        'Worked through the subscription flows across PayPal, Stripe and Authorize.Net, refactored the legacy code behind long-standing issues, and kept building features, with regression tests and clear test plans for payment changes.',
      results: [
        'Dependable upgrades, renewals and cancellations across PayPal, Stripe and Authorize.Net',
        'WooCommerce content restriction that blocks purchases and hides restricted products and prices',
        'More accessible front-end forms (WCAG 2.2 AA fixes) that load less on every page',
        'Earlier features including passwordless login, profile completeness and email-change confirmation',
      ],
      metrics: [
        { label: 'Active installs', value: '50,000+' },
        { label: 'Payment gateways', value: '3' },
        { label: 'Role', value: 'Senior Developer' },
        { label: 'Years', value: '2022 – 23, 2026' },
      ],
    },
  },
  {
    slug: 'magazine-blocks',
    gradientFrom: '#7c2d12',
    gradientTo: '#c2410c',
    title: 'Magazine Blocks',
    excerpt:
      'Magazine and news layouts for the block editor, used on 6,000+ sites: features, security and releases.',
    description:
      'Magazine Blocks gives WordPress sites more than 30 blocks for magazine and news layouts, from post grids, sliders and news tickers to a full site builder.\n\n' +
      'Since rejoining ThemeGrill I have driven its development. I moved every block to Block API v3 for the new iframe editor, shipped a series of security hardening and long-standing fixes, added opt-in usage analytics with a clear consent flow, and keep each release ready for new PHP and WordPress versions through an automated GitHub Actions workflow.',
    techStack: ['PHP', 'React', 'TypeScript', 'Gutenberg', 'GitHub Actions', 'Playwright'],
    projectUrl: 'https://wordpress.org/plugins/magazine-blocks/',
    docsUrl: 'https://docs.wpblockart.com/magazine-blocks/',
    websiteUrl: 'https://wpblockart.com/magazine-blocks/',
    projectType: 'Work',
    projectYear: '2026',
    isFeatured: true,
  },
  {
    slug: 'blockart',
    gradientFrom: '#164e63',
    gradientTo: '#0e7490',
    title: 'BlockArt Blocks',
    excerpt:
      'A library of Gutenberg blocks, sections and templates used on 10,000+ sites: features, rendering and releases.',
    description:
      'BlockArt is a library of Gutenberg blocks, sections and templates, with a free and a Pro plugin.\n\n' +
      'I work across both: improving responsive behaviour and front-end rendering, rebuilding parts of the build and release pipeline (translations and Freemius deployment), adding regression tests, and keeping both plugins ready for the latest PHP and WordPress releases.',
    techStack: ['PHP', 'React', 'TypeScript', 'Gutenberg', 'GitHub Actions'],
    projectUrl: 'https://wordpress.org/plugins/blockart-blocks/',
    docsUrl: 'https://docs.wpblockart.com/',
    websiteUrl: 'https://wpblockart.com/',
    projectType: 'Work',
    projectYear: '2026',
    isFeatured: true,
  },
  {
    slug: 'everest-forms',
    gradientFrom: '#1e3a8a',
    gradientTo: '#2563eb',
    title: 'Everest Forms',
    excerpt:
      'The 90,000+ install form builder where my career began: premium add-ons, new fields and integrations.',
    description:
      'Everest Forms is where my career started. I joined ThemeGrill as an intern with no WordPress background, began working on this plugin after a few days of training, and stayed on it for about a year as a Junior PHP Developer.\n\n' +
      'I built many of its premium add-ons: Authorize.Net payments (one-time and recurring), Razorpay, discount coupons, Amazon S3 and OneDrive storage for uploads, PDF submissions, and integrations with Zoho CRM, Sendinblue, Constant Contact, Drip and GetResponse. I also added new field types (colour, payment slider, progress, subtotal and yes/no), along with webhooks, email whitelisting, usage tracking, per-form settings and entry exports in several formats.',
    techStack: ['PHP', 'JavaScript', 'WordPress', 'REST API', 'MySQL'],
    projectUrl: 'https://wordpress.org/plugins/everest-forms/',
    docsUrl: 'https://docs.everestforms.net/',
    websiteUrl: 'https://everestforms.net/',
    githubUrl: 'https://github.com/themegrill/everest-forms',
    commitsUrl: 'https://github.com/themegrill/everest-forms/commits?author=bhattaganesh',
    projectType: 'Work',
    projectYear: '2021 – 2022',
    isFeatured: true,
  },
  {
    slug: 'tg-usage-analytics',
    gradientFrom: '#27272a',
    gradientTo: '#52525b',
    title: 'ThemeGrill Usage Analytics',
    excerpt:
      'An internal analytics platform showing how ThemeGrill’s plugins and themes are installed and used.',
    description:
      'An internal plugin that gathers usage data from across ThemeGrill’s plugins and themes.\n\n' +
      'I built its analytics dashboard, with reports and charts on installs, deactivation reasons and PHP versions, and filtering, search and sorting across products and sites. I also designed and indexed the tables behind it so company-wide queries stay fast.',
    techStack: ['PHP', 'MySQL', 'JavaScript', 'WordPress'],
    projectType: 'Work',
    projectYear: '2023',
    isFeatured: false,
  },
  {
    slug: 'spectra',
    gradientFrom: '#1e1b4b',
    gradientTo: '#4338ca',
    title: 'Spectra Legacy',
    excerpt:
      'The original Spectra, with 1,000,000+ active installs. I kept it healthy with bug, security and performance fixes.',
    description:
      'Spectra Legacy is the original Spectra plugin, first released as Ultimate Addons for Gutenberg.\n\n' +
      'While we rebuilt Spectra, I helped maintain this version for its 1,000,000+ active installs, with bug fixes, security fixes and performance improvements. The first Spectra v3 betas also shipped inside it, before v3 moved to its own plugin.',
    techStack: ['PHP', 'JavaScript', 'React', 'WordPress', 'Gutenberg'],
    projectUrl: 'https://wordpress.org/plugins/ultimate-addons-for-gutenberg/',
    docsUrl: 'https://wpspectra.com/docs/',
    websiteUrl: 'https://wpspectra.com/',
    projectType: 'Work',
    projectYear: '2025 – 2026',
    isFeatured: false,
  },
];
