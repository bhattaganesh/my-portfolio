export interface SkillCategory {
  category: string;
  icon: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: 'Backend',
    icon: 'Server',
    skills: ['PHP', 'WordPress Architecture', 'REST APIs', 'Laravel', 'Plugin Development'],
  },
  {
    category: 'Frontend',
    icon: 'Monitor',
    skills: ['React', 'TypeScript', 'JavaScript (ES6+)', 'Gutenberg Blocks', 'Tailwind CSS'],
  },
  {
    category: 'Database',
    icon: 'Database',
    skills: ['MySQL', 'PostgreSQL', 'Query Optimization', 'Indexing'],
  },
  {
    category: 'DevOps & Tools',
    icon: 'Wrench',
    skills: ['Git', 'Docker', 'CI/CD', 'Code Review', 'Agile / Scrum'],
  },
];
