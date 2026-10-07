# Ganesh Bhatta — portfolio from zero

Design proposal · 7 October 2026 · Proposed for review; implementation has not started.

## Brief

Create an original portfolio for a senior full-stack engineer, primarily to win senior engineering roles and secondarily to attract architecture consulting. Ganesh explicitly wants a creative, advanced experience with optional entertaining interactions. Success means that a recruiter can establish fit quickly, an engineering lead can inspect credible evidence, and a curious visitor can enjoy an interactive demonstration.

The ambition is exceptional quality. “Best in the world” is a creative ambition, not a measurable claim or promised outcome.

## Ground truth and content policy

Sources inspected: https://www.ganeshbhatt.com.np/, its experience and project pages, https://github.com/bhattaganesh/my-portfolio, and the publicly indexed extract at https://np.linkedin.com/in/ganesh-bhatta. The full LinkedIn profile was unavailable. Search extracts may be incomplete or stale.

Working career chronology from repository src/data/experience.ts:

- B.Sc. CSIT, Siddhanath Science Campus / Tribhuvan University: 2016–2021.
- Zenlab Laravel internship: June–November 2021.
- ThemeGrill PHP Developer: December 2021–January 2025.
- Brainstorm Force Software Developer: January 2025–Present, as recorded in the source. Current employment must be reconfirmed before launch.

Public portfolio positioning may say Senior Full-Stack Engineer; individual employment entries retain their actual titles. Separate product installation counts from personal adoption or performance impact. The site's existing 40% and 30% Spectra figures are unverified and cannot become launch copy without measurement context. Do not invent testimonials, benchmarks, awards, ownership, or private work details. Never treat liked LinkedIn posts as Ganesh's own writing.

## Three possible directions

1. Engineering Atlas — recommended. Editorial storytelling with interactive system diagrams, a project atlas, and one architecture puzzle. Best balance of professional depth, individuality, accessibility, and playful discovery. Requires strong content and original visual assets.
2. Product Studio. Art-directed product screenshots, concise stories, cinematic transitions, and a small playground. Best for consulting conversion and visual polish; less distinctive technically unless the stories are unusually strong.
3. Interactive World. A navigable 3D workspace with projects represented as objects. Most immersive, but has higher performance and accessibility costs and can slow recruiter discovery. Better as an optional later experiment than the main interface.

## Recommended concept: Engineering Atlas

A portfolio that opens like an engineer's published body of work and expands into the systems behind it. Visitors encounter outcomes first and inspect architecture when interested. The personality comes from Ganesh's journey, decisions, products, and original diagrams.

Visual metaphor: a precise technical atlas with restrained contour lines inspired by Nepal's terrain. Geography contributes texture and personal context; it does not turn the website into a travel theme.

Working hero copy:

> Ganesh Bhatta
> I build the systems behind better software.
> Senior full-stack engineer working across WordPress, Gutenberg, React, and PHP.

These are proposed words, not a quote from Ganesh. Final supporting copy will mention verified current work and exact contributions.

Primary action: Explore selected work. Secondary: Download résumé. A smaller invitation introduces the optional lab. Identity, résumé, and contact are available without playing or waiting through animation.

## Visitor journeys

### Recruiter, around 30 seconds

Hero identifies role, specialization, and location. Selected work establishes fit. A compact career summary and résumé support evaluation. Contact stays easy to find. Timing is a design target, not a measured result.

### Engineering lead, several minutes

Open a case study, inspect personal ownership, system diagrams, constraints, trade-offs, and evidence. Follow approved public code or product links. Understand how Ganesh handles security, compatibility, performance, and failure modes.

### Curious visitor

Explore a system diagram or play the architecture puzzle. Receive immediate feedback and a relevant link to a real project. Leave freely and return to the ordinary portfolio navigation.

## Visual direction

- Light mode is the initial editorial canvas: warm off-white, near-black text, cobalt primary actions, restrained orange annotations. Dark mode uses deep charcoal, readable warm white, and the same hierarchy.
- Large expressive headline typography paired with highly readable body text. Monospace is reserved for diagrams, metadata, and technical annotations.
- Asymmetric hero, numbered project chapters, full-width screenshot spreads, narrow reading columns, and occasional diagram panels. Avoid using one card grid for every section.
- Original product screenshots, cropped feature details, and a deliberate portrait treatment. No generated UI pretending to be a real product screenshot.
- Motion connects states: diagram connections, chapter transitions, selected project expansion. Native scrolling, no scroll hijacking, no forced opening sequence, no custom cursor replacing pointer conventions.
- All motion can be reduced. No essential content depends on hover, animation, or WebGL.

