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
  description: string;
  techStack: string[];
  projectUrl?: string;
  githubUrl?: string;
  projectType: 'Work' | 'Open Source' | 'Personal';
  projectYear: string;
  isFeatured: boolean;
  highlights: string[];
  gradientFrom?: string;
  gradientTo?: string;
  caseStudy?: CaseStudy;
}

export const projects: Project[] = [
  {
    slug: 'spectra-v3',
    title: 'Spectra Blocks — Next-Gen Page Builder',
    excerpt:
      'Core engineer on Spectra Blocks — architected key systems and built major features for this ground-up rewrite of the WordPress page builder used by 1M+ sites. Beta released in 2025.',
    description:
      'Spectra Blocks is a complete architectural rewrite of Brainstorm Force\'s flagship WordPress page builder plugin. As a core contributor, I designed key architectural components and built many of the major features. The rewrite targets performance, extensibility, and a modern developer experience. Beta released to the community in 2025, it introduces a redesigned block system, improved Gutenberg integration, and significant performance improvements over the previous version.',
    techStack: ['PHP', 'JavaScript', 'React', 'WordPress', 'Gutenberg', 'REST API', 'Webpack'],
    projectUrl: 'https://wpspectra.com',
    githubUrl: 'https://github.com/brainstormforce/spectra',
    projectType: 'Work',
    projectYear: '2025',
    isFeatured: true,
    highlights: [
      'Core architect of key systems in v3 rewrite',
      'Beta released to 1M+ install user base',
      'Ground-up redesign of block system & performance',
      'Built at Brainstorm Force',
    ],
    gradientFrom: '#4c6ef5',
    gradientTo: '#748ffc',
    caseStudy: {
      challenge:
        'The existing Spectra codebase had accumulated years of technical debt — inconsistent block APIs, slow render times, and no clear architectural pattern for extensibility. With 1M+ active installs, a ground-up rewrite had to ship without disrupting the existing user base.',
      solution:
        'Designed a new block architecture with a unified API layer, lazy-loaded block assets, and a composable settings system. Introduced a strict code-splitting strategy and a performance budget enforced via CI. Delivered a beta to the community while maintaining the stable v2 branch in parallel.',
      results: [
        'Block render time reduced by 40% in internal benchmarks',
        'API surface area reduced by 30% while maintaining backward compatibility',
        'Beta shipped on time to 1M+ site community',
        'CI performance budget prevents regressions automatically',
      ],
      metrics: [
        { label: 'Active Installs', value: '1M+' },
        { label: 'Render Improvement', value: '40%' },
        { label: 'API Reduction', value: '30%' },
        { label: 'Release Year', value: '2025' },
      ],
    },
  },
  {
    slug: 'spectra',
    title: 'Spectra — WordPress Page Builder',
    excerpt:
      'A Gutenberg blocks plugin with 30+ customizable blocks, popup builder, and coming soon mode. Powers 1M+ active WordPress sites worldwide.',
    description:
      'Spectra extends the WordPress block editor with 30+ free customizable blocks, advanced page building features, a full-featured popup builder, and a coming soon mode. It is one of the most widely used Gutenberg block plugins in the WordPress ecosystem, actively maintained with frequent releases.',
    techStack: ['PHP', 'JavaScript', 'React', 'WordPress', 'Gutenberg', 'REST API'],
    projectUrl: 'https://wordpress.org/plugins/ultimate-addons-for-gutenberg/',
    githubUrl: 'https://github.com/brainstormforce/spectra',
    projectType: 'Work',
    projectYear: '2025',
    isFeatured: false,
    highlights: [
      '1M+ active WordPress installations',
      '4.7/5 stars with 1,600+ five-star reviews',
      '185+ releases — actively maintained',
      'Built at Brainstorm Force',
    ],
    gradientFrom: '#4c6ef5',
    gradientTo: '#748ffc',
  },
  {
    slug: 'masteriyo-lms',
    title: 'Masteriyo — Learning Management System',
    excerpt:
      'A full-featured WordPress LMS plugin built with React SPA frontend and PHP backend. Features AI course generation, payment gateways, and advanced analytics.',
    description:
      'Masteriyo is a comprehensive Learning Management System for WordPress. Built as a React single-page application (using Chakra UI, React Hook Form, React Query) with a PHP/REST API backend. Integrates with payment gateways (Razorpay), OpenAI ChatGPT for intelligent course creation, and includes export/import, student progress reporting, membership plugin integrations, and enrollment management.',
    techStack: ['PHP', 'React', 'WordPress', 'Chakra UI', 'React Query', 'MySQL', 'REST API'],
    projectUrl: 'https://masteriyo.com',
    projectType: 'Work',
    projectYear: '2024',
    isFeatured: true,
    highlights: [
      'Full React SPA + PHP/REST API architecture',
      'OpenAI ChatGPT integration for course creation',
      'Payment gateways, student progress tracking',
      'Built at ThemeGrill',
    ],
    gradientFrom: '#2b6cb0',
    gradientTo: '#2c5282',
    caseStudy: {
      challenge:
        'ThemeGrill needed to build a full-featured LMS from scratch that could compete with established players like LearnDash and LifterLMS. The product required a React SPA admin interface, a REST API backend, payment integrations, and AI-powered course creation — all built simultaneously by a small team.',
      solution:
        'Architected the React frontend using Chakra UI, React Query for server state, and React Hook Form for complex multi-step forms. Built a clean PHP/REST API backend with a service-repository pattern, integrated Razorpay for payments, and connected OpenAI ChatGPT for course generation via a prompt-engineering layer.',
      results: [
        'Shipped the MVP and all major premium features within a 1-year roadmap',
        'OpenAI integration reduced course creation time by ~80% for users',
        'Payment gateway integration handled thousands of transactions from launch',
        'Grew to a competitive LMS product with full gradebook and analytics',
      ],
      metrics: [
        { label: 'Dev Timeline', value: '1 Year' },
        { label: 'Course Creation', value: '80% Faster' },
        { label: 'Stack', value: 'React + PHP' },
        { label: 'Release Year', value: '2024' },
      ],
    },
  },
  {
    slug: 'wp-agent-ai',
    title: 'WP Agent AI — AI Agents for WordPress',
    excerpt:
      'An open source framework that integrates LLM-powered AI agents directly into WordPress and the Gutenberg editor. Built with PHP and React.',
    description:
      'WP Agent AI is an open source project that brings modern AI agent capabilities into the WordPress ecosystem. It enables AI-powered content generation, block editing assistance, and custom agent workflows directly inside the Gutenberg editor and WordPress admin. Built with a PHP backend and React-based editor integration.',
    techStack: ['PHP', 'React', 'JavaScript', 'WordPress', 'Gutenberg', 'OpenAI API', 'REST API'],
    githubUrl: 'https://github.com/bhattaganesh/wp-agent-ai',
    projectType: 'Personal',
    projectYear: '2025',
    isFeatured: true,
    highlights: [
      'AI agent framework integrated into Gutenberg editor',
      'LLM-powered content generation for WordPress',
      'Open source — built and maintained independently',
      'PHP backend + React editor integration',
    ],
    gradientFrom: '#6d28d9',
    gradientTo: '#4c1d95',
    caseStudy: {
      challenge:
        'WordPress has no native support for AI agents or LLM-powered workflows. Existing AI WordPress plugins were simple chatbots — not proper agent systems. Building a real agent framework inside WordPress\'s hook-based, request-scoped PHP architecture required rethinking how agents maintain context and chain tool calls.',
      solution:
        'Designed a PHP agent runtime that uses WordPress\'s transients and options API for state persistence between requests. Built a tool-calling abstraction that maps Gutenberg editor actions (insert block, update content, query posts) to LLM function calls. The React editor integration streams responses via REST and updates blocks in real-time.',
      results: [
        'Fully functional AI agent runtime inside WordPress with no extra infrastructure',
        'Supports multi-step tool chaining: query → transform → insert into editor',
        'Open source — published on GitHub for community use and extension',
        'Demonstrates a new architectural pattern for AI in PHP-based CMSes',
      ],
      metrics: [
        { label: 'Type', value: 'Open Source' },
        { label: 'LLM Support', value: 'OpenAI' },
        { label: 'Stack', value: 'PHP + React' },
        { label: 'Release Year', value: '2025' },
      ],
    },
  },
  {
    slug: 'user-registration',
    title: 'User Registration — WordPress Plugin',
    excerpt:
      'A drag-and-drop user registration plugin for WordPress with passwordless login, CAPTCHA, geo-location, and conditional logic. Used by thousands of sites.',
    description:
      'User Registration is a feature-rich WordPress plugin for building custom registration and login forms. Contributed advanced features including passwordless login (magic link), conditional logic for form fields, Google reCAPTCHA / hCaptcha integration, and a geo-location addon that auto-fills country/region fields based on visitor IP.',
    techStack: ['PHP', 'JavaScript', 'WordPress', 'REST API', 'MySQL'],
    projectUrl: 'https://wpuserregistration.com',
    projectType: 'Work',
    projectYear: '2023',
    isFeatured: false,
    highlights: [
      'Passwordless login via magic link email',
      'Conditional logic for dynamic form fields',
      'CAPTCHA integration (reCAPTCHA & hCaptcha)',
      'Built at ThemeGrill',
    ],
    gradientFrom: '#047857',
    gradientTo: '#065f46',
  },
  {
    slug: 'everest-forms',
    title: 'Everest Forms — Contact Form Plugin',
    excerpt:
      'A WordPress contact form plugin with 30+ integrations including payment gateways, CRM tools, and cloud storage. Used by thousands of WordPress sites.',
    description:
      'Everest Forms is a powerful WordPress form builder with an extensive addon ecosystem. Contributed advanced features including Authorize.Net payment integration, Amazon S3 and OneDrive cloud storage, CRM/email marketing addons (ZohoCRM, Sendinblue, Constant Contact, Drip, GetResponse), discount coupons, and complex form fields.',
    techStack: ['PHP', 'JavaScript', 'WordPress', 'REST API', 'MySQL'],
    projectUrl: 'https://everestforms.net',
    projectType: 'Work',
    projectYear: '2023',
    isFeatured: true,
    highlights: [
      'Authorize.Net credit card payment integration',
      'Amazon S3 + OneDrive cloud storage addons',
      'CRM integrations: ZohoCRM, Sendinblue, Drip',
      'Built at ThemeGrill',
    ],
    gradientFrom: '#276749',
    gradientTo: '#2f855a',
  },
];
