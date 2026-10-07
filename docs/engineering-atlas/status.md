# Engineering Atlas — status

- **Branch:** `feature/engineering-atlas` on `origin` (Ganesh authorized pushes), branched from `main` @ `e0faf79`. Nothing is merged, deployed or opened as a PR.
- **Docs:** plan `implementation-plan.md` (rev 4 at the end is current), design `design.md`, evidence `evidence.md`.
- **Checkouts:** office `C:\Users\bhatt\dev\my-portfolio`; home `E:\dev-env\my-portfolio`.

| Stage (plan rev 4) | Status | Notes |
|---|---|---|
| 0 Baseline, 1 Design | verified | `evidence.md` |
| F1 Mobile covered-launcher focus | verified | Regression test in `workspace.mobile.spec.ts` passes on emulated Pixel 7 and iPhone 14 |
| F2 P5: WordPress removed | verified | No Pantheon, WordPress or EmailJS reference left in source, config or CI. PR CI now also runs unit tests and the build |
| F3 Recruiter fast path | verified | "60-second overview" band on `/`, readable without JS (E2E) |
| F4 Portability | done | README covers setup, commands and env names; `.nvmrc` = 22 |
| D Desktop | verified | Mission Control, Spotlight, context menus, preferences and layout memory with reset, opt-in sound, motion setting, phone Back |
| A Apps | verified | Projects (case study and architecture diagram), Terminal (`open`), About Ganesh, Settings |
| B Ship It, Browser | in progress | Ship It engine and UI written and unit-tested; not committed yet |
| C Journey, Notes, Lab | pending | Journey is likely folded into About. Notes is blocked: no post is approved |
| 6 Integration/review | per stage | An independent review runs at each stage, and its valid findings are fixed |

## Latest verification (2026-10-07, home laptop, Windows 11, Node 23.6.0, Playwright 1.63)
- Lint 0 problems; type-check clean.
- Vitest 71/71.
- `npm run build` passes, then `postbuild` moved 43 files.
- E2E against the served production export (`node scripts/serve-out.mjs 4310`, then `E2E_BASE_URL=http://localhost:4310 npx playwright test`):
  - Full matrix **129/129** at 2c7cf81.
  - After the review fixes (7e2e4a6), the workspace suites ran 83/83 on all five projects.
  - Engines: Chromium, Firefox and WebKit on desktop, plus emulated Pixel 7 and iPhone 14. **Emulation is not real-device testing**, and no real phones were used.
- axe finds 0 violations on:
  - every Atlas page, light and dark;
  - the Workspace empty, with two windows, and in panels;
  - all four apps, light and dark;
  - Mission Control, Spotlight and the Workspace menu.
- Independent reviews:
  - 7dd3729: found unsupported Spectra copy. Fixed, and recorded in `evidence.md`.
  - 2c7cf81: 6 findings. Fixed 1–4, 6 and the stale `aria-controls`. The two regression tests fail on 2c7cf81 and pass after the fix.
- Flaky:
  - WebKit "opens Projects from the dock…" failed once in a full run. It then passed 20/20 under 8 workers and in the next full run, and has not been reproduced.
  - Mobile-WebKit menu flake from the previous session: not seen in these runs.

## Deliberate deviations (recorded, not bugs)
- **Tab in an open menu** closes it and returns focus to the opener. The ARIA pattern moves focus onward, but floating menus sit at the end of the DOM, so "onward" would leave the window.
- The wallpaper `menuitemradio` items have no wrapping `role="group"`.
- Workspace preferences load after hydration, so a custom wallpaper or theme can flash the default for one frame.

## Not verified
- Real iOS/Android devices; screen readers (NVDA, VoiceOver) by hand; Lighthouse.
- **Linux `out/` diff**: this laptop has no WSL or Docker. Do it on the office laptop.
- A CI run of the new PR job: it only triggers on PRs to `main`, and none has been opened.

## Blockers needing Ganesh
1. Résumé PDF (drop it into `public/resume/`), portrait approval, product screenshots.
2. Confirm current employment; name form (Bhatt / Bhatta); headline approval.
3. Spectra: confirm or reject an architecture/design role on the rewrite, and whether "load builder" means Loop Builder.
4. Authorship and publish decision for each of the 6 archived notes (Notes app waits on this).
5. The dangling `@AGENTS.md` line in the repo `CLAUDE.md`.
6. Masteriyo stays self-reported (private source).

## Handoff: continue on another laptop
```bash
git clone https://github.com/bhattaganesh/my-portfolio.git && cd my-portfolio
git switch feature/engineering-atlas
nvm use && npm ci && npx playwright install
npm run lint && npm run type-check && npm test && npm run build
node scripts/serve-out.mjs 4310 &   # then, in another shell:
E2E_BASE_URL=http://localhost:4310 npx playwright test
```
**Next:** Stage B (commit Ship It with its Arcade app and the `/lab/ship-it/` page; then the Browser app), then Stage C.
