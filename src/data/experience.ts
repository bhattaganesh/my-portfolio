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

export const experience: ExperienceItem[] = [
  {
    type: 'work',
    title: 'Software Developer',
    organization: 'Brainstorm Force',
    location: 'Remote (Pune, India)',
    startDate: 'Jan 2025',
    endDate: 'Present',
    description: [
      'Core engineer on Spectra Blocks — designed key architectural components and built many of the major features for this ground-up rewrite of the 1M+ install WordPress page builder (beta released)',
      'Building full-stack features for Spectra (PHP, JavaScript, React, Gutenberg) serving over 1 million active WordPress sites',
      'Built wp-agent-ai — an open source AI agent framework that integrates LLM capabilities directly into WordPress and the Gutenberg editor',
      'Improving system performance, plugin architecture, and security practices across products',
    ],
    technologies: ['PHP', 'React', 'JavaScript', 'WordPress', 'Gutenberg', 'REST API'],
    organizationUrl: 'https://brainstormforce.com',
  },
  {
    type: 'work',
    title: 'PHP Developer',
    organization: 'ThemeGrill Pvt. Ltd.',
    location: 'Kathmandu, Nepal (Hybrid)',
    startDate: 'Dec 2021',
    endDate: 'Jan 2025',
    description: [
      'Built advanced features for Everest Forms — discount coupons, cloud storage (Amazon S3, OneDrive), Authorize.Net payments, CRM/email marketing integrations (ZohoCRM, Sendinblue, Drip, GetResponse)',
      'Developed Masteriyo LMS frontend (React SPA using Chakra UI, React Hook Form, React Query) and backend — payment gateways, ChatGPT course generation, export/import, student progress reporting',
      'Implemented User Registration Form features — passwordless login, conditional logic, CAPTCHA, geo-location addon',
      'Built internal analytics dashboard with complex database queries, indexing and query optimization',
    ],
    technologies: ['PHP', 'React', 'JavaScript', 'MySQL', 'WordPress', 'Chakra UI', 'React Query'],
    organizationUrl: 'https://themegrill.com',
  },
  {
    type: 'work',
    title: 'Laravel Developer (Internship)',
    organization: 'Zenlab Pvt. Ltd.',
    location: 'Kathmandu, Nepal',
    startDate: 'Jun 2021',
    endDate: 'Nov 2021',
    description: [
      'Contributed to Laravel web application projects, gaining practical skills in full-stack development',
      'Collaborated in cross-functional teams, enhancing teamwork and communication practices',
    ],
    technologies: ['PHP', 'Laravel', 'MySQL', 'JavaScript'],
    organizationUrl: 'https://zenlab.com.np',
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
