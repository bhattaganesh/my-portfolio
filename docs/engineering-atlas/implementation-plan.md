# Engineering Atlas — revised spec & implementation plan (rev 2)

## Context
Ganesh approved the Engineering Atlas direction and Ship It as the optional game. He asked for seven revisions before full implementation. The OneDrive folder is an empty git repo (no commits, no remote) that holds only the two brief docs. The real app is `github.com/bhattaganesh/my-portfolio` `main` @ `e0faf79e`. This session ran in plan mode (read-only), so nothing has been cloned, installed, or built yet. **Execution order after approval: Step A (Phase 0 local checks) → Step B (visual compositions) → STOP for design review → Phases 2–7.**

Decisions carried forward from this session: archive the 6 posts into the repo; dev-deps vitest, @playwright/test, @axe-core/playwright; clone to `C:\Users\bhatt\dev\my-portfolio` on branch `feature/engineering-atlas` off `main` (repo has no `develop`, and the repo's `feature/` prefix wins); removals left to my judgement (revised in §2); no push/PR/merge/deploy without separate authorization.

## Phase 0 evidence so far
Label key: **O** = observed this session (command shown), **A** = assumption still to verify.

| # | Finding | Label / command |
|---|---|---|
| 1 | Next 16.2.0, React 19.2.4, Tailwind 4, TS strict, `output:'export'`, `trailingSlash:true` | O: `gh api …/contents/{package.json,next.config.ts}` |
| 2 | Repo `CLAUDE.md` line 1 is `@AGENTS.md`; AGENTS.md absent | O: contents API empty |
| 3 | React #418 on home page, desktop **and** 360px | O: Playwright console, both viewports |
| 4 | Horizontal overflow at 360px: scrollWidth 369, from hero `div.absolute -inset-8 …` | O: `browser_evaluate` |
| 5 | Pantheon CMS returns `530 Site is frozen` for GraphQL and uploads, so the 3 home blog images fail (`ERR_BLOCKED_BY_ORB`) | O: `curl -sI …/php-8-features.jpg`, network log |
| 6 | Deploy workflow `disabled_inactivity`; last deployment 2026-05-21, all from `e0faf79e` | O: `gh api …/actions/workflows`, `…/deployments?environment=github-pages` |
| 7 | Pages `build_type: workflow`; env `github-pages` branch policy allows `main`, `gh-pages`; `main` unprotected; **0 retained artifacts** | O: `gh api …/pages`, `…/deployment-branch-policies`, `…/actions/artifacts` |
| 8 | PR CI = lint + type-check only, no build | O: `deploy.yml` |
| 9 | `wordpress.ts` swallows all errors (`catch { return [] }`) | O: source |
| 10 | Env-var drift: docs say `WORDPRESS_GRAPHQL_URL`, code/CI use `WORDPRESS_GRAPHQL_ENDPOINT` | O: source |
| 11 | Literal `&#8217;` / `&hellip;` in rendered text | O: DOM scan |
| 12 | `/resume/Ganesh-Prasad-Bhatt-Resume.pdf` 404; home renders no résumé link | O: curl, DOM |
| 13 | `github.com/brainstormforce/spectra` 404; `bhattaganesh/wp-agent-ai` public (last push 2026-03-03) | O: `gh api`/`gh repo view` |
| 14 | Unverified metrics (Spectra 40%/30%, Masteriyo 80%, "thousands of transactions", GitHub totals) | O: `projects.ts`, DOM |
| 15 | Sitemap URLs lack trailing slash | O: `curl sitemap.xml` |
| 16 | No HTML parser/sanitizer in lockfile (parse5, dompurify, sanitize-html, jsdom, htmlparser2, happy-dom, rehype-sanitize all absent) | O: grep of `package-lock.json` |
| 17 | Live post page: article uses h2/h3, pre/code (20), ol/ul, 3 img; page also has 45 `<script>` tags (framework) | O: `curl … | grep` |
| 18 | Today's build of `main` would ship an empty blog because the CMS is frozen | **A**, verify in Step A |
| 19 | No tests exist | O: `package.json` |

## Step A — finish Phase 0 locally (first action after approval)
```
git clone https://github.com/bhattaganesh/my-portfolio C:/Users/bhatt/dev/my-portfolio
cd C:/Users/bhatt/dev/my-portfolio && git switch -c feature/engineering-atlas
node -v; npm -v; npm ci
npx next typegen && npm run lint && npm run type-check
npm run build   2>&1 | tee docs/engineering-atlas/baseline/build-main-e0faf79e.log
npx serve out -l 4310
```
- Playwright against `http://localhost:4310` **and** live, at 360/390/768/1024/1440: console errors, overflow, routes 200, blog list/detail contents. This settles A18 and shows whether #418 reproduces locally.
- Read `node_modules/next/dist/docs/` sections on static export, metadata, `generateStaticParams`, and `next/dynamic` (repo rule).
- Create `docs/engineering-atlas/{status,evidence,design,implementation-plan}.md` plus `source/` (copies of the two brief docs) and `baseline/` (logs, screenshots). No AGENTS.md (see §6).
- Gate: every row in the table above is O, with its command and output recorded in `evidence.md`.

## Step B — visual compositions (design gate, before any site code)
- Workflow: load the `artifact-design` skill, then build one static HTML prototype **in the scratchpad, not the repo**, using the real tokens and the real `ganesh.webp`. Screenshot it with Playwright and publish it as a **private Artifact** for review.
- Frames: (1) desktop hero 1440 light, (2) the same in dark, (3) Spectra project chapter 1440, (4) mobile home 390 (hero → work → contact), (5) Ship It storyboard: intro, choose, result "durable queue only" (partial), result "idempotent boundary" (viable), debrief, at 390 and 1440.
- Product screenshots without permission appear as a labeled "screenshot pending permission" frame, used only in the prototype.
- **STOP here for Ganesh's review.** Approved PNGs are saved to `docs/engineering-atlas/design/`.

Design tokens and layout are unchanged from rev 1: paper `#F6F3EC` / ink `#16181C` / cobalt `#2343D6` / orange `#C2531F` (large/decorative only); dark charcoal `#15171A` / `#ECE8DF` / `#8EA2FF` / `#F08A5D`. Every pair is contrast-checked. Type is Cabinet Grotesk (self-hosted) for display, Inter for body, JetBrains Mono for metadata. The 12-column asymmetric hero uses static SVG Nepal contours. There's no intro animation, and motion only appears behind `prefers-reduced-motion: no-preference`. Flagship stories: Spectra, Masteriyo, and WP Agent AI (best public evidence). Everest Forms and User Registration stay as short entries.

## §1 Ship It, round 2 (duplicate payment webhook), corrected
**The distinction, documented in `design.md` and in the in-game debrief:**
- A durable queue gives *reliable processing*: an acknowledged event isn't lost, and failed attempts retry. It is at-least-once, so it **still delivers duplicates**.
- *Duplicate handling* requires **idempotency at the processing boundary**: a unique key (the provider event ID) recorded in the same transaction as the side effects (enrollment and ledger row), so a repeated event becomes a no-op.
- Blind retries increase duplicates, and client-side checks don't touch server-side redelivery.

Fictional setup: the provider delivers `payment.succeeded` at least once. During a traffic spike the handler times out, the provider redelivers, and enrollments and ledger rows get duplicated.

| Option | Reliable processing | Duplicate effects | Outcome (variant A: provider retries 3 days / short spike) | Variant B: provider retries 3× in 1 h / long spike |
|---|---|---|---|---|
| Blind retries / more workers | no | **worse** | worsened | worsened |
| Client-side "pay once" check | no | unchanged | no improvement | no improvement |
| Durable queue only | **yes** | **still duplicated** | partial | partial |
| Idempotent processing boundary | relies on provider retries | **eliminated** | **viable** | partial (events can expire unprocessed) |
| Queue + idempotent consumer | yes | eliminated | **viable** (more moving parts) | **viable** |
| Idempotent boundary + scheduled reconciliation (re-fetch missed events from the provider's events API, keyed by the same event ID) | yes, via reconciliation | eliminated | **viable** | **viable** (reconciliation recovers expired retries; delay = reconciliation interval) |

Viable count (rev 3 correction): variant A has 3 (idempotent boundary, queue + idempotent consumer, idempotent + reconciliation). Variant B has 2 (queue + idempotent consumer, idempotent + reconciliation). So "≥ 2 viable per variant" holds as an outcome of the table, not by exemption. Both B-viable options share the idempotent boundary. They differ in *how* reliability is achieved (push queue vs pull reconciliation), which is the second lesson of the round.

Engine tests (`src/lab/ship-it/engine.test.ts`, vitest):
- In every payment variant, any option without `idempotentBoundary` has `duplicateEffects > 0` and is never `viable`.
- "Durable queue only" has `reliableProcessing === true` **and** `duplicateEffects > 0`, which pins the distinction.
- Every `viable` payment outcome has `idempotentBoundary === true` **and** `reliableProcessing === true` in that variant (idempotency alone counts as reliable only in A, where provider retries outlast the spike).
- Exact outcome table asserted per variant: A = {idempotent: viable, queue+idem: viable, idem+recon: viable, queue-only: partial, retries: worsened, client: none}, B = {idempotent: partial, queue+idem: viable, idem+recon: viable, queue-only: partial, retries: worsened, client: none}.
- Each variant has at least 2 viable options in every round (checked for all 3 rounds × 2 variants).
- The debrief text for each option mentions only properties the table marks true. This is checked by asserting on structured `claims` fields rather than prose.

Rounds 1 (catalogue: query / cache / workers, with the bottleneck deciding the winner) and 3 (editor: reduce render work / move state boundary are viable, debounce is partial) work as in rev 1, with 2 variants each. The engine is a pure `reduce(state, action)`. Invalid or repeated actions return the identical state object, and `confirm` without a selection is a no-op. There are no timers and nothing is persisted. The UI is loaded via `next/dynamic` only on `/lab/ship-it/`.

## §2 Dependencies (contradiction resolved)
- **Keep** `graphql` and `graphql-request`, because `src/lib/wordpress.ts` stays as the future CMS adapter. Its error handling changes so that it throws (a typed `CmsUnavailableError`) instead of returning `[]`. It is not called at build while the CMS is frozen, and it must still type-check.
- **Remove**, only after a grep shows zero remaining imports: `three`, `@react-three/{fiber,drei,postprocessing}`, `@types/three`, `gsap`, `@emailjs/browser`, `sonner`, plus `motion` and `next-themes` only if nothing retained uses them (next-themes is expected to stay).
- Each removal commit runs `npm run type-check && npm run lint && npm run build`. Retained source must type-check at every commit.
- Add (approved): `vitest`, `@playwright/test`, `@axe-core/playwright` as devDependencies.

## §3 Archived notes as structured safe content (no HTML at runtime, no regex sanitizing)
- **Parser**: Chromium's own HTML parser (`DOMParser`) via the approved `@playwright/test`. There's no new dependency and no regex sanitizing.
- **Converter**: `src/content/notes/html-to-blocks.ts` exports a self-contained `htmlToBlocks(html: string): unknown`, with no imports, so that Playwright can serialize it into `page.evaluate`. It walks the DOM with an **element allowlist** that maps to typed blocks:
  - Blocks: `heading{level 2–4, inlines}`, `paragraph{inlines}`, `list{ordered, items: inlines[]}` (nested lists are flattened one level), `code{lang?, text}`, `quote{inlines}`.
  - Inlines: `text`, `strong`, `em`, `code`, `link{href, children}`.
  - `script`, `style`, `iframe`, `object`, `embed`, `template`, `noscript`, `svg`, `math`, `form`, and comments are dropped **with their content**. Other unknown elements are unwrapped to their text.
  - **No attributes are ever copied** except a validated `href` and the `language-*` class mapped to `lang`.
  - Images are dropped, since their CMS source is frozen. Notes ship text-only unless Ganesh supplies images.
- **URL policy**: `new URL(href.trim(), sourceUrl)`. The protocol must be `https:` or `mailto:`, and `http:` is upgraded to `https:`. Anything else (including `javascript:`, `data:`, and `vbscript:`, whatever their case or entity encoding) turns into plain text.
- **Schema**: zod (already a dependency) in `src/content/notes/schema.ts`. The archive script validates its output before writing, and the build-time loader `src/lib/notes.ts` parses it again, so an invalid file fails the build.
- **Rendering**: `components/notes/blocks.tsx` renders text as React children (auto-escaped). There is **no `dangerouslySetInnerHTML`** in the notes path, enforced by an ESLint `no-restricted-syntax` rule scoped to `src/components/notes/**`.
- **Archive script**: `scripts/archive-notes.ts` (Playwright) opens each of the 6 live `/blog/<slug>/` pages, takes the article container's `innerHTML`, runs `htmlToBlocks`, and writes `src/content/notes/<slug>.json` with `{title, publishedAt, blocks, provenance:{sourceUrl, capturedAt}, published:false}`.
- **Tests** (`e2e/html-to-blocks.spec.ts`, which runs `htmlToBlocks` inside a real Chromium page via `page.evaluate` and then validates with zod in Node):
  - `<script>alert(1)</script>`, `<style>`, `<iframe>`, `<svg onload=…>`, `<noscript>` produce no output and none of their text.
  - `<img src=x onerror=…>` and `<p onclick=…>` produce no attributes in the output (the JSON is checked to contain no `on*` keys).
  - `<a href="javascript:alert(1)">`, `JaVaScRiPt:`, `&#106;avascript:`, leading spaces or tabs, `data:text/html,…`, and `vbscript:` become text only. `http://` is upgraded, and relative links resolve to https.
  - Malformed markup (`<p><b>x`, `<ul><li>a<li>b`, stray `</div>`, deep nesting) produces valid schema output with its text kept.
  - Entity decoding: `&#8217;` → `’` and `&hellip;` → `…`.
  - Excerpts come from the text of the first paragraph block, so no raw entities are possible.

## §4 Broken-image fallback, made genuine
- `components/media/figure-image.tsx` (client) renders a `<figure>` with a fixed `aspect-ratio` box, the `<img width height alt>`, and a `<figcaption>`.
- State `'loading'|'ok'|'failed'`: `onError` sets `failed`, **and** a mount effect checks `img.complete && img.naturalWidth === 0`. That check catches failures that happened before hydration. Whether React 19 replays those error events has not been checked, so I don't rely on it.
- When the state is `failed`, the `<img>` is removed and replaced by a panel of the same size showing "Image unavailable", the alt text as a description, and the caption. Layout doesn't shift. Without JS, the sized box and the browser's alt text remain (documented limitation).
- **Verify** in `e2e/images.spec.ts`: `context.route(/\.(webp|png|jpe?g|avif|gif)(\?|$)/, r => r.abort())`. Then, on a direct load and on a client-side navigation to each image-bearing route (home, each `/work/[slug]/`), the test asserts:
  - the fallback panel is visible,
  - no visible `img` has `naturalWidth === 0`,
  - the box's bounding size equals the unblocked run's size.

  Screenshots are saved to evidence.

## §5 Rollback, against the actual configuration
**Observed config** (rows 6–7, `deploy.yml`):
- Deploy runs only when `github.ref == 'refs/heads/main'` on push, schedule, or dispatch.
- `actions/checkout@v4` checks out the triggering commit, and dispatch builds the branch HEAD, so there is no way to choose a SHA.
- No artifacts are retained, so there's nothing to redeploy without rebuilding.
- The workflow is currently disabled.
- Every build pulls the CMS at build time on the old tree.

**Observed merge facts** (rev 3): the repo allows merge commits, squash, and rebase (`gh api repos/bhattaganesh/my-portfolio` → all `true`). The only precedent, `e835485 release: merge feature/portfolio-rebuild into main`, is a 2-parent merge commit made without a PR. The strategy for this work is not decided yet, so the procedure branches on it, and the merge itself needs separate authorization.

Before merging, tag the exact pre-Atlas state: `git tag pre-atlas e0faf79`. The tag push is part of the authorized merge step.

**Procedure** (written to `docs/engineering-atlas/deploy-rollback.md`):
1. `gh workflow enable deploy.yml -R bhattaganesh/my-portfolio` (needed first, it is disabled now).
2. Roll back, by how the Atlas work landed on `main`:
   - Merge commit (recommended, matches precedent): `git revert -m 1 <merge-sha>`
   - Squash: `git revert <squash-sha>`
   - Rebase (N commits): `git revert --no-edit pre-atlas..<last-atlas-sha>` (reverts each, newest first)
   - Then `git push origin main`. The push trigger builds and deploys the reverted tree.
3. Confirm: `gh run watch`, then `curl -s -o /dev/null -w '%{http_code}' https://www.ganeshbhatt.com.np/`, then a Playwright smoke test of the old routes.

**Frozen-CMS build failure, addressed:**
- The **Atlas tree never calls the CMS at build** (notes come from archived JSON, §3). Rolling *forward or back between Atlas commits* therefore builds independently of Pantheon. This is verified by building with the network to the CMS host blocked (`WORDPRESS_GRAPHQL_ENDPOINT=https://127.0.0.1:9/graphql npm run build` must succeed).
- Rolling back to the **pre-Atlas tree** fails at build while Pantheon is frozen (observed: exit 1, `evidence.md`). It fails **safely**: `deploy.yml` runs deploy steps only after `npm run build` succeeds, so Pages keeps serving Atlas and there is no outage, just no rollback.
- The runbook therefore has a mandatory precheck for that path: `curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' -d '{"query":"{posts(first:1){nodes{slug}}}"}' $WORDPRESS_GRAPHQL_ENDPOINT` must be `200`. If it isn't, unfreeze the Pantheon site first (owner action in the Pantheon dashboard) or roll back only to an earlier Atlas commit.
- The pre-Atlas tree is not patched (the old code is left as it was).

**Rehearsal (local, no remote writes)**, done in P7 for the merge-commit and squash variants:
1. In the clone: `git switch -c rehearsal/main main`, then `git merge --no-ff feature/engineering-atlas`, `npm ci && npm run build`. This must pass, including with the CMS host blocked.
2. `git revert -m 1 HEAD`, then `npm ci && npm run build`. This is expected to fail exactly like the baseline while the CMS is frozen.
3. Repeat with `git merge --squash` + `git revert`.
4. Record the outputs, then delete the `rehearsal/*` branches.

**Not verifiable without authorization**: the actual Pages deploy step. Listed explicitly under Not verified.

## §6 Instruction files, without creating AGENTS.md
- **Shared project instructions**: the repo's tracked `CLAUDE.md` (stack, commands, conventions).
- **Personal**: `~/.claude/CLAUDE.md` (base-branch, PR, and attribution preferences). It never goes into the repo.
- **Task-specific brief**: kept in `docs/engineering-atlas/` (tracked on the feature branch, with no personal or secret data).
- The dangling `@AGENTS.md` import is recorded as an open item in `status.md`. Ganesh decides whether to drop the line or author a shared AGENTS.md. Until then neither happens.

## Phases 2–7 (after design approval) — unchanged from rev 1 except the above
- **P2 Foundation**: new shell, nav, theme, and routes `/ /work/ /work/[slug]/ /journey/ /lab/ /lab/ship-it/ /notes/ /notes/[slug]/ /contact/` plus `not-found`. Content moves to `src/content/` with typed `Role` (`current` gated on confirmation), `CaseStudy` (with an `evidence[]` kind), and `DiagramStage`. Contact is `mailto:` plus LinkedIn and GitHub, with no form. Verified by `e2e/journey.spec.ts` (nav, `aria-current`, menu Esc and focus return, theme persists after reload, internal links 200) and `e2e/layout.spec.ts` (5 widths with no overflow, 200% zoom, zero console errors so #418 is covered, JS-disabled content present), with screenshots.
- **P3 Case studies**: `components/diagram/system-diagram.tsx` (stage `<ol>` of `aria-pressed` buttons, server-rendered ordered text equivalent). The WP Agent AI stages come from that repo's actual code. `e2e/case-study.spec.ts` covers keyboard and touch, reduced motion, and evidence links.
- **P4 Ship It**: per §1. `e2e/ship-it.spec.ts` covers keyboard-only and touch full runs, replay, exit, leaving and returning, the text view, and a check that the home network log has no ship-it chunk (lab link uses `prefetch={false}`).
- **P5 Content and migration**: per §3. Each note's `published` flag is gated on Ganesh confirming authorship, and Notes leaves the nav when none are published. Old URLs (`/projects/…`, `/experience/`, `/blog/…`, `/about/`) become static pages with meta-refresh, a canonical link, and a visible link. The sitemap uses trailing-slash canonical URLs. `feed.xml` comes from the archived notes. `e2e/migration.spec.ts`.
- **P6 Integration**: the PR CI job adds `npm run build`, `vitest run`, and Playwright on `out/`, and deploy stays main-only. Then axe on every route, a manual keyboard, landmark, and heading pass, Lighthouse mobile on served `out/` with its conditions recorded, and an independent `/code-review`. Valid findings are fixed and checks re-run.
- **P7 Handoff**: light/dark × desktop/mobile screenshots, the `status.md` final report, and `deploy-rollback.md`. A draft PR only if authorized.

## Inputs needed from Ganesh (work continues around them)
1. Résumé PDF (until then the action falls back to email).
2. Confirm Brainstorm Force is current.
3. Which of the 6 archived posts you authored and want published.
4. Permitted Spectra and Masteriyo screenshots.
5. Response-time statement, if any.
6. The `@AGENTS.md` decision.

## Verification rule
Every phase records exact commands and real output in `status.md` and `evidence.md`, with each item labeled observed vs assumed. A phase is marked verified only when its gate checks were executed.

---

# Rev 3 — adds Ganesh Workspace (proposed, awaiting review)

The full spec is in `design.md` §1–9. Rev 2 decisions and corrections all stand: archived notes as structured safe content, the payment-round distinction, keeping graphql-request with `wordpress.ts`, genuine image fallback, the observed rollback, no AGENTS.md, and a contact page with no form. **New dependencies: none.** Drag uses Pointer Events, minimized windows use `inert`/`hidden`, audio uses WebAudio, validation uses zod (already present).

## Revised order
1. **Step B — compositions (design gate).**
   - Atlas frames: desktop hero light and dark, Spectra chapter, mobile home, Ship It storyboard.
   - **Workspace frames:** desktop and dock, launcher open, Projects window, multi-window state, mobile app view.
   - Published as one private Artifact. **Stop for review.**
2. **P2 foundation + shared content.**
   - `src/content/` schemas and data, `src/components/views/*`, Atlas shell and routes.
   - Header and hero get the **Enter my workspace** link, initially pointing to a `/workspace/` page that is the server-rendered no-JS launcher (a real, useful page from day one).
3. **P3 case studies + diagram** (unchanged).
4. **P4 Ship It engine + UI** (unchanged, §1 payment table). The UI component is written to mount inside any container (no page-level assumptions), so Arcade can reuse it.
5. **P5 notes archive, contact, migration** (unchanged).
6. **W2 window manager**
   - `src/workspace/wm/{types,geometry,reducer}.ts`; `reducer.test.ts` covers invariants 1–6 over seeded random action sequences (no new dep: a small seeded LCG in the test) plus targeted cases (minimize focus hand-off, close focus hand-off, maximize/restore rect, viewport shrink and grow).
   - `src/components/workspace/{desktop,wallpaper,dock,launcher,window,window-switcher,mobile-panels,live-status}.tsx`, `src/workspace/registry.ts`, `src/workspace/prefs.ts` (+ `prefs.test.ts`: valid, corrupt JSON, wrong version, throwing storage, reset).
7. **W3 shared-content apps.** Projects, Journey, Notes, Résumé, and Contact mount the P2 views. ResumePanel reads its availability from a build-time check. Per-window error boundary and loading state.
8. **W4 Terminal + Arcade.**
   - `src/workspace/terminal/{commands,parse,complete,history}.ts` + `terminal.test.ts` (design §6 list); `components/workspace/apps/terminal.tsx`.
   - Arcade = lazy `ShipIt`. Minimized keeps the run, closed discards it.
9. **P6/W5 integration, verification, polish** (rev 2 P6 plus the workspace checks below).
10. **P7 handoff** (unchanged).

## Workspace verification (Playwright on served `out/`, Chromium desktop + Pixel 7 emulation; Firefox/WebKit if they install)

| Spec | Asserts |
|---|---|
| `e2e/workspace-windows.spec.ts` | Opens 3 apps and switches with dock, switcher, and `Alt+Shift+W`. Minimize, restore, maximize, restore, close. Correct z-order and `focused` styling. Minimized window not focusable (Tab sweep never lands inside it). Focus lands where design §4 says after every action. |
| `e2e/workspace-keyboard.spec.ts` | Full keyboard-only session: launcher → open Projects → Window menu Move/Size with arrows → switch → close. Focus is visible on every stop (screenshot sampled). |
| `e2e/workspace-geometry.spec.ts` | Drag a window past each edge, so it clamps. Resize the viewport 1440→800→1440 and 1440→390→1440: every title bar is reachable and the layout switches to panels and back. |
| `e2e/workspace-mobile.spec.ts` | 390px: tap a tile → full-screen panel → Back to apps (focus returns to the tile) → Switch. Browser Back closes the panel. No element under 44px among controls. |
| `e2e/workspace-terminal.spec.ts` | Typed and chip-clicked commands, history ↑↓, Tab completion, unknown command hint, `<script>` shown as text, `exit` closes the window. |
| `e2e/workspace-arcade.spec.ts` | Complete all 3 rounds, replay. Minimize mid-round → restore keeps the round. Close → reopen starts fresh. Leave route and return. |
| `e2e/workspace-resilience.spec.ts` | Storage throws (init script overrides `localStorage`) → still usable. Corrupt `gw.prefs` → defaults. Reduced motion emulated → no transitions. 200% zoom at 1280. Blocked Terminal chunk → error state → Retry works after unblock. |
| `e2e/budget.spec.ts` | `/` cold load and full scroll: no request for workspace or ship-it chunks (names from `.next` build manifest). Zero `pageerror` and console errors on every route, `/workspace/` included. |
| axe | `/workspace/` with 0, 1, and 3 windows open, plus the mobile panel state. |

Plus the rev 2 checks for Atlas, Lighthouse mobile on `/` and `/workspace/`, and the independent `/code-review`.

## Risks / decisions to confirm
- `Alt+Shift+W` may collide with a browser or OS shortcut on some platforms. The tests check that it isn't swallowed in Chromium, Firefox, and WebKit. The visible Switch button is always the guaranteed path.
- iOS Safari does not render inline PDF `<object>` reliably. The links are the primary path there.
- One window per app (a single instance) is deliberate and keeps state and focus rules simple.

## Rev 3.1 corrections (2026-10-07)
- **Payment variant B** now has 2 viable options (queue + idempotent consumer; idempotent boundary + scheduled reconciliation), matching the "≥ 2 viable" test. The exact per-variant outcome table is asserted (§1).
- **Terminal Tab** only intercepts when completion changes the input. Otherwise focus moves on (`design.md` §6, with unit and Playwright tests).
- **Rollback** branches on the actual merge strategy (merge commit / squash / rebase), adds a `pre-atlas` tag, and handles the frozen-CMS failure: Atlas builds never touch the CMS (verified with the CMS host blocked), the pre-Atlas rollback has a CMS precheck, and a failed build leaves Pages unchanged (§5).
- **CI Node parity** (P6 final gate): CI uses `actions/setup-node` with `node-version: '22'`, which resolves to the newest 22.x at run time. Locally, nvm-windows already has 22.13.0, used by calling its binary directly so the global Node isn't switched:
  `NODE22=/c/Users/bhatt/AppData/Local/nvm/v22.13.0/node.exe; PATH="$(dirname $NODE22):$PATH" npm ci && npm run lint && npm run type-check && npx vitest run && npm run build && npx playwright test`.
  This is recorded alongside the Node 24 run. Limit: 22.13.0 ≠ CI's exact 22.x patch. Exact CI parity is only shown by a CI run on a pushed branch, which needs push authorization and stays under Not verified until then.
- **Prototype tooling**: the `artifact-design` skill loaded successfully in this session (Skill tool returned its content), and the Artifact tool is available. If publishing is unavailable, the fallback is the local HTML file screenshotted with Playwright. No new capability is installed either way.

## Rev 3.2: design-review refinements (2026-10-07)
- **Ship It is progressive** (supersedes the option list in §1, keeping its accuracy rules):
  - Each round has a **base pass** with 4 plain-language options, engineering terms behind an "In engineering terms" disclosure, and an **optional twist** that changes one assumption and adds one option.
  - Round 2 base (= variant A, provider retries for days): more servers/blind retries **worsened** · waiting line (durable queue) **partial** · remember handled payments (idempotent boundary) **viable** · both **viable**.
  - Round 2 twist (= variant B, provider gives up after 1 h): same four plus "remember + hourly check for missed ones" (reconciliation). Outcomes: retries worsened · queue partial · idempotent-only **partial** · both **viable** · idempotent + reconciliation **viable**.
  - "Block double clicks" is no longer an option. Why client-side checks don't stop server redelivery is explained in the round's "Why not just…?" note.
  - Tests: an exact outcome table per pass. Base and twist each have ≥ 2 viable options. Every viable payment outcome has `idempotentBoundary && reliableProcessing`. Durable queue only gives `reliableProcessing && duplicateEffects > 0` in both passes.
- **Employment wording**: until Ganesh confirms, no view says "now", "Present", "currently" or "2025 –" for any employer. Brainstorm Force is "joined in 2025". `src/content` holds `current: false` until confirmed. `e2e/content.spec.ts` scans the rendered text of every route and workspace app for `/\b(now|present|currently)\b/i` next to an employer name and must find none.
- **No review metadata in public UI**: evidence status, pending-input markers and rejected claims live only in `docs/engineering-atlas/evidence.md`. Public UI keeps only required honesty labels ("Illustrative diagram", "Simulation · made-up numbers").
- **Contrast is verified on rendered components**, not just tokens. P6 runs axe on every route and workspace state, plus the rendered-text audit used in the prototype.
- **Workspace slice first** (before the other apps): `/workspace/` with the window manager, Projects (shared data) and Terminal. Verified for keyboard, touch, focus recovery, viewport resizing and reduced motion before expanding.

## Rev 4: reconciled with the 2026-10-07 continuation brief

What already exists stays as is: Atlas routes, shared `src/content`, the CMS-free build, the WM reducer, Projects, Terminal, mobile panels, and the 94-test E2E matrix. Each stage below is closed (verified, evidence recorded, committed, pushed) before the next one starts. **No new dependencies.**

### F. Finish the foundation
- **F1 Mobile covered-launcher focus.** Already fixed (46aaa0a) and covered by `workspace.mobile.spec.ts` › "a full-screen panel keeps keyboard focus off…". *Accept:* that test passes on both mobile engines against the production export.
- **F2 Complete P5 (WordPress removed).** Delete the Pantheon `remotePatterns`, the WordPress and EmailJS variables (`.env.example`, `deploy.yml`) and the stale README. The PR CI job adds `npm test` and `npm run build`. *Accept:* `grep -ri "pantheon\|WORDPRESS_\|EMAILJS"` over source, config and CI returns nothing. A build passes with no network access to any CMS.
- **F3 Recruiter fast path.** A "60-second overview" band on `/`, directly under the hero, holds the three flagship projects (one line each, with links), verified experience, résumé status, and contact (email, LinkedIn, GitHub). It is reachable from a hero link and from the skip link. The résumé shows only when `public/resume/*.pdf` exists. Otherwise it reads "Résumé on request" as a `mailto:`. *Accept:* an E2E test finds every item without JS or scrolling past the band, and the content scan still finds no current-employment wording.
- **F4 Portability.** The README states the runtime versions, setup/run/test/build commands and environment variable names (no values). `status.md` gets a handoff.

### D. Personal desktop (Priority 2)
- **D1 Mission Control** replaces the deferred window switcher. It is opened from a menu-bar button or `Ctrl+Alt+↑`, and shows one card per open app (normal and minimized) as a `listbox`. Arrow keys plus Enter switch, Esc returns focus.
- **D2 Spotlight** is opened from a menu-bar button or `Ctrl+K`. It searches apps, projects and terminal commands. The pure `src/workspace/search.ts` has unit tests. Combobox pattern: arrow keys, Enter, Esc.
- **D3 Context menus.** The desktop and dock items get `role="menu"` menus. The keyboard alternatives are `Shift+F10` or the Menu key on a focused dock item, and the menu-bar "Workspace" menu offers the same desktop actions. Every item does something real.
- **D4 Preferences** (`src/workspace/prefs.ts`, zod, versioned key `gw.prefs.v2`) hold theme (system/light/dark), wallpaper (variants of the original Himalayan artwork), motion (system/reduced), sound (off by default), and window layout (rects plus open apps). Settings has a single reset. Corrupt or unavailable storage falls back to the defaults.
- **D5 Sound:** short WebAudio ticks, off by default, and the AudioContext is created only after the user turns sound on.
- **D6 Phone Back navigation:** opening a panel pushes `#app`, and browser Back returns to the launcher with focus on that tile.

### Stage A apps
1. **Projects:** case-study decisions and the request-flow diagram rendered from `caseStudy` (an SVG diagram plus its ordered-text equivalent), and "Open full case study". There are no screenshots because none are permitted yet, so none are shown.
2. **Terminal:** add `open <app>` and `search <text>`. History, completion and chips stay as they are.
3. **About Ganesh:** profile, verified roles and education, résumé (only if published), and contact.
4. **Settings:** appearance, wallpaper, motion, sound, and reset.

### Stage B
5. **Arcade / Ship It:** the progressive engine (rev 3.2) in `src/lab/ship-it/` with exact-outcome tests. The UI is lazy-loaded in the Workspace and also served at `/lab/ship-it/`. It is never required to reach portfolio content.
6. **Browser:** internal destinations only (`ganesh://` pages for case studies, the notes index, demos, and GitHub/LinkedIn *portfolio previews*, which are labelled as such). Tabs, an address bar, bookmarks, and back/forward history come from a pure, unit-tested `browser.ts`. Address-bar input is parsed with `URL`: a known internal route renders internally, a valid `https:` URL becomes an explicit "Open in a new tab" choice, and anything else is "not found". No iframes, no HTML rendering.

### Stage C (scope is decided after B)
7. **Journey** overlaps About. The proposal is to consolidate it into About as a timeline section unless it adds distinct verified milestones.
8. **Notes** is blocked on content: no archived post is approved for publication. Until one is, it ships no app (no empty shell).
9. **Architecture Lab:** one bounded cache and queue simulation, deterministic and unit-tested, labelled "Simulation · made-up numbers".

### Verification per stage
Lint, type-check, vitest, build, then Playwright on the served `out/` (Chromium, Firefox and WebKit on desktop; emulated Pixel 7 and iPhone 14), axe, console errors, overflow, 200% zoom and reduced motion. An independent review runs before each push. The home bundle check asserts that `/` requests no workspace chunk.
