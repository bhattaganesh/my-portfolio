import type { AppId, WindowSpec } from '@/workspace/wm';

/** An app the workspace can open: identity, launcher copy, window size and icon. */
export interface AppDef {
  id: AppId;
  title: string;
  description: string;
  spec: WindowSpec;
  icon: React.ReactNode;
}

const ProjectsIcon = (
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect width="48" height="48" rx="11" fill="#2F7FEF" />
    <path d="M11 0h26a11 11 0 0 1 11 11v9H0v-9A11 11 0 0 1 11 0z" fill="#5AB0FF" opacity="0.55" />
    <path d="M10 17a3 3 0 0 1 3-3h8l3 3h11a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3z" fill="#E8F3FF" />
    <path d="M10 21h28" stroke="#9CCBFF" strokeWidth="2" />
  </svg>
);

const TerminalIcon = (
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect width="48" height="48" rx="11" fill="#1C1E24" />
    <rect x="1" y="1" width="46" height="46" rx="10" fill="none" stroke="#3B3F4A" strokeWidth="1.5" />
    <path d="M13 17l7 7-7 7" fill="none" stroke="#7FE0A8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 32h11" stroke="#E6E6E6" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const AboutIcon = (
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect width="48" height="48" rx="11" fill="#F3EFE6" />
    <rect x="1" y="1" width="46" height="46" rx="10" fill="none" stroke="#D8D1C2" strokeWidth="1.5" />
    <path d="M0 30 L10 22 L17 27 L27 16 L37 25 L48 18 V37 A11 11 0 0 1 37 48 H11 A11 11 0 0 1 0 37 Z" fill="#2343D6" opacity="0.18" />
    <circle cx="24" cy="18" r="7" fill="#2343D6" />
    <path d="M11 39c2-7 7-11 13-11s11 4 13 11" fill="#2343D6" />
  </svg>
);

const SettingsIcon = (
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect width="48" height="48" rx="11" fill="#8E8E96" />
    <rect x="1" y="1" width="46" height="46" rx="10" fill="none" stroke="#6E6E76" strokeWidth="1.5" />
    <g transform="translate(24 24)" fill="#F4F4F6">
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x="-3" y="-17" width="6" height="8" rx="1.5" transform={`rotate(${i * 45})`} />
      ))}
      <circle r="11" />
    </g>
    <circle cx="24" cy="24" r="5" fill="#8E8E96" />
  </svg>
);

const ArcadeIcon = (
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect width="48" height="48" rx="11" fill="#C2531F" />
    <path d="M11 0h26a11 11 0 0 1 11 11v9H0v-9A11 11 0 0 1 11 0z" fill="#F08A5D" opacity="0.5" />
    <path d="M24 9c5 4 7 9 7 15l-3 6h-8l-3-6c0-6 2-11 7-15z" fill="#FFF4EA" />
    <circle cx="24" cy="20" r="3" fill="#C2531F" />
    <path d="M17 26l-4 6h5zM31 26l4 6h-5z" fill="#FFD3A1" />
    <path d="M21 32h6l-3 7z" fill="#FFD3A1" />
  </svg>
);

const BrowserIcon = (
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect width="48" height="48" rx="11" fill="#F4F4F6" />
    <rect x="1" y="1" width="46" height="46" rx="10" fill="none" stroke="#D5D5DB" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="14" fill="#2343D6" />
    <path d="M10 24h28M24 10c-5 4-7 9-7 14s2 10 7 14M24 10c5 4 7 9 7 14s-2 10-7 14" fill="none" stroke="#DDE3FF" strokeWidth="1.8" />
    <circle cx="24" cy="24" r="14" fill="none" stroke="#DDE3FF" strokeWidth="1.8" />
  </svg>
);

const LabIcon = (
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect width="48" height="48" rx="11" fill="#1B2230" />
    <rect x="1" y="1" width="46" height="46" rx="10" fill="none" stroke="#3A4560" strokeWidth="1.5" />
    <rect x="9" y="12" width="12" height="9" rx="2.5" fill="#8EA2FF" />
    <rect x="27" y="12" width="12" height="9" rx="2.5" fill="#F08A5D" />
    <rect x="18" y="29" width="12" height="9" rx="2.5" fill="#E9DDF2" />
    <path d="M15 21v4h18v-4M24 25v4" fill="none" stroke="#C9D2EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const APPS: readonly AppDef[] = [
  {
    id: 'projects',
    title: 'Projects',
    description: 'Case studies: what I built and owned',
    spec: { size: { w: 860, h: 560 }, min: { w: 520, h: 360 } },
    icon: ProjectsIcon,
  },
  {
    id: 'terminal',
    title: 'Terminal',
    description: 'Explore by typing portfolio commands',
    spec: { size: { w: 680, h: 420 }, min: { w: 380, h: 260 } },
    icon: TerminalIcon,
  },
  {
    id: 'browser',
    title: 'Browser',
    description: 'Portfolio pages in tabs, with bookmarks',
    spec: { size: { w: 900, h: 620 }, min: { w: 420, h: 360 } },
    icon: BrowserIcon,
  },
  {
    id: 'arcade',
    title: 'Ship It',
    description: 'A three-round engineering game',
    spec: { size: { w: 760, h: 620 }, min: { w: 400, h: 360 } },
    icon: ArcadeIcon,
  },
  {
    id: 'lab',
    title: 'Architecture Lab',
    description: 'Watch caching, queues and failures play out',
    spec: { size: { w: 820, h: 640 }, min: { w: 420, h: 380 } },
    icon: LabIcon,
  },
  {
    id: 'about',
    title: 'About Ganesh',
    description: 'Profile, experience, résumé and contact',
    spec: { size: { w: 620, h: 560 }, min: { w: 380, h: 320 } },
    icon: AboutIcon,
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Appearance, wallpaper, motion and sound',
    spec: { size: { w: 560, h: 560 }, min: { w: 380, h: 320 } },
    icon: SettingsIcon,
  },
];

/**
 * Looks up an app definition.
 *
 * @param id The app identifier.
 * @returns The definition.
 * @throws Error when the id is not registered, which indicates a programming error.
 */
export function appById(id: AppId): AppDef {
  const app = APPS.find((a) => a.id === id);
  if (!app) throw new Error(`Unknown workspace app: ${id}`);
  return app;
}
