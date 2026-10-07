# Engineering Atlas — implementation prompt

Copy everything below the divider into Claude Code or Gemini Antigravity. Give the agent access to `docs/portfolio-from-zero-proposal.md` and the real repository. If this workspace is only an empty Git repository, open the actual checkout or ask the agent to prepare an isolated checkout of the linked repository. Do not assume the proposal file already exists on GitHub.

---

You are my lead full-stack engineer, UI/UX designer, accessibility engineer, and verification owner. Turn the attached Engineering Atlas proposal into a complete, original, production-quality portfolio through the phases below. Own implementation and verification; do not stop at scaffolding, a homepage mockup, or advice.

## Objective and sources

Build a new portfolio for Ganesh Bhatta, primarily to win senior full-stack engineering roles and secondarily to attract architecture consulting. Make it distinctive, credible, fast, accessible, and enjoyable. Use Engineering Atlas as the working direction and Ship It as the optional signature game. This brief authorizes local implementation after the concrete design and plan reviews described below; it does not authorize deployment or unrelated external actions.

Primary design input: `docs/portfolio-from-zero-proposal.md`, supplied with this prompt. Read it completely. If absent, ask for the document; do not silently replace it with a generic interpretation.

Reference sources:
- Live site: https://www.ganeshbhatt.com.np/
- Repository: https://github.com/bhattaganesh/my-portfolio
- LinkedIn: https://www.linkedin.com/in/ganesh-bhatta/

Use source files, actual runtime behavior, and publishable evidence. LinkedIn may be inaccessible or its indexed extract incomplete. Never invent missing career information or attribute liked posts to Ganesh. Distinguish confirmed facts, existing self-reported claims, proposed copy, and illustrative simulations. Ask one focused question for material facts unavailable from the sources, while continuing independent work.

## Working rules

1. Inspect AGENTS.md, CLAUDE.md, native runtime instructions, Git state, project configuration, and available tools first. Honor direct user instructions and project rules. Reuse the runtime's native mechanisms; do not install unfamiliar plugins or create a parallel configuration framework.
2. Work in an isolated branch using the discovered project convention, defaulting to `codex/engineering-atlas` if none is defined. Preserve uncommitted user work. Never reset, clean, overwrite, or delete the existing checkout to make setup convenient. Do not push a base branch.
3. Keep existing hosting, domain, WordPress publishing, and viable framework choices unless a concrete benefit justifies an approved change. Ask before new dependencies, paid services, architecture/contract changes, external authentication, or irreversible actions. Previously granted authorization persists.
4. Use installed browser/testing capabilities. Do not claim screenshots, browser checks, builds, accessibility compliance, or performance results you did not execute. If a capability is missing, investigate available alternatives and state the limit.
5. Follow applicable skills and approval requirements. Present concrete, reviewable designs/plans, then honor the necessary gates. Do not repeatedly ask whether you may perform already-authorized routine implementation or verification.
6. Implement meaningful increments. Add tests for real behavioral risk, especially game rules, CMS failure, publication consistency, and interaction state. Avoid tests that merely duplicate static markup or implementation details.
7. Do not add arbitrary features, fabricated content, empty routes, fake successful forms, TODO UI, or unnecessary accounts. Never expose secrets in source, logs, screenshots, or documents. Client-public identifiers are not automatically secret; inspect their intended use.
8. No deployment, merge, DNS changes, external messages, valid contact-form submissions, or push/PR creation without authorization. If a PR is authorized, follow project instructions: draft by default and assign bhattaganesh. Re-read live external state after updates.

## Durable phase record

Maintain these files in `docs/engineering-atlas/`, respecting any more specific repository convention:
- `status.md`: phase status, completed work, exact checks/results, failures, decisions, remaining inputs, next action, and relevant branch/commit.
- `evidence.md`: professional claim sources, permitted assets, browser evidence, verification results, and performance conditions. Store screenshots in a clearly named local artifact directory without secrets or personal submission data.
- `design.md`: reviewed design/specification, architecture, routes, content models, and acceptance criteria.
- `implementation-plan.md`: ordered tasks, exact files, interfaces, validation, and dependency relationships.

Use pending / active / verified / blocked accurately. A phase becomes verified only when its acceptance criteria have executed evidence. User content or tooling blockers must name the unavailable proof; do not fake a pass. At each phase end, report Changed / Verified / Not verified / Remaining issues and update the record. Continue into the next phase when authorized prerequisites hold; do not stop merely because a phase ended. Before compaction or session interruption, preserve a precise next action.

## Phase 0 — establish the baseline

Inspect the actual checkout rather than assuming it matches remote main. Record framework/dependency versions, scripts, output mode, CI, hosting, content flow, existing routes, assets, and environment requirements without printing secrets. Run the existing meaningful checks and inspect the live site on desktop/mobile to distinguish existing defects from new regressions.

Previously observed concerns to reproduce, not blindly assume: homepage React hydration error #418; failed remote blog images; literal HTML entities in excerpts; hardcoded contribution totals/language percentages mixed with live statistics; silent WordPress fetch failures; PR workflow without a production build; inconsistent contact response promises and third-party processing copy.

