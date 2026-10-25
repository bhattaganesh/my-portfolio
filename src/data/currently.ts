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
    label: 'WordPress products at ThemeGrill',
    detail: 'New features, stability and releases across memberships, online courses and block-editor plugins',
  },
  {
    icon: 'Target',
    category: 'Improving',
    label: 'Subscription reliability',
    detail: 'Making subscription billing dependable and modernising the legacy code behind it',
  },
  {
    icon: 'Sparkles',
    category: 'In practice',
    label: 'AI-assisted development',
    detail: 'AI coding agents in my daily workflow, with every change still going through code review and automated tests',
  },
];
