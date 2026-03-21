export interface CurrentItem {
  icon: string;
  category: string;
  label: string;
  detail: string;
}

export const currentlyItems: CurrentItem[] = [
  {
    icon: 'Hammer',
    category: 'Building',
    label: 'Spectra Page Builder',
    detail: 'Working on the page builder experience inside Spectra Blocks at Brainstorm Force',
  },
  {
    icon: 'Sparkles',
    category: 'Exploring',
    label: 'AI-Powered Development',
    detail: 'Using AI tools heavily day-to-day to move faster, write better code, and reduce grunt work',
  },
  {
    icon: 'Target',
    category: 'Learning',
    label: 'What Makes WordPress Products Great',
    detail: 'Studying product quality, UX decisions, and what separates good plugins from great ones',
  },
];
