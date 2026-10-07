# Engineering Atlas — status

Branch `feature/engineering-atlas`, pushed to `origin` (push authorized by Ganesh), from `main` @ `e0faf79`. Nothing is merged or deployed.
Plan: `implementation-plan.md` (rev 3.2). Design: `design.md`. Evidence: `evidence.md`.

| Phase | Status | Notes |
|---|---|---|
| 0 Baseline | **verified** | `evidence.md` Phase 0 |
| 1 Design compositions | **verified** | Visual direction approved, including the macOS-inspired Workspace |
| W-slice Workspace (Projects + Terminal) | **verified** | Phone-panel focus leak fixed with a regression test (46aaa0a) |
| 2 Foundation | **active** | Atlas shell, home, /work/, /work/[slug]/, /journey/, /contact/, 404 (7519af1). No-JS reading **fails**: see blockers |
| 5 Notes archive / CMS removal / migration | **active** | 6 posts archived as validated blocks (340dcda), unpublished. Build no longer contacts WordPress. Legacy URLs → noindex meta-refresh pages |
| 3 Case studies | pending | Next: enrich flagship stories from verifiable sources |
| 4 Ship It | pending | |
| 6 Integration/review | pending | Independent `/code-review` not yet run |
| 7 Handoff | pending | |

## Latest results (2026-10-07)
- Windows (Node 24.18.0): lint 0 errors, 22 warnings (all in old files awaiting deletion). Type-check clean. 29 unit tests pass. `npm run build` exit 0 with `WORDPRESS_GRAPHQL_ENDPOINT` pointed at a dead host.
- Linux, CI-equivalent (WSL Ubuntu 24.04, portable Node 22.23.3, sha256-verified, fresh clone of 7519af1): `npm ci`, lint, type-check and 29 unit tests pass, and the build reports BUILD OK.
- E2E against the **Linux production export** (served from WSL on :4320 by `scripts/serve-out.mjs`): Chromium, Firefox, WebKit desktop, plus emulated Pixel 7 (Chromium) and iPhone 14 (WebKit). **83 passed, 8 failed.**
  - 3 × no-JS test (all engines): real defect. `src/app/loading.tsx` wraps every page in Suspense, so without JS the content stays hidden behind "Loading…". The fix is to delete that file (blocked, see below).
  - 2 × axe sweep and 1 × Firefox overflow sweep: timed out at 30 s (20+ page scans in one test). Timeouts raised to 180 s; **not re-run yet**.
  - 2 × WebKit: cancelled same-origin `__next.*` prefetches reported as "access control checks". The fixture now ignores only that exact pattern (regex checked against real and non-matching samples). **Not re-run yet.**
- No real phones were tested. "Mobile" means emulated viewports in Chromium and WebKit.

## Preview 404s on :4310 (Windows build), root cause confirmed
Next 16.2.0 `export/index.js` collects segment files with `path.relative()` (uses `\` on Windows), then `convertSegmentPathToStaticExportFilename` replaces only `/` with `.`. A Windows build therefore writes `work/__next.work/__PAGE__.txt` (folders) where the client requests `work/__next.work.__PAGE__.txt`. Navigation still works via the full-payload fallback, but every prefetch logs a 404.

The Linux build writes the correct dotted names: `/work/__next.work.__PAGE__.txt` returned 200 on :4320. The live site (CI on Ubuntu) also returned 200 for these files. Deployment is unaffected. Planned fix: a `postbuild` script that renames the nested segment files to the dotted names, a no-op on Linux. Verify by diffing the Windows and Linux `out/` file lists.

Correction: the earlier removal of the `(site)` route group was based on a misdiagnosis of this same bug. The replacement `ChromeGate` works and is kept.

## Blockers needing Ganesh
1. **Deletion permission**: the safety classifier blocked deleting old files. Needed to finish P2:
   - delete `src/app/loading.tsx` (fixes no-JS) and `src/app/template.tsx`;
   - delete old unused components, data and hooks: `src/components/{blog,contact,experience,hero,projects,sections,shared,ui}`, `src/components/layout/{footer,header,logo,theme-toggle}.tsx`, `src/data/{projects,experience,currently,services}.ts`, `src/hooks/`, `src/lib/{types,utils,wordpress}.ts`, `src/app/experience/client.tsx`;
   - then remove the unused deps: three, @react-three/*, @types/three, gsap, @emailjs/browser, sonner, graphql, graphql-request, clsx, tailwind-merge, @tailwindcss/typography, and motion if unused.
2. Résumé PDF, portrait approval, product screenshots.
3. Confirm current employment; name form (Bhatt / Bhatta); headline approval.
4. Authorship and publish decision for each of the 6 archived posts.
5. The `@AGENTS.md` line in the repo `CLAUDE.md`.

## Next actions (in order)
1. Add the postbuild segment-name fix, rebuild on Windows, serve on :4310, confirm zero console errors while navigating, and diff against the Linux `out/`.
2. Re-run the full E2E matrix on the production export and record the results.
3. Get deletion approval, then remove `loading.tsx` and the old files and deps, and re-verify no-JS.
4. P3: flagship case studies from verifiable sources (public repos and commit history, wordpress.org, product docs). No invented decisions or metrics.
5. Workspace staged apps: Journey, Notes, Résumé, Contact, then Arcade with Ship It (P4).
6. Independent `/code-review`, then fix and re-run.
