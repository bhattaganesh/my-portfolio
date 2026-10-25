export type SkillLevel = 'expert' | 'advanced' | 'intermediate';

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: Skill[];
}

/** Levels are self-assessed; every entry is backed by shipped work, the CV, or a public GitHub repository. */
export const skillCategories: SkillCategory[] = [
  {
    category: 'WordPress & PHP',
    icon: 'Server',
    skills: [
      { name: 'PHP', level: 'expert' },
      { name: 'WordPress Core', level: 'expert' },
      { name: 'Gutenberg Blocks', level: 'expert' },
      { name: 'WP REST API', level: 'expert' },
      { name: 'WooCommerce', level: 'advanced' },
    ],
  },
  {
    category: 'JavaScript & Frontend',
    icon: 'Monitor',
    skills: [
      { name: 'JavaScript (ES6+)', level: 'expert' },
      { name: 'React', level: 'expert' },
      { name: 'TypeScript', level: 'advanced' },
      { name: 'Tailwind CSS', level: 'advanced' },
    ],
  },
  {
    category: 'Payments & APIs',
    icon: 'CreditCard',
    skills: [
      { name: 'Stripe', level: 'expert' },
      { name: 'PayPal', level: 'expert' },
      { name: 'Authorize.Net', level: 'advanced' },
      { name: 'Razorpay', level: 'advanced' },
      { name: 'Lemon Squeezy', level: 'advanced' },
      { name: 'REST & webhook integrations', level: 'expert' },
    ],
  },
  {
    category: 'AI Tools & Integrations',
    icon: 'Sparkles',
    skills: [
      { name: 'Claude Code', level: 'expert' },
      { name: 'Codex', level: 'advanced' },
      { name: 'Cursor', level: 'advanced' },
      { name: 'Google Antigravity', level: 'advanced' },
      { name: 'OpenAI API', level: 'advanced' },
      { name: 'OpenRouter', level: 'advanced' },
      { name: 'MCP (Model Context Protocol)', level: 'advanced' },
    ],
  },
  {
    category: 'Database',
    icon: 'Database',
    skills: [
      { name: 'MySQL', level: 'expert' },
      { name: 'Query optimization & indexing', level: 'expert' },
    ],
  },
  {
    category: 'Dev, Testing & Security Tools',
    icon: 'Wrench',
    skills: [
      { name: 'Git & GitHub', level: 'expert' },
      { name: 'GitHub Actions', level: 'advanced' },
      { name: 'PHPUnit & Playwright', level: 'advanced' },
      { name: 'Postman & Thunder Client', level: 'advanced' },
      { name: 'Burp Suite', level: 'intermediate' },
      { name: 'Docker', level: 'intermediate' },
      { name: 'Vite / Webpack', level: 'advanced' },
    ],
  },
];
