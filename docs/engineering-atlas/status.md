# Engineering Atlas — status

Branch `feature/engineering-atlas`, pushed to `origin` (push authorized by Ganesh), from `main` @ `e0faf79`. Nothing is merged or deployed.
Plan: `implementation-plan.md` (rev 3.2). Design: `design.md`. Evidence: `evidence.md`.
Working checkouts: office laptop `C:\Users\bhatt\dev\my-portfolio`; home laptop `E:\dev-env\my-portfolio` (cloned 2026-10-07; `E:\dev-env\ganesh-portfolio` is an older `main` clone, untouched).

| Phase | Status | Notes |
|---|---|---|
| 0 Baseline | **verified** | `evidence.md` Phase 0 |
| 1 Design compositions | **verified** | Visual direction approved, including the macOS-inspired Workspace |
| W-slice Workspace (Projects + Terminal) | **verified** | Phone-panel focus leak fixed with a regression test (46aaa0a) |
| 2 Foundation | **verified on Windows export** | No-JS reading fixed by deleting `loading.tsx`; old files and deps removed. Full E2E matrix 91/91 |
| 5 Notes archive / CMS removal / migration | **active** | 6 posts archived as validated blocks (340dcda), unpublished. Build no longer contacts WordPress. Legacy URLs → noindex meta-refresh pages |
| 3 Case studies | **active** | WP Agent AI done: 4 decisions + 5-step request flow, each linked to pinned source. Spectra waits on the Loop Builder name; Masteriyo stays self-reported |
| 4 Ship It | pending | |
| 6 Integration/review | pending | Independent `/code-review` not yet run |
| 7 Handoff | pending | |

## Latest results (2026-10-07, home laptop, Windows 11, Node 23.6.0)
- `postbuild` segment fix (`scripts/fix-segment-names.mjs`): the build moved 43 nested files; 0 `__next.*` folders remain; a second run moves 0. Served on :4310, full loads and client-side navigation across `/`, `/work/`, `/work/spectra/`, `/journey/`, `/contact/`: 147 segment requests, all 200; 0 responses ≥ 400; 0 console errors.
- Deletions (approved by Ganesh): `loading.tsx`, `template.tsx`, 50 old component/data/hook/lib files, and 14 unused packages. Before deleting, grep confirmed no kept file imported any of them.
- Lint 0 errors, **0 warnings** (the 22 were all in deleted files). Type-check clean. 32 unit tests pass (29 + 3 new for the segment fix).
- E2E on the Windows production export (`E2E_BASE_URL=http://localhost:4310`), Chromium, Firefox, WebKit desktop plus emulated Pixel 7 (Chromium) and iPhone 14 (WebKit): **91 passed, 0 failed.** Mobile is emulated only; no real phones were tested.
  - The two runs before it, and what changed:
    - run 1, pre-deletion: 86/5;
    - run 2, post-deletion: 85/6.
  - What remained after deleting `loading.tsx` were test defects, all fixed:
    - a "Work" link selector also matched "Workspace";
    - `getByText` does not see `<noscript>` content (all three engines render it, screenshot checked);
    - the link crawl lacked the 180 s budget;
    - WebKit cancelled same-origin route fetches (not only `__next.*`) were reported as access-control errors.
  - The mobile-WebKit menu test failed once under the full-suite load and then passed 5/5 alone, so it is **flaky** and not fixed.

## Not verified
- **Linux `out/` diff**: this laptop has no WSL distro and no Docker. The fix is a no-op only when no `__next.*` folder exists (unit-tested). A real Linux build has not been compared. Do it on the office laptop (WSL, `~/atlas-ci`).

## Blockers needing Ganesh
1. Résumé PDF, portrait approval, product screenshots.
2. Confirm current employment; name form (Bhatt / Bhatta); headline approval.
3. Authorship and publish decision for each of the 6 archived posts.
4. The `@AGENTS.md` line in the repo `CLAUDE.md` (the rest of `CLAUDE.md` was updated to match the deletions).
5. Masteriyo: its source is private, so ownership claims stay self-reported unless Ganesh gives a public source.

## Found, not fixed (out of scope)
- `/workspace/` without JS: the notice links have no link styling and read as plain text.

## Next actions (in order)
1. Linux `out/` diff (office laptop).
2. P3: Spectra (with Ganesh's scope, after the Loop Builder confirmation) and Masteriyo (self-reported). The interactive aria-pressed diagram (plan §P3) is not built: the server-rendered ordered flow is its text equivalent.
3. Workspace staged apps: Journey, Notes, Résumé, Contact, then Arcade with Ship It (P4).
4. Independent `/code-review`, then fix and re-run.
