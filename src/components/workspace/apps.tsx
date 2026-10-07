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
