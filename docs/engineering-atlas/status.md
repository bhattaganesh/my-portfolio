# Engineering Atlas — status

Branch `feature/engineering-atlas` (local only, not pushed), from `main` @ `e0faf79`.
Approved plan: `implementation-plan.md` (rev 2). Evidence: `evidence.md`.

| Phase | Status | Notes |
|---|---|---|
| 0 Baseline | **verified** | Local checks + live 5-width sweep recorded in `evidence.md` |
| 1 Design compositions (Step B) | **verified, awaiting final design review** | Prototype v2 published; macOS-inspired Workspace direction applied to the functional slice |
| 2 Foundation | pending | Blocked on design review |
| W-slice Workspace (Projects + Terminal) | **active, awaiting review** | Commit 5a1dbc2; 26 unit + 14 E2E passing in dev; production export blocked by the CMS (P5) |
| 3 Case studies | pending | |
| 4 Ship It | pending | |
| 5 Content/contact/migration | pending | |
| 6 Integration/review | pending | |
| 7 Handoff | pending | |

## Phase 0 results
- `npm ci` OK. `next typegen && lint && type-check` exit 0 (23 lint warnings, 0 errors).
- `npm run build` **fails** (exit 1) because the frozen CMS returns 0 blog slugs. Rebuilding `main` today cannot deploy.
- Live: #418 present, overflow on `/` (+9 px at 360) and blog post (+503 px at 360), `/blog/` CMS fetch fails, résumé 404.

## Decisions
- Repo convention over personal default: base `main` (no `develop` exists), branch prefix `feature/`.
- Removed nothing yet. The dependency removal list is in plan §2.
- No AGENTS.md created (plan §6).

## Open items for Ganesh
1. Résumé PDF.
2. Confirm Brainstorm Force is current employment.
3. Authorship and publish decision per archived post (6).
4. Permitted Spectra / Masteriyo screenshots.
5. Contact response-time statement (optional).
6. Repo `CLAUDE.md` line 1 imports `@AGENTS.md`, which does not exist. Drop the line or author a shared AGENTS.md?
7. Rollback reality: the old site cannot be rebuilt while the CMS is frozen (see `evidence.md`).

## Next action
Ganesh reviews the slice screenshots and prototype v2. Then P2 foundation, P5 CMS removal (unblocks the production export), and the remaining apps. No push/merge/deploy.
