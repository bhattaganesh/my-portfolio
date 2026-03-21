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

export const skillCategories: SkillCategory[] = [
  {
    category: 'WordPress & PHP',
    icon: 'Server',
    skills: [
      { name: 'PHP', level: 'expert' },
      { name: 'WordPress Core', level: 'expert' },
      { name: 'Gutenberg Blocks', level: 'expert' },
      { name: 'WP REST API', level: 'expert' },
      { name: 'Laravel', level: 'advanced' },
    ],
  },
  {
    category: 'JavaScript & Frontend',
    icon: 'Monitor',
    skills: [
      { name: 'JavaScript (ES6+)', level: 'expert' },
      { name: 'React', level: 'expert' },
      { name: 'TypeScript', level: 'advanced' },
      { name: 'Next.js', level: 'advanced' },
      { name: 'Tailwind CSS', level: 'advanced' },
    ],
  },
  {
    category: 'Database',
    icon: 'Database',
    skills: [
      { name: 'MySQL', level: 'expert' },
      { name: 'PostgreSQL', level: 'advanced' },
      { name: 'Redis', level: 'intermediate' },
    ],
  },
  {
    category: 'Dev Tools',
    icon: 'Wrench',
    skills: [
      { name: 'Git & GitHub', level: 'expert' },
      { name: 'Docker', level: 'intermediate' },
      { name: 'Vite / Webpack', level: 'advanced' },
      { name: 'GraphQL', level: 'intermediate' },
    ],
  },
];