## Information architecture

### Home /

1. Identity and proposition: statement, portrait or system illustration, primary actions.
2. Selected work: three substantial editorial entries, each naming a problem and Ganesh's contribution.
3. How I think: one readable interactive system diagram with an ordinary text explanation.
4. Career journey: education context, internship, ThemeGrill, Brainstorm Force. Link milestones to actual work.
5. Lab invitation: short description and screenshot of the optional architecture puzzle.
6. Field notes: two or three strong technical articles, only if ready and useful.
7. Contact: role interests, consulting scope, résumé, email, and truthful response expectations.

The three flagship work entries are provisionally Spectra, Masteriyo, and one concrete payments/authentication/integration story. WP Agent AI can replace the third if its current public implementation supplies stronger evidence. Choose by evidence quality, not novelty alone.

### Work /work/ and /work/[slug]/

The index makes all selected work discoverable without filtering. Each story includes:

- One-sentence outcome and an authentic product image.
- Role, dates, collaborators/team context, and exact ownership.
- Problem and constraints.
- A system diagram with a text equivalent.
- Two or three significant decisions, alternatives, and trade-offs.
- Implementation details that are safe to publish.
- Evidence: verified measurements with baseline/method/date, public links, or observable feature behavior.
- Lessons, limitations, and what Ganesh would improve now.
- Related work and contact action.

Avoid merely turning a product feature list into a personal case study.

### Journey /journey/

A readable timeline with optional expanded chapters. Emphasize increasing responsibility, technical breadth, and decisions. Include the degree and internship; keep early school history out of the main professional narrative. Include location and remote-work context without unnecessary personal information.

### Lab /lab/ and /lab/ship-it/

The signature experience and its rules are described below. Future experiments must earn their place; no empty gallery of promised features.

### Notes /notes/ and /notes/[slug]/

Technical writing with clean code blocks, accessible navigation, content dates, and sources. Prefer first-hand engineering lessons over generic tutorials. No fabricated authorship or publication dates.

### Contact /contact/

Email, professional links, current résumé, and concise role/consulting interests. A form is included only if its delivery can be verified. Visible error recovery, accurate processing disclosure, and consistent response expectations are required.

## Signature experience: Ship It

A small architecture puzzle, approximately two to four minutes per session. Visitors stabilize a fictional product as demand grows. This is explicitly a simplified simulation, not a production benchmark or a hiring test.

### Core loop

1. Start with a healthy fictional product and a visible request path.
2. A scenario introduces a bottleneck or failure.
3. The visitor chooses one intervention from a small set.
4. The simulation explains the benefit, limitation, and trade-off using the fixed scenario model.
5. A short debrief links to a relevant real case study.

### First release scope

Three authored rounds in one game:

- Read-heavy course catalogue: choose between query improvement, cache, and additional application workers. Show that the bottleneck determines the result.
- Duplicate payment webhook: explore idempotency and durable processing. Explain why blind retries or client-side checks alone do not resolve duplicate processing.
- Slow editor interaction: compare reducing render work, adjusting state boundaries, and merely delaying UI updates.

Each scenario has deterministic rules, documented assumptions, at least two viable outcomes where realistic, and an explanation. Do not claim there is a universal best architecture. No live execution of user-supplied code or real payment systems.

### Replayability and controls

Different authored constraints can make another choice useful. A replay button and a local personal best are optional. Do not penalize deliberate reading or accessibility needs. No public leaderboard, accounts, streak pressure, infinite loops, or required sound. Sound can be an opt-in enhancement after the silent game works well.

Keyboard-selectable actions, large touch targets, pause/restart/exit controls, semantic result announcements, and a turn-based text view are part of the game. Mobile uses tap-to-select, not mandatory dragging. Local storage failure must not prevent play. The game bundle loads only when needed.

## Second interaction: explore a system

A case-study diagram highlights a request path as the visitor selects numbered stages. For an authentication example, stages might include request, token generation, delivery, validation, and session creation. The actual diagram must match the publishable implementation.

