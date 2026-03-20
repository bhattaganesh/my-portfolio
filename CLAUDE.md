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
- `src/components/` — Organized by feature (`hero/`, `blog/`, `contact/`) + shared (`ui/`, `shared/`, `layout/`).
- `src/data/` — Static data files (projects, skills, experience, services).
- `src/lib/` — Utilities, types, constants, WordPress GraphQL client.
- `src/hooks/` — Custom React hooks.

## Conventions

- Use `@/` import alias for all project imports.
- Components are named exports (not default exports).
- CSS uses Tailwind utility classes. Custom styles go in `globals.css`.
- Blog content comes from headless WordPress via GraphQL (`src/lib/wordpress.ts`).
- Blog list page fetches client-side for fresh content; blog detail pages are statically generated.
- Contact form uses EmailJS (client-side, `@emailjs/browser`).
- Form validation uses Zod.
- Animations use Motion (framer-motion v12+) and GSAP. 3D uses React Three Fiber.
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
- Always check `src/lib/types.ts` for existing type definitions before creating new ones.
- No API routes — this is a static export. Server-side code only runs at build time.
- Environment variables with `NEXT_PUBLIC_` prefix are client-accessible; others are build-time only.
- OG images use Next.js ImageResponse API (`opengraph-image.tsx` files).
