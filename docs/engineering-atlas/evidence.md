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
| Spectra split into "Spectra Legacy" (`ultimate-addons-for-gutenberg`, 1,000,000+ installs, v2.20.4, maintenance only) and "Spectra Blocks" (`spectra-blocks`, added 2026-07-08, 50,000+ installs) | wordpress.org plugins API, 2026-10-07 | O | Spectra copy must reflect the split; "1M+" belongs to Legacy |
| Ganesh's Spectra scope: Legacy maintenance, performance and security fixes and enhancements; Spectra Blocks: responsive controls, dynamic content (e.g. a countdown block), a "load builder content" block, extensions and add-ons | Ganesh, in session, 2026-10-07 | self-reported | usable as Ganesh's own account; exact block names to be checked against the public `spectra-blocks` package |
| Masteriyo contributors now `masteriyo, themeisle`; 6,000+ installs, v3.4.3 | wordpress.org plugins API, 2026-10-07 | O | Masteriyo source repos are private, so ownership stays self-reported |
| WP Agent AI: all 31 commits by Ganesh Bhatta; HEAD `dff0e3c` (2026-03-03) | `gh api repos/bhattaganesh/wp-agent-ai/commits` | O | authorship verified |
| WP Agent AI stack says "OpenAI API" | `src/content/work.ts` | O: wrong. The code calls OpenRouter (`includes/Services/OpenRouterClient.php`) | correct to OpenRouter |

## Step B: design prototype (2026-10-07)

- Tooling: `artifact-design` skill loaded (Skill tool). The prototype is a single HTML file built in the scratchpad (template: `design/prototype-template.html`; fonts and portrait inlined at build) and published as a private Artifact: https://claude.ai/artifact/34r6pViw5Y2jH13RAXYTBw (v1).
- Local check, Playwright Chromium on `file://`, 1400 px and 390 px:
  - Run 1 (O): `pageerror: Identifier 'top' has already been declared` (collided with `window.top`), so all frames were empty. Renamed to `siTop`.
  - Run 2 (O): 0 errors. 15 frames rendered. Cabinet Grotesk loaded (`document.fonts.check`). Defects found:
    - The portrait escaped its plate (the img `height` attribute overrode `aspect-ratio`).
    - Hero text overflowed its grid row by ~97 px (measured: left column bottom 960 vs hero 935).
    - Board overflowed at 390 px (scrollWidth 457).
    - Light orange `#C2531F` on paper was **4.16:1, AA fail**.
  - Fixes: `height:auto` plus an arch frame, `align-items:start`, wrapping chips, orange → `#A9461A` (5.30:1 on paper, 4.76:1 on tint, computed).
  - Run 3 (O): 0 errors. Hero text inside the hero. 0 contrast fails across 15 token pairs. scrollWidth 375 at a 390 viewport.
- The workspace frames include `Alt+Shift+W` only as a label. Shortcut behaviour is untested (prototype).
- Saved review screenshots: `design/review-*.png`.

## Step B revision 2 (2026-10-07)
- The rendered-text contrast audit is built into the prototype page and walks every text element in every frame. Result (O): 400 checked, 0 below threshold, 0 skipped.
- Proof that the audit works (O): recreating the reported pale-on-cream tile title gave **1.16:1**, flagged as a fail. Restoring it gave 0 fails.
- Published as v2 of https://claude.ai/artifact/34r6pViw5Y2jH13RAXYTBw (previous signed-in account). Revision 3 (with slice screenshots) could not be published: the Artifact tool was unavailable after the account switch. Local copy: C:SERSBHATTDEVEVIEWENGINEERING-ATLAS-PROTOTYPE.HTML (OUTSIDE THE REPO).

## Workspace slice (commit 5a1dbc2)
Commands run in `C:\Users\bhatt\dev\my-portfolio`:

| Check | Result |
|---|---|
| `npx vitest run` (Node 24.18.0) | O: 26 passed (wm invariants over 200 seeded random sequences × 60 actions, plus targeted cases; terminal parsing, completion, history, hostile input) |
| Same suite on Node 22.13.0 (nvm binary on PATH) | O: 26 passed |
| Mutation check: removed the y-clamp in `clampRect` | O: 3 tests failed; restored → 12/12 |
| `npm run type-check` | O: clean |
| `npm run lint` | O: 0 errors, 23 warnings (baseline also 23; none new) |
| `npx playwright test` (Chromium 1440×900 + Pixel 7 touch, against `next dev`) | O: 14/14 passed on 3 consecutive runs |
| `npm run build` | O: exit 1, `Page "/blog/[slug]" is missing "generateStaticParams()"` (pre-existing frozen-CMS failure). Compile and TypeScript stages passed. Log: `baseline/build-slice.log` |

Defects found by the run and fixed before the final runs:
- Mobile "Back to portfolio" was 40 px tall (now 44).
- The dark active window showed grey controls (selector order).
- A base `button` reset outranked component button styles (now `:where()`).
- The `help` output was one command per line (now an inline row).

