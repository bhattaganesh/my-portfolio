# Ganesh Prasad Bhatt — Portfolio

Personal portfolio for **Ganesh Prasad Bhatt**, a senior full-stack engineer in Kathmandu, Nepal. It has two parts that share one content source:

- **Engineering Atlas** (`/`, `/work/`, `/journey/`, `/contact/`): the main portfolio. It is fully readable without JavaScript.
- **Ganesh Workspace** (`/workspace/`): an optional desktop-style way to explore the same content. Its code is loaded only on that route.

**Live:** [ganeshbhatt.com.np](https://www.ganeshbhatt.com.np) (built from `main` only).

## Stack

| | Version |
| --- | --- |
| Node.js | 22.x (CI uses `22`; see `.nvmrc`). Node 23 also works locally. |
| npm | 10+ |
| Next.js | 16.2.0, App Router, static export (`output: 'export'`) |
| React | 19.2.4 |
| TypeScript | 5.9, strict |
| Tailwind CSS | 4 (CSS-based config, no `tailwind.config.js`) |
| Tests | Vitest 4 (unit), Playwright 1.63 + axe-core (E2E) |

There is no CMS, database, API route or contact form. All content lives in `src/content/`, and the build never contacts an external service.

## Set up on a new machine

```bash
git clone https://github.com/bhattaganesh/my-portfolio.git
cd my-portfolio
git switch feature/engineering-atlas   # current work branch
nvm use                                 # or install Node 22
npm ci
npx playwright install                  # browsers for E2E (once per machine)
```

No environment variables are required. Optional ones are listed in `.env.example` (names only):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID; analytics loads only when it is set |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Overrides the built-in Search Console token |

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) on http://localhost:3000 |
| `npm run lint` | ESLint |
| `npm run type-check` | `tsc --noEmit` |
| `npm test` | Vitest unit tests |
| `npm run build` | Static export to `out/`, then `scripts/fix-segment-names.mjs` (a fix for Windows-only export paths) |
| `node scripts/serve-out.mjs 4310` | Serves `out/` the way GitHub Pages does (trailing-slash redirects, 404 page) |
| `npm run test:e2e` | Playwright against a dev server on :3100 |
| `E2E_BASE_URL=http://localhost:4310 npm run test:e2e` | Playwright against the served production export (the release check) |

E2E projects: Chromium, Firefox and WebKit at 1440×900, plus an emulated Pixel 7 and iPhone 14. Emulation is not a substitute for testing on real devices.

## Layout

```
src/app/                 routes, metadata, OG images, legacy-URL redirect pages
src/content/             typed, verified content: work, profile, archived notes (zod)
src/components/atlas/    portfolio shell and views
src/components/workspace/ Workspace desktop, windows and apps (route-scoped CSS)
src/workspace/           pure, unit-tested logic: window manager, terminal, search, preferences
scripts/                 export server, segment-name fix, notes archive tooling
e2e/                     Playwright suites
docs/engineering-atlas/  plan, design, evidence and status (read status.md first)
```

## Content rules

- Do not invent facts. Every claim comes from `src/content/`, and its source is recorded in `docs/engineering-atlas/evidence.md`.
- Nothing describes an employer as current until `current: true` is confirmed in `src/content/profile.ts`.
- **Résumé:** drop a PDF into `public/resume/`, and the site links to it at build time. While no PDF is there, the site offers the résumé by email.
- Archived notes stay unpublished until each one is approved (`published` flag).

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`):

- On pull requests: lint, type-check, unit tests and build.
- On push to `main`, the daily schedule, or a manual run: the same checks, then deploy to GitHub Pages with a CNAME for `www.ganeshbhatt.com.np`.

Feature branches never deploy. A commit message starting with `release:` on `main` creates a tagged GitHub release (`release.yml`).

## License

All rights reserved.