Create a claim/asset inventory. Check the current résumé, roles/dates, screenshots, ownership, metric evidence, public code links, and CMS availability. Reconfirm current employment before publishing “Present.” Existing Spectra 40%/30% metrics lack verified measurement context. Omit them unless substantiated. Unknown content can remain in internal notes, never as invented public copy.

Gate: real repository/setup identified, baseline results recorded, source credibility limits explicit, and workspace protected.

## Phase 1 — concrete design and build plan

Translate the proposal into a precise design specification. Retain the proposed role-winning purpose. Explain any significant departure rather than silently dropping features.

Specify desktop/mobile compositions, type scale, colors, spacing, imagery, navigation, dark mode, interactions, reduced-motion behavior, focus, loading/empty/error states, and route migration. Choose the three flagship case studies by evidence quality. Document schema/interfaces and ownership for content, CMS adapter, diagrams, game rules, UI, and persistence.

Present a reviewable desktop hero, one project chapter, mobile layout, and game storyboard using the permitted design/prototype workflow. Do not invoke an implementation workflow before applicable design approvals. Ask for review of the written spec, then produce and present the detailed implementation plan. The plan must map every required feature to implementation and verification tasks; avoid vague “make it accessible” or “test everything” steps.

Gate: the user reviews the concrete direction, written spec, and implementation plan as required. Preserve any already-selected execution approach. Then implement the approved plan without redundant phase permissions.

## Phase 2 — portfolio foundation and complete visitor journey

Build the responsive shell, navigation, theme, typography, spacing, image treatment, accessible primitives, page metadata, and readable baseline. Keep meaningful content visible before hydration and if JavaScript fails. Use native scrolling.

Deliver coherent routes: `/`, `/work/`, `/work/[slug]/`, `/journey/`, `/lab/`, `/lab/ship-it/`, `/notes/`, `/notes/[slug]/`, and `/contact/`, with content-driven decisions for Notes. Do not expose an empty writing section if no credible articles are ready.

The home page flows through identity, selected work, engineering thinking, career journey, lab invitation, useful notes if available, and contact. It must avoid repeating the same claims across sections. A recruiter must see role, specialization, work, résumé, and contact without playing or completing an animation. If no approved résumé exists, do not publish a dead/fake download; flag the required input.

Art direction: warm off-white, near-black, cobalt, restrained orange annotations; equally readable charcoal dark mode; asymmetric hero, numbered chapters, authentic screenshots, original diagrams, restrained Nepal-inspired contours. Avoid generic repeated card grids, oversized clocks, forced intro screens, scroll hijacking, and custom cursor replacement. Preserve actual employment titles even when the portfolio headline uses Senior Full-Stack Engineer.

Verify production rendering, navigation, active states, menu keyboard behavior, theme persistence, readable no-JS content, missing assets, and layout at 360, 390, 768, 1024, and 1440px. Test 200% zoom and long text. Capture and inspect representative screenshots, not just generated files.

Gate: complete professional visitor journey works; no dead primary action, overflow, hydration error, or essential hidden content in tested states.

## Phase 3 — case studies and explanatory diagrams

Complete three flagship stories, provisionally Spectra, Masteriyo, and the strongest evidenced payments/authentication/integration or WP Agent AI story. Explain problem, constraints, personal ownership, team context, alternatives, chosen decisions, outcomes, evidence, and limitations. Separate product reach from personal impact. Never invent first-person decisions or benchmark results to fill gaps.

Add authentic, permitted product screenshots with useful captions. Illustrative diagrams must be labeled and must not masquerade as private production architecture or telemetry. The featured diagram lets visitors select numbered stages and inspect responsibility, data boundaries, and failure behavior. Provide a complete ordered text equivalent. Avoid essential hover-only behavior.

Verify all case-study links, keyboard/touch selection, stage explanations, text equivalents, image failure recovery, responsive diagrams, and evidence references. If credible inputs for three stories are missing, identify exactly what is required and continue implementable work; the content phase cannot be claimed complete.

Gate: case studies communicate supported personal contributions, and their diagrams work with keyboard/touch and reduced motion.

## Phase 4 — Ship It game

Implement one polished, optional, turn-based architecture puzzle with three authored rounds:
1. Read-heavy course catalogue under increased traffic: queries, cache, or more application workers.
2. Duplicate payment webhook: idempotency and durable processing rather than blind retries or client-only checks.
3. Slow editor: render work, state boundaries, and the limits of delaying UI updates.

Loop: introduce a fictional situation → choose an intervention → show the simulated result → explain its trade-offs → connect to relevant real work. Label all values and outcomes as illustrative, not production measurements. At least two choices can be viable where the scenario assumptions support them; there is no universally best architecture.

Separate a pure deterministic state-transition engine from React, timers, animation, input handling, and optional storage. Document scenario assumptions, valid states, actions, outcomes, and scoring if used. Use authored variants for replayability. No accounts, public leaderboard, streak pressure, required audio, live code execution, or real financial integrations.