Visitors can inspect responsibility, data boundaries, and failure behavior at each stage. Every stage also appears in a readable ordered explanation. It is an explanatory artifact, not an invented production telemetry dashboard.

## Proposed architecture

Retain TypeScript, React, and Next.js if they remain a good fit after the approved design is prototyped. A new visual system does not require replacing a suitable framework. Preserve static export and GitHub Pages initially; there is no approved hosting migration.

Responsibilities:

- Portfolio shell: navigation, theme, responsive layout, metadata, résumé, and contact routes.
- Content: typed career/project records and authored case studies; independent from presentation.
- Case-study diagrams: semantic SVG/HTML and state-driven highlighted paths.
- Game: pure deterministic scenario engine separate from UI, inputs, animation, and storage.
- CMS adapter: converts WordPress content to the selected rendering model, validates URLs, distinguishes failure from absence, and decodes excerpts correctly.

Keep existing WordPress publishing until there is a justified and approved alternative. A static site must distinguish content built at deployment from content fetched at runtime. Avoid exposing newly published listing links before their detail pages exist. Decide between consistent build-time publication or a verified rebuild integration during implementation planning.

No new dependencies, paid services, hosting change, or authentication are approved by this proposal. Prefer CSS/SVG for the first version. A dependency or 3D feature needs a demonstrated benefit and explicit approval where required.

## Quality requirements

- Text and professional evidence remain accessible if JavaScript fails.
- No hydration errors in the supported browser matrix.
- No broken project links, empty screenshot frames, or raw CMS entities.
- WCAG 2.2 AA is the verification target, including keyboard use, focus, contrast, reduced motion, semantics, and accessible game alternatives.
- Aim for field LCP <= 2.5s, INP <= 200ms, and CLS <= 0.1 at the 75th percentile once sufficient real-user data exists. Before launch, use mobile lab testing as a proxy, not proof of field performance.
- Optional lab assets are absent from the initial portfolio route's required payload. Images are resized appropriately and decorative work stops when offscreen or the tab is hidden.
- Static export is exercised for pull requests. CMS failure must not silently erase successful content in a deployable build.
- Retain useful existing URLs or verify supported redirects with the chosen host. Migration mapping covers /projects/, /experience/, /blog/, and individual detail URLs.
- Truthful metadata, canonical URLs, sitemap, social previews, and a professional 404 page.

## Proposed delivery sequence

This is a design-level sequence, not the detailed implementation plan.

1. Evidence and content: establish dates, ownership, permitted screenshots, publishable diagrams, metrics, and current résumé. Omit unverified claims.
2. Art direction: review hero, one project chapter, and a mobile composition before applying the visual system to every route.
3. Core portfolio: build a complete readable journey from identity to work to résumé/contact.
4. Case studies: complete three evidence-rich stories and their explanatory diagrams.
5. Lab: deliver one fully working game with the three rounds and accessible controls.
6. Validation: functional, responsive, keyboard, reduced-motion, game-model, content-failure, static-build, and performance checks.
7. Launch preparation: verify migration paths, analytics scope, form delivery if included, privacy copy, and deployment rollback. Publication remains a separate authorized action.

## Acceptance criteria

- A first-time visitor can identify role, specialism, selected work, résumé, and contact without interacting with the game.
- Three case studies clearly separate personal contribution from team/product scope.
- Every published number has an evidence note or source; stale/unverified numbers are omitted.
- A visitor can finish, replay, and exit Ship It with keyboard or touch. Correctness does not depend on frame rate or reading speed.
- Every diagram and game result has a meaningful text equivalent.
- Mobile layouts have no horizontal overflow, obscured controls, or mandatory desktop interactions.
- Failed CMS/image/storage paths preserve useful behavior and report actionable failure where appropriate.
- Required checks pass on the final implementation; claims about testing cite real executed results.

## Decisions for review

Approve or revise Engineering Atlas as the visual/narrative direction and Ship It as the optional signature experience. Thereafter produce the written specification and detailed implementation plan, with exact route migration, content models, file responsibilities, dependency decisions, test cases, and deployment mechanics.

Remaining content inputs can be collected during design: current career dates, approved screenshots, actual ownership, evidence for metrics, and a current résumé. These do not prevent a concept prototype, but they gate publishing those claims or assets.