Flakes found and root-caused:
- Bounding boxes measured mid open-animation (`scale(0.97)`) gave 42.7 vs 48 and 409.6 vs 412. Fixed by waiting for animations in the test helpers. The window logic itself was unchanged.

Environment observation:
- `/` in `next dev` takes ~29 s of application code, because the home page waits on the frozen CMS during server rendering (`GET / 200 in 29.6s`). Pre-existing; fixed by P5.

Not verified yet:
- Production static export of `/workspace/`, blocked by the CMS build failure above.
- The home-page budget check ran against dev chunks, not hashed production chunks.
- Firefox and WebKit, and real iOS/Android devices.
- The independent `/code-review` pass (planned for P6).

## P2/P5 production verification (2026-10-07, commits 46aaa0a → 7519af1)
- Phone-panel focus defect (reported by Ganesh): reproduced first by a new test (8 Tab stops reached the covered launcher). Fixed with `inert` on the launcher and covered panels. A mutation check (inert removed from the panels only) made the test fail again on "covered Terminal". Restored, all pass.
- Notes archive: the converter runs in Chromium's parser. 5 security tests cover scripts/frames, event handlers (no dialog fired), unsafe URL schemes, malformed markup and entities. Writing the tests caught two real converter bugs: lowercase `svg` tag names slipped through, and nested lists inside formatting tags were dropped. Both fixed. All 6 archived dates match each post's JSON-LD `datePublished`.
- Build with the CMS host blocked: exit 0 on Windows and on Linux (WSL, Node 22.23.3).
- Served output (`scripts/serve-out.mjs`, GitHub Pages semantics):
  - all new and legacy routes return 200; unknown paths 404; `/work` gets a 301 to `/work/`;
  - legacy pages carry a meta refresh in `<head>`, noindex and a canonical link to the new URL;
  - the sitemap lists only canonical trailing-slash URLs; the feed is valid with 0 items.
- Windows-only prefetch 404s: root cause in Next 16.2.0 `export/index.js` (see status.md). The Linux export serves `/work/__next.work.__PAGE__.txt` with 200.
- E2E on the Linux export: 83 passed, 8 failed (breakdown in status.md). The no-JS failure is a real `loading.tsx` defect that predates this work.

## Windows segment fix, deletions and E2E (2026-10-07, home laptop `E:\dev-env\my-portfolio`)
Toolchain: Windows 11, Node 23.6.0, npm 11.4.2 (office laptop used Node 24.18.0; CI uses 22). Playwright browsers installed fresh (`npx playwright install chromium firefox webkit`).

| Check | Result |
|---|---|
| Root cause re-read in installed Next 16.2.0 | O: `convertSegmentPathToStaticExportFilename` is `` `__next${segmentPath.replace(/\//g, '.')}.txt` ``; the client (`segment-cache/cache.js`) requests the same dotted name |
| Windows build before the fix | O: 26 nested `__next.*` folders holding 43 files (e.g. `work/spectra/__next.work/$d$slug/__PAGE__.txt`) |
| `scripts/fix-segment-names.test.ts` | O: 3 pass (Windows layout flattened, Linux layout untouched, refuses to overwrite). Mutation: joining with `-` instead of `.` fails 2 of 3; restored → 3/3 |
| `npm run build` with the CMS host dead (`127.0.0.1:9`) | O: exit 0; `postbuild` logged "moved 43 file(s)"; 0 nested folders left; 296 files before and after; rerun moves 0 |
| Served navigation (`scratchpad nav-check`, Chromium) | O: client nav `/work/ → /work/spectra/ → /journey/ → /contact/ → /` all ok; 147 segment requests all 200; 0 responses ≥ 400; 0 console errors |
| Deletion safety | O: grep of every kept `src`, `e2e`, `scripts` file for imports of the 52 deleted files and 14 removed packages: 0 hits |
| Lint / type-check / unit | O: 0 errors 0 warnings / clean / 32 pass |
| E2E run 1 (pre-deletion export) | O: 86 passed, 5 failed (3 no-JS, Firefox link-crawl 30 s timeout, WebKit cancelled fetch of `/work/spectra/`) |
| E2E run 2 (post-deletion export) | O: 85 passed, 6 failed (3 no-JS on a "Work"/"Workspace" selector clash, 2 WebKit cancelled fetches of `/`, 1 mobile-WebKit menu) |
| `<noscript>` on `/workspace/`, JS off, all 3 engines | O: parsed as elements, `.gw-noscript` visible, screenshot shows the notice; `getByText` finds 0 (Playwright skips `<noscript>`), so the test now targets `.gw-noscript` |
| Fixture filter widened to any same-origin localhost URL | O: matches `/localhost:4310/ …` and a `__next.*` URL; does not match `api.github.com`, `evil.com/localhost:4310/`, or a TypeError |
| Mobile-WebKit menu test alone, `--repeat-each=5` | O: 5/5 pass, so the run-2 failure is a load-related flake (I) |
| E2E run 3 (post-deletion export, test fixes) | O: **91 passed, 0 failed** (1.7 min). Mobile projects are emulated |

Not verified: Linux `out/` diff (no WSL or Docker on this laptop).