Deliver start, selection, feedback, next round, results, replay, pause/help, and exit behavior. Touch uses tap-to-select rather than mandatory drag. Keyboard controls and semantic announcements are required. Provide a turn-based text presentation. Never score reading speed. Storage unavailability must not break play. Prevent accidental double actions. Avoid timers unless the reviewed design requires them; if present, pause safely when hidden.

Verify every scenario/action outcome and invariant, replay/reset, invalid or repeated actions, end states, persistence failure, keyboard-only and touch completion, reduced motion, route leave/return, and relevant pause behavior. Check that game assets are not required by the initial home page; inspect eager prefetching and imports rather than assuming code splitting suffices.

Gate: all three rounds can be completed, replayed, and exited; explanations match tested rules; game behavior does not depend on frame rate or reading speed.

## Phase 5 — reliable content, contact, and URL migration

Preserve WordPress publishing unless a reviewed decision changes it. Select one consistent publication strategy that works with static export. Do not list newly fetched posts whose detail pages have not been built. Distinguish an empty collection from an unavailable CMS. A failed CMS build must not silently replace previously valid content with an apparently successful empty deployment.

Decode excerpts to safe plain text, validate image/content sources, give failed images useful fallback treatment, and document the HTML trust boundary. Verify article formatting, code blocks, heading anchors, dates, pagination/search if included, and empty/error behavior.

Prefer truthful email contact as the baseline. A retained form requires verified delivery through an explicitly authorized controlled test, invalid-field focus, submission state, recovery, and accurate processing disclosure. Do not submit valid test messages to external services without permission. No successful delivery claim based only on mocked responses.

Map existing `/projects/`, `/experience/`, `/blog/`, and individual URLs. Keep backward-compatible rendered pages or use redirects genuinely supported by the confirmed host. Do not assume GitHub Pages supports server-side redirect configuration. Verify static output, canonical URLs, internal links, and sitemap against that strategy.

Gate: publication and failure states are coherent, contact claims are honest, and old professional links retain a useful destination.

## Phase 6 — integration, accessibility, performance, and review

Run repository-appropriate lint, type checking, meaningful tests, and production static build. Serve and test the built output, not only the development server. Ensure PR CI exercises the production build while deployment stays restricted appropriately.

Test the entire approved visitor journey in the available browser matrix. At minimum cover current Chromium desktop and mobile viewport; add Firefox/WebKit where available and explicitly identify untested real devices. Examine console/network errors. Exercise direct route loads, navigation/back, missing images, CMS failure, denied storage, reduced motion, no-JS baseline, keyboard focus, modal/menu dismissal, and layout/zoom.

Run available automated accessibility checks and manual checks for labels, landmarks, heading order, reading order, visible focus, keyboard interaction, contrast, touch targets, announcements, and accessible diagram/game alternatives. Do not claim full WCAG compliance from one automated scan.

Measure mobile lab performance on production output, record tooling/version, device/throttling/cache conditions, and distinguish cold load from repeat load. Field targets are LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 at the 75th percentile once real-user data exists. Lab results do not prove field INP. Inspect bundle/network costs and fix measured bottlenecks rather than chasing a cosmetic score.

Review the final diff for correctness, accessibility, security/trust boundaries, compatibility, content truthfulness, maintenance burden, and design coherence using the strongest available suitable review capability. Use independent review where available and authorized. Fix valid findings and re-run affected checks. Do not weaken tests to obtain green results.

Gate: required checks pass with evidence; material defects resolved; verification limitations explicitly stated. Required verification that cannot run is a blocker for the relevant completion claim.

## Phase 7 — reviewable handoff and launch preparation

Deliver the complete local preview, representative desktop/mobile/light/dark screenshots, verified change summary, test results, content evidence notes, migration map, outstanding user inputs, and deployment/rollback instructions. Remove temporary scaffolding, broken placeholders, debug UI, and accidental tracked artifacts; preserve useful review evidence in the agreed location.

Do not deploy or merge. If separately authorized, create the required draft PR and perform project workflow updates; do not mark it ready without Ganesh's instruction. A deployment needs its own authorization and post-deployment checks on the confirmed target.

Final report: Changed / Verified / Not verified / Remaining issues, with actual local paths, preview URL if available, relevant commit/PR if authorized, and exact next action. Do not call the portfolio launch-ready if professional evidence, résumé, required browser checks, or promised delivery remains unverified.

## Start now

Read the design proposal and project instructions, inspect the checkout, and execute Phase 0. Report the verified baseline, then present the concrete Phase 1 design and plan for the required review. Do not ask me for facts available in the repository or tools. Continue all authorized work once the relevant review gates are satisfied.

## Continuation instruction for a later session

If this is a resumed session, read this prompt, the proposal, `docs/engineering-atlas/status.md`, reviewed design/plan, current Git diff, and latest check results first. Reconcile records with actual files. Resume the earliest incomplete requirement. Do not regenerate approved designs or restart verified phases without evidence that they are stale or broken.
