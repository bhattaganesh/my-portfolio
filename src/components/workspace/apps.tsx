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
