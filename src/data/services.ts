export interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export const services: Service[] = [
  {
    icon: 'Blocks',
    title: 'WordPress & Gutenberg Development',
    description:
      'Custom WordPress plugins, Gutenberg blocks, and theme development with modern architecture and best practices.',
    features: [
      'Custom Gutenberg block development',
      'WordPress plugin architecture',
      'REST API & WPGraphQL integration',
      'Performance optimization',
    ],
  },
  {
    icon: 'Layers',
    title: 'Full-Stack Web Development',
    description:
      'End-to-end web application development from database design to React frontends.',
    features: [
      'React + TypeScript frontend',
      'PHP backend development',
      'MySQL / PostgreSQL database design',
      'API design & integration',
    ],
  },
  {
    icon: 'Zap',
    title: 'Performance & Architecture',
    description:
      'Database query optimization, code refactoring, and system-level performance improvements.',
    features: [
      'Database query optimization',
      'Code refactoring & modernization',
      'Security hardening',
      'Scalability improvements',
    ],
  },
  {
    icon: 'BookOpen',
    title: 'Technical Consulting',
    description:
      'Architecture decisions, code reviews, and mentoring for PHP, WordPress, and React projects.',
    features: [
      'Architecture & code review',
      'Technology selection guidance',
      'Team mentoring',
      'Legacy codebase assessment',
    ],
  },
];
