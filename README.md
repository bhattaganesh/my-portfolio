# Ganesh Prasad Bhatt — Portfolio

Personal portfolio website for **Ganesh Prasad Bhatt**, a Senior Full-Stack Software Developer based in Kathmandu, Nepal.

**Live:** [ganeshbhatt.com.np](https://www.ganeshbhatt.com.np)

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, React 19, Turbopack, static export)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (CSS-based config, no `tailwind.config.js`), [Tailwind Typography](https://github.com/tailwindlabs/tailwindcss-typography)
- **3D:** [React Three Fiber](https://r3f.docs.pmnd.rs/), [Three.js](https://threejs.org/), [@react-three/drei](https://github.com/pmndrs/drei), [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)
- **Animations:** [Motion](https://motion.dev/) (Framer Motion v12+), [GSAP](https://gsap.com/)
- **CMS:** Headless WordPress via GraphQL ([graphql-request](https://github.com/jasonkuhrt/graphql-request))
- **Email:** [EmailJS](https://www.emailjs.com/) (client-side contact form)
- **Validation:** [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [Sonner](https://sonner.emilkowal.dev/) (toast notifications)
- **Theming:** [next-themes](https://github.com/pacocoursey/next-themes) (light/dark, class strategy)
- **Utilities:** clsx, tailwind-merge
- **Deployment:** [GitHub Pages](https://pages.github.com/) via GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

| Variable | Description | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Site URL (default: `http://localhost:3000`) | Yes |
| `WORDPRESS_GRAPHQL_URL` | WordPress GraphQL endpoint (Pantheon-hosted) | Yes |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | [EmailJS](https://www.emailjs.com/) service ID | Yes (prod) |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS email template ID | Yes (prod) |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS public key | Yes (prod) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID | No |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification token | No |

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build (outputs to `out/`) |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run serve` | Serve static build locally |

## External Services & APIs

### Headless WordPress (CMS)

Blog posts are fetched from a headless WordPress instance hosted on **Pantheon** via its GraphQL endpoint. The GraphQL client is configured in `src/lib/wordpress.ts` using `graphql-request`.

- **Blog detail pages** are statically generated at build time via `generateStaticParams`
- **Blog list page** fetches posts client-side from WordPress GraphQL on every page load (always fresh)
- **Home page** latest posts section is built at build time
- **WordPress media** is served from the Pantheon CDN (`/wp-content/uploads/`)
- **Gravatar** is used for author avatars (`secure.gravatar.com`)

New blog posts require a site rebuild for their detail pages. The GitHub Actions workflow auto-rebuilds daily at 6 AM UTC and can be triggered manually.

### EmailJS (Contact Form)

The contact form sends emails client-side via [EmailJS](https://www.emailjs.com/) (200 free emails/month). No server-side API routes needed.

### Google Analytics & Search Console

- **GA4** — loaded conditionally via Google Tag Manager when `NEXT_PUBLIC_GA_ID` is set
- **Search Console** — site verification meta tag when `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is set

### Fonts

- **Inter** and **JetBrains Mono** — loaded via `next/font/google`
- **Cabinet Grotesk** — loaded from [Fontshare](https://www.fontshare.com/) CDN

## Project Structure

```
src/
├── app/              # Next.js App Router pages & metadata
│   ├── about/
│   ├── blog/[slug]/
│   ├── contact/
│   ├── experience/
│   └── projects/[slug]/
├── components/
│   ├── blog/         # Blog post cards, client-side list
│   ├── contact/      # Contact form (EmailJS)
│   ├── experience/   # Timeline
│   ├── hero/         # 3D hero section (Three.js)
│   ├── layout/       # Header, footer, logo, theme toggle
│   ├── projects/     # Project cards
│   ├── sections/     # Homepage sections
│   ├── shared/       # Reusable components
│   └── ui/           # Base UI primitives
├── data/             # Static data (projects, skills, experience)
├── hooks/            # Custom React hooks
└── lib/              # Utilities, types, constants, WordPress client
```

## CI/CD Pipeline

The project has a fully automated CI/CD pipeline via GitHub Actions.

### What happens on every push to `main`

1. **Lint** — runs `eslint` to catch code issues
2. **Type Check** — runs `tsc --noEmit` to catch TypeScript errors
3. **Build** — generates the static site into `out/`
4. **Deploy** — uploads to GitHub Pages (live in ~1 minute)

### Development Workflow

```bash
# 1. Make your changes
# 2. Stage and commit
git add <files>
git commit -m "feat: add new section"

# 3. Push to main — auto-deploys
git push origin main
```

That's it. Your changes will be live at https://www.ganeshbhatt.com.np within a few minutes.

### Creating a Release

When you want to tag a version (e.g., after a major update):

```bash
# 1. Bump version in package.json (follow semver)
#    - Patch (1.0.1): bug fixes, small tweaks
#    - Minor (1.1.0): new features, new pages
#    - Major (2.0.0): breaking redesign, new stack

# 2. Commit with "release:" prefix — this triggers auto-release
git add package.json
git commit -m "release: v1.1.0"
git push origin main
```

GitHub Actions will automatically:
- Build and deploy the site
- Create a git tag (`v1.1.0`)
- Create a GitHub Release with an auto-generated changelog

### New Blog Posts from WordPress

- **Blog list page** — always fresh (fetches client-side on every page load)
- **Blog detail pages** — require a rebuild to generate new `/blog/[slug]` pages
- **Daily auto-rebuild** — runs at 6 AM UTC via cron, picks up new posts automatically
- **Manual rebuild** — go to Actions tab → "Deploy to GitHub Pages" → "Run workflow"

### Deployment Config

- **Platform:** GitHub Pages
- **Source:** GitHub Actions (Settings → Pages → Source)
- **Custom domain:** `www.ganeshbhatt.com.np` (CNAME added during build)
- **HTTPS:** Enforced

## License

All rights reserved.
