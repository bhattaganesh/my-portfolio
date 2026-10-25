export interface ExperienceItem {
  type: 'work' | 'education';
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string[];
  technologies?: string[];
  organizationUrl?: string;
}

/** Work entries match the master CV (Documents/Resume-2026). */
export const experience: ExperienceItem[] = [
  {
    type: 'work',
    title: 'Senior Developer',
    organization: 'ThemeGrill',
    location: 'Kathmandu, Nepal (Hybrid)',
    startDate: 'Apr 2026',
    endDate: 'Present',
    description: [
      'Senior developer across ThemeGrill’s WordPress products, focused on new features, stability, performance and security. My current work spans User Registration & Membership, Masteriyo LMS, Magazine Blocks and BlockArt',
      'Masteriyo LMS: led a security review of the REST API, fixed large courses that were timing out, and built a “View as Student” preview, an Abilities API layer for AI agents and a rebuilt course-migration engine',
      'User Registration & Membership: resolved critical PayPal, Stripe and Authorize.Net subscription issues and refactored the legacy code behind them; extended WooCommerce content restriction and made the forms accessible',
      'Magazine Blocks and BlockArt: moved Magazine Blocks to Block API v3, shipped security hardening and regular releases, and kept both plugins ready for PHP 8.5 and WordPress 7.1',
      'Engineering practice: PHPUnit and Playwright test suites, regression tests for payment and security fixes, and automated releases with GitHub Actions',
    ],
    technologies: ['PHP', 'React', 'TypeScript', 'WordPress', 'Gutenberg', 'REST API', 'PHPUnit', 'Playwright'],
    organizationUrl: 'https://themegrill.com',
  },
  {
    type: 'work',
    title: 'Software Engineer',
    organization: 'Brainstorm Force',
    location: 'Remote',
    startDate: 'Jan 2025',
    endDate: 'Mar 2026',
    description: [
      'Core developer on Spectra v3, the ground-up rebuild of Spectra to current WordPress standards. It shipped several betas inside the original plugin, then launched as the new Spectra Blocks plugin',
      'Laid much of its foundation: the plugin structure, the first blocks, the extension framework and the REST API layer',
      'Built major blocks and extensions on top of it, including Post, Content, Countdown, the Pro Loop Builder, Dynamic Content, Animations, Motion Effects, Responsive Controls and Sticky Container',
      'Moved the block set to Block API v3, wrote developer documentation and resolved the WordPress.org review findings for Spectra Blocks',
      'Kept Spectra Legacy (1,000,000+ installs) healthy with bug, security and performance fixes',
    ],
    technologies: ['PHP', 'React', 'JavaScript', 'WordPress', 'Gutenberg', 'Interactivity API', 'Block API v3'],
    organizationUrl: 'https://brainstormforce.com',
  },
  {
    type: 'work',
    title: 'PHP Developer (Intern → Junior → Senior)',
    organization: 'ThemeGrill',
    location: 'Kathmandu, Nepal (Hybrid)',
    startDate: 'Dec 2021',
    endDate: 'Jan 2025',
    description: [
      'Joined as an intern with no WordPress background. After two months as an intern I was appointed Junior PHP Developer, and later promoted to Senior PHP Developer',
      'Everest Forms (about a year): built premium add-ons for payments, cloud storage and CRM, new field types, webhooks and entry exports',
      'User Registration (about five months): passwordless login, profile completeness, conditional logic and a reworked login flow',
      'Internal analytics: a reporting dashboard over indexed, company-wide usage data',
      'Masteriyo LMS (about a year and a half): led backend development and built many of its core features; reviewed code, mentored developers and interviewed candidates',
    ],
    technologies: ['PHP', 'React', 'JavaScript', 'MySQL', 'WordPress', 'Chakra UI', 'React Query'],
    organizationUrl: 'https://themegrill.com',
  },
  {
    type: 'education',
    title: 'B.Sc. CSIT',
    organization: 'Siddhanath Science Campus (Tribhuvan University)',
    location: 'Mahendranagar, Nepal',
    startDate: '2016',
    endDate: '2021',
    description: ['Computer Science and Information Technology'],
  },
  {
    type: 'education',
    title: 'High School (I.Sc.)',
    organization: 'Aishwariya Vidya Niketan',
    location: 'Dhangadhi, Kailali',
    startDate: '2014',
    endDate: '2016',
    description: ['Science stream'],
  },
  {
    type: 'education',
    title: 'School Leaving Certificate (SLC)',
    organization: 'Shree Bir Bal Bhadra H.S. School',
    location: 'Koteli, Dadeldhura',
    startDate: '2004',
    endDate: '2014',
    description: ['Completed SLC'],
  },
];
