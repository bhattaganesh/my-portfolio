# Engineering Atlas — evidence

Labels: **O** = observed (command and output below). **A** = assumption, not yet verified. **I** = inferred from observed facts.

## Phase 0 baseline — 2026-10-07

Checkout: `C:\Users\bhatt\dev\my-portfolio`, branch `feature/engineering-atlas` from `main` @ `e0faf79`.
Local toolchain: Node v24.18.0, npm 11.16.0. CI uses Node 22 (`deploy.yml`), so local and CI differ.

### Repository checks (local, `e0faf79`)

| Check | Command | Result |
|---|---|---|
| Install | `npm ci` | O: succeeded. `allow-scripts` warns that `sharp` and `unrs-resolver` install scripts are not covered |
| Typegen + lint + types | `npx next typegen && npm run lint && npm run type-check` | O: exit 0. Lint: 0 errors, 23 warnings (e.g. `react-hooks/set-state-in-effect` in `src/hooks/use-greeting.ts:21`). Log: `baseline/checks-main-e0faf79e.log` |
| Production build | `npm run build` | O: **exit 1** in 21.6 s: `Page "/blog/[slug]/opengraph-image" is missing "generateStaticParams()" so it cannot be used with "output: export" config.` Log: `baseline/build-main-e0faf79e.log` |
| Prod dependency audit | `npm audit --omit=dev` | O: advisories include `nanoid <=3.3.17` (high), `fflate` (moderate, via three-stdlib), `baseline-browser-mapping` (moderate) |

Build failure cause (I): `src/app/blog/[slug]/page.tsx:16` and the OG image route return `getAllPostSlugs()`, which catches the CMS error and returns `[]`. With the CMS answering `530`, the dynamic route has no params and the export aborts. The same SHA deployed successfully on 2026-05-21 (deployments API), so CMS availability is the variable.
Consequence (I): **rebuilding `main` today cannot deploy**. A revert-based rollback to the old site would fail at build, and Pages would keep serving the last deployment.

### Live site (https://www.ganeshbhatt.com.np), Playwright Chromium

| Finding | Evidence |
|---|---|
| React error #418 (hydration) on `/`, at 1280 default and at 360 | O: `browser_console_messages` after navigation |
| Horizontal overflow on `/`: +9 px at 360/390, +1 px at 768; from hero `div.absolute -inset-8 pointer-events-none …` | O: 5-width sweep, `scrollWidth - innerWidth` |
| **Blog post overflow: +503 px at 360, +473 at 390, +103 at 768** (`/blog/php-8-x-…/`) | O: 5-width sweep |
| `/blog/` list: CORS/`ERR_FAILED` fetching the CMS on every width | O: console in sweep |
| All 8 sampled routes return 200 at all widths | O: sweep |
| Home blog images fail `ERR_BLOCKED_BY_ORB` | O: network log |
| Literal `&#8217;`, `&hellip;` in home text | O: `innerText` scan |
| No résumé link on home; `/resume/Ganesh-Prasad-Bhatt-Resume.pdf` → 404 | O: DOM, `curl -w %{http_code}` |
| Sitemap URLs without trailing slash (site uses `trailingSlash: true`) | O: `curl sitemap.xml` |

Sweep: 8 routes × widths 360/390/768/1024/1440, `waitUntil: networkidle` + 800 ms. #418 did not appear in the sweep's `console` listener. It surfaced in `browser_console_messages`, likely as an uncaught page error. P2 tests will listen to both `console` and `pageerror`.

### CMS and hosting

| Finding | Command | Result |
|---|---|---|
| CMS frozen | `curl -sI https://dev-ganesh-portfolio-api.pantheonsite.io/wp-content/uploads/2026/03/php-8-features.jpg`; POST `/graphql` | O: `HTTP/1.1 530 Site is frozen` for both |
| Deploy workflow disabled | `gh api repos/bhattaganesh/my-portfolio/actions/workflows` | O: `Deploy to GitHub Pages disabled_inactivity` |
| Last deployments | `gh api "repos/…/deployments?environment=github-pages"` | O: 2026-05-19/20/21, all `e0faf79e` |
| Pages config | `gh api repos/…/pages` | O: `build_type: workflow`, cname `www.ganeshbhatt.com.np`, HTTPS enforced |
| Env branch policy | `gh api repos/…/environments/github-pages/deployment-branch-policies` | O: `main`, `gh-pages` |
| Branch protection | `gh api repos/…/branches/main/protection` | O: 404 Branch not protected |
| Retained artifacts | `gh api repos/…/actions/artifacts` | O: none |
| PR CI | `.github/workflows/deploy.yml` | O: lint + type-check only; build/deploy gated to `refs/heads/main` |
| Static-export limits | `node_modules/next/dist/docs/01-app/02-guides/static-exports.md` | O: redirects, rewrites, headers, and dynamic routes without `generateStaticParams` are unsupported |

### Content archive (insurance copy, not published)

`baseline/live-posts/*.html`: raw HTML of the 6 live posts, fetched with `curl` (all HTTP 200, 120–144 KB each). The live static site is the only remaining source while the CMS is frozen. These files are input to `scripts/archive-notes.ts` (P5). They are never served.

## Claim inventory

| Claim | Source | Status | Launch handling |
|---|---|---|---|
| Brainstorm Force, Software Developer, Jan 2025–Present | `src/data/experience.ts` | self-reported; "Present" unconfirmed | needs Ganesh confirmation |
| ThemeGrill PHP Developer Dec 2021–Jan 2025; Zenlab intern Jun–Nov 2021; B.Sc. CSIT 2016–2021 | `experience.ts` | self-reported | keep, actual titles |
| Spectra 1M+ active installs | `projects.ts` | product reach, public wordpress.org figure | show as product reach with date, not personal impact |
| Spectra "40% render", "30% API reduction" | `projects.ts` | unverified, no method/date | **omit** |
| Masteriyo "80% faster course creation", "thousands of transactions" | `projects.ts` | unverified | **omit** |
| Spectra GitHub `brainstormforce/spectra` | `projects.ts` | O: 404 | replace with the wordpress.org plugin page |
| WP Agent AI public repo | `gh repo view bhattaganesh/wp-agent-ai` | O: public, last push 2026-03-03 | flagship evidence source |
| GitHub stats (130+, 279+, 64% …) | live DOM, `use-github-stats` | mixed live/hardcoded | **remove widgets** |
| 6 blog posts as Ganesh's writing | live site | authorship unconfirmed | publish only per-post after confirmation |
| Résumé | `SITE_CONFIG.resumeUrl` | O: 404 | need the PDF |
