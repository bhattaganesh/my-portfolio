@AGENTS.md

# Project: Ganesh Portfolio

Personal portfolio website — Next.js 16, React 19, Tailwind CSS 4, deployed on GitHub Pages (static export).

## Stack & Versions

- **Next.js 16.2.0** — App Router only, no Pages Router. Uses Turbopack for dev. Static export (`output: 'export'`).
- **React 19.2.4** — Server Components by default, `"use client"` directive for client components.
- **Tailwind CSS 4** — v4 syntax (no `tailwind.config.js`, config via CSS `@theme`).
- **TypeScript** — strict mode enabled. Path alias `@/*` maps to `./src/*`.
- **Deployment** — GitHub Pages via GitHub Actions. Daily auto-rebuild + manual trigger.

## Architecture

- `src/app/` — App Router pages, layouts, metadata, OG images. No API routes (static site).
- `src/content/` — Typed, publishable content (work, profile, archived notes); the single source for Atlas pages and the Workspace.
- `src/components/` — `atlas/` (site shell and views), `layout/` (chrome gate), `workspace/` (desktop UI).
- `src/workspace/` — Workspace window manager and terminal logic (unit-tested).
- `src/data/skills.ts` — Skills list. `src/lib/` — constants and fonts.
- `scripts/` — `serve-out.mjs` (GitHub Pages-style local server), `fix-segment-names.mjs` (postbuild fix for Windows exports), notes archive tooling.

## Conventions

- Use `@/` import alias for all project imports.
- Components are named exports (not default exports).
- CSS uses Tailwind utility classes. Custom styles go in `globals.css`.
- No CMS: the build never contacts WordPress. Notes are archived as validated blocks in `src/content/notes/` (Zod schemas).
- Contact is a `mailto:` link plus the profile links in `src/content/profile.ts`; there is no form.
- Theme: light/dark via `next-themes` (class strategy).
- Images are unoptimized (no Next.js image optimization server on GitHub Pages).

## Commands

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build (outputs to out/)
npm run lint         # ESLint
npm run type-check   # TypeScript check
npm run serve        # Serve static build locally
```

## Important Rules

- **Read Next.js 16 docs** in `node_modules/next/dist/docs/` before using any Next.js API — v16 has breaking changes from v15.
- Do NOT create `tailwind.config.js` — Tailwind v4 uses CSS-based config.
- Check `src/content/` for existing content types before creating new ones.
- No API routes — this is a static export. Server-side code only runs at build time.
- Environment variables with `NEXT_PUBLIC_` prefix are client-accessible; others are build-time only.
- OG images use Next.js ImageResponse API (`opengraph-image.tsx` files).
