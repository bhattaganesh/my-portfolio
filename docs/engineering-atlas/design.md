# Engineering Atlas — design specification

Status: **proposed, awaiting review** (rev 3, adds Ganesh Workspace). Visual compositions follow in Step B. The Atlas portfolio spec (rev 2) is in `implementation-plan.md`. This file holds the shared content model and the full Workspace spec.

## 1. Two experiences, one content source

| | Engineering Atlas | Ganesh Workspace |
|---|---|---|
| Role | Main professional portfolio, works without JS | Optional virtual desktop, progressive enhancement |
| Route | `/`, `/work/…`, `/journey/`, `/lab/…`, `/notes/…`, `/contact/` | `/workspace/` (deep link: `/workspace/#projects`) |
| Entry | — | Prominent **Enter my workspace** action in the Atlas header and hero (`<Link prefetch={false}>`) |
| Exit | — | Always-visible **Back to portfolio** in the top bar, plus `exit` in the Terminal |

Both experiences read only from `src/content/`: roles, case studies, approved notes, skills, résumé metadata, and contact links. Neither has its own copy of any fact. Shared **views** (`src/components/views/`) render that content, and both Atlas pages and Workspace windows mount the same views. Nothing is iframed.

## 2. Module boundaries

```
src/content/                 shared verified content + zod schemas (no React)
src/components/views/        focused content views: ProjectList, ProjectDetail, JourneyTimeline,
                             NoteReader, ResumePanel, ContactPanel (used by Atlas pages and Workspace apps)
src/lab/ship-it/             pure deterministic game engine (no React)
src/components/ship-it/      game UI (shared by /lab/ship-it/ and the Arcade app)
src/workspace/wm/            window-manager state: types, reducer, geometry (pure, no React/DOM)
src/workspace/terminal/      command parser, registry, completion, history (pure)
src/workspace/prefs.ts       versioned preference storage (optional sound only)
src/workspace/registry.ts    app registry: id, title, icon, default size, minimum size, lazy view loader, page href
src/components/workspace/    shell: Desktop, Wallpaper, Dock, Launcher, Window, WindowSwitcher, MobilePanels
src/app/workspace/page.tsx   route; server-renders the launcher as plain links (no-JS fallback)
```

## 3. Visual identity, distinct but related to Atlas

The workspace is a **drafting table at night**: a deep slate wallpaper (`#1B2230`) with restrained contour lines (static SVG, 1px, 12% opacity). It reuses the Atlas cobalt `#8EA2FF` and orange `#F08A5D` as annotation colours. Windows are warm "paper sheets" (`#F3EFE6`, ink `#16181C`), so content stays readable in the same light palette as Atlas. A dark-sheet variant follows the OS/Atlas theme toggle. Title bars use JetBrains Mono at 13px. Cabinet Grotesk appears only in the launcher and empty states. The dock sits at the bottom centre with labelled icons, not icon-only. The top bar holds the workspace name, a switcher button, a sound toggle (off), and Back to portfolio.

There is no boot animation, splash, fake login, or fake permission prompt. Everything is static the moment JS hydrates.

Step B compositions to review:
1. Desktop at 1440 with wallpaper, desktop icons, dock, and top bar.
2. The launcher open.
3. One Projects window (Spectra detail).
4. A multi-window state: Projects focused over Terminal, Journey minimized in the dock.
5. Mobile app view at 390: the launcher grid, then Projects as a full-screen panel with its header.

## 4. Window manager

### State (`src/workspace/wm/types.ts`)
```ts
type AppId = 'projects'|'journey'|'arcade'|'terminal'|'notes'|'resume'|'contact';
type Mode = 'normal'|'maximized'|'minimized';
interface Rect { x: number; y: number; w: number; h: number }
interface Win { app: AppId; mode: Mode; rect: Rect; restoreTo: 'normal'|'maximized' }
interface WmState {
  windows: Partial<Record<AppId, Win>>;   // single instance per app
  order: AppId[];                          // z-order, last = top; exactly the open apps
  focused: AppId | null;
  viewport: { w: number; h: number };      // work area = viewport minus top bar and dock
  layout: 'desktop'|'panels';              // panels below 768px CSS width
}
```

### Actions (pure `reduce(state, action)`; an unknown or inapplicable action returns the **same object**)

| Action | Effect |
|---|---|
| `open(app)` | not open: create at a cascaded default rect, clamped; push on top; focus. Open but minimized: restore. Open: focus. |
| `focus(app)` | move to top of `order`; `focused = app`. No-op if minimized or absent. |
| `minimize(app)` | `restoreTo = mode`, `mode = minimized`; focus passes to the topmost non-minimized window, else `null`. |
| `restore(app)` | minimized → `restoreTo`; maximized → normal; then focus. |
| `toggleMaximize(app)` | normal ↔ maximized (rect is kept for restore). |
| `close(app)` | remove from `windows` and `order`; focus passes as with minimize. |
| `moveBy(app, dx, dy)` / `moveTo` | normal mode only; result clamped. |
| `resizeTo(app, w, h)` | normal mode only; clamped to min/max. |
| `viewport(w, h)` | re-clamp every normal rect; switch `layout` at the 768px threshold. |
| `cycle(dir)` | focus the next or previous non-minimized window in z-order. |

### Invariants (each one is a vitest property over random action sequences plus targeted cases)
1. `order` is a permutation of the keys of `windows`.
2. `focused` is `null` or an open, non-minimized app that is the topmost non-minimized entry in `order`.
3. Every normal rect has `w ≥ minW(app)` and `h ≥ minH(app)` (min = min(app minimum, work area)).
4. **No stranded windows**: the title bar is fully inside the work area vertically (`0 ≤ y ≤ workH − 40`), and at least 96px of it is horizontally visible (`−w+96 ≤ x ≤ workW − 96`). This holds after any `moveBy`, `resizeTo`, or `viewport`.
5. When `layout === 'panels'`, rendering ignores rects. Rects are still kept valid, so returning to desktop is safe.
6. The reducer is deterministic. There's no `Date`, `Math.random`, or DOM.

### DOM semantics and focus
- Each window is a `<section aria-labelledby="win-title-{app}">` (region landmark), **not** `role="dialog"`/`aria-modal`. Windows are non-modal and the rest of the desktop stays operable.
- Title bar: an `h2` (`tabindex="-1"`, the focus target), plus buttons **Minimize / Maximize or Restore / Close**, each with an accessible name that includes the app name and a 44×44 target. A **Window menu** button (Alt+Space when the window has focus) lists Move, Size, Minimize, Maximize/Restore, and Close.
- **Minimized windows render `hidden` + `inert`**, so they are not focusable and not in the a11y tree. Their view stays mounted, so in-app state persists.
- Focus rules (implemented in `Window`, driven by `focused` changes):
  - open → the window's `h2`;
  - switch/focus → the last focused element inside that window if it is still connected, else the `h2`;
  - minimize → the new focused window's remembered element, else that app's dock button;
  - restore → remembered element;
  - close → the new focused window, else the dock or launcher button that opened it.
  - A `focusin` inside a background window brings it to the front.
- Dock (`<nav aria-label="Apps">`): each app is a button with `aria-pressed` reflecting open. Pressing it opens, focuses, or (if it is already the focused window) minimizes. It shows a running indicator that is visible as well as announced (`aria-describedby` "open" / "minimized").
- Window switcher: the top-bar **Switch window** button, or `Alt+Shift+W`, opens a listbox of open windows. Arrow keys move, Enter focuses or restores, Esc closes and returns focus. Shortcuts always have a visible button equivalent. Single-character shortcuts are not used (WCAG 2.1.4).
- Keyboard move/size: Window menu → Move, then arrows move 16px (Shift 64px), Enter/Esc ends. Size works the same way on w/h. Dragging (title bar, Pointer Events with `setPointerCapture`) and the bottom-right resize handle are conveniences, never the only way.
- An `aria-live="polite"` status announces "Projects opened", "Terminal minimized", and similar.
- Reduced motion: window open/minimize transitions only appear under `prefers-reduced-motion: no-preference` and are 120ms opacity/transform.

### Mobile (`layout === 'panels'`, below 768px)
The launcher grid is the home screen. Opening an app shows it as a full-screen `<section>` with a header that has **Back to apps** (returns focus to that app's tile), the app title, and **Switch** (the same listbox). There is no drag, no tiny controls, and no move/size. Other open apps stay mounted and hidden + inert. The browser Back button is honoured by syncing `location.hash` (`#projects`) with `history.pushState`.

### Resize recovery
A `resize` listener (rAF-throttled, removed on unmount) dispatches `viewport`. Playwright verifies 1440 → 800 → 1440 and 1440 → 390 → 1440 with a window dragged to an edge first. Every title bar must remain reachable.

## 5. Apps

| App | View | Notes |
|---|---|---|
| Projects | `ProjectList` → `ProjectDetail` (in-window view state, Back button) | Screenshots via `FigureImage` (genuine fallback). "Open full page" links to `/work/[slug]/`. |
| Journey | `JourneyTimeline` | Actual titles. "Present" only if confirmed. Related-work links open Projects at that slug. |
| Arcade | `ShipIt` (lazy) | Same engine and UI as `/lab/ship-it/`, all 3 rounds and both payment variants. **Minimized: progress kept** (still mounted, no timers). **Closed: run discarded.** The help text says so before play starts. |
| Terminal | `Terminal` (lazy) | See §6. |
| Notes | `NoteList` → `NoteReader` | Only notes with `published: true`. If there are none, the empty state says "No published notes yet" and links to Projects. The Notes icon is still shown so the state is explained, not hidden. |
| Résumé | `ResumePanel` | Build-time check that `public/resume/<file>.pdf` exists. If it does: an inline `<object type="application/pdf">` preview (same-origin PDF, not the portfolio), a **Download PDF** link (`download`), and an "Open in new tab" link. The preview falls back to the links if the PDF can't render inline (iOS). If it doesn't exist: "The current résumé isn't published yet. Email me and I'll send it.", plus contact. |
| Contact | `ContactPanel` | Email (`mailto:` link and selectable text, with a copy button that falls back to selecting the text), LinkedIn, GitHub. **No form**, per the earlier decision. |

Per-window states: loading ("Loading Terminal…" skeleton while the lazy chunk loads), error (a per-window error boundary: "Terminal couldn't load. Retry / Close", with Retry re-importing), empty (as above).

Cleanup: views own their listeners and effects, and closing unmounts them. AudioContext is closed when sound turns off or the workspace unmounts. There are no intervals anywhere.

## 6. Terminal (simulated, safe)

- Commands: `help`, `about`, `projects [slug]`, `journey`, `skills`, `notes [slug]`, `resume`, `contact`, `clear`, `exit`.
- `parse(input)`:
  - trim, then reject input over 200 chars ("Input too long");
  - split on whitespace; lowercase the command; look it up in a `Map`;
  - extra or unknown arguments produce usage text.
- Output is **structured data** (`{kind:'text'|'list'|'link'|'action', …}`) rendered as React text and buttons. There's no `eval`, `Function`, `innerHTML`, shell, network, or filesystem access. `projects spectra` returns an `action` that opens Projects at that slug.
- Unknown input: "`foo` isn't a command. Try `help`." plus a "Did you mean `notes`?" hint when Levenshtein distance ≤ 2.
- History: ↑/↓ through up to 50 entries, kept in memory only.
- Autocomplete, which **never traps focus**:
  - Tab calls `preventDefault()` **only when the completion actually changes the input value** (a unique match, or a longer shared prefix of several matches). In every other case (empty input, no match, ambiguous with nothing to extend, already complete) Tab is not intercepted and moves focus on normally. Shift+Tab is never intercepted.
  - Candidate suggestions show as you type, in a visible hint line (`aria-live="polite"`), not as a Tab-only reaction. A second Tab is therefore never needed, and you can always leave with one Tab.
  - Esc clears the hint, not the focus.
  - Completion applies to commands, and to slugs after `projects`/`notes`.
  - Tests: unit tests for `complete()` return `{ changed: false }` for every non-extending case. A Playwright test types `zzz`, `c` (ambiguous: `contact`/`clear`, nothing to extend), and empty input, presses Tab once each, and asserts focus has left the input. It also types `jou`, presses Tab, and asserts the value is `journey` with focus still in the input.
- Clickable alternatives: a row of command chips (help, projects, journey, resume, contact) under the prompt.
- a11y: the transcript is `role="log"` with `aria-live="polite"`, and the input has a visible label "Command".
- Tests (vitest) cover:
  - each command, case-insensitivity, too-long input, and usage errors;
  - unknown commands and suggestions;
  - Tab completion (unique, multiple, none) and history bounds;
  - hostile strings (`; rm -rf /`, `$(id)`, `` `x` ``, `<script>`, `../../etc/passwd`), which come back as plain-text unknown commands;
  - a Playwright check that `<script>` input renders as text.

## 7. Preferences (optional persistence)
- Only `{ v: 1, sound: boolean }` under `localStorage['gw.prefs']`, validated with zod.
- Corrupt JSON, the wrong `v`, or a schema failure → defaults (the bad value is overwritten on the next save). Any storage exception → in-memory only.
- A **Reset preferences** button sits in the launcher footer.
- Window layout is not persisted (add later only if wanted).
- Sound is off by default. When on, short WebAudio oscillator ticks play for open and close (no audio files), and only start after the user's toggle.

## 8. Loading budget
- `/workspace/` is its own route chunk. Atlas links to it with `prefetch={false}`. Arcade and Terminal are `next/dynamic` inside the workspace.
- Verified by recording the `/` network log in Playwright (cold load and after scrolling to the bottom) and asserting that no request URL matches the workspace or ship-it chunk names taken from the build manifest.
- The 2.08 MB `ganesh.webp` (1024×1536) gets resized derivatives (P6 performance).

## 9. No-JS behaviour
- `/workspace/` server-renders the wallpaper and the launcher as plain `<a>` links to the matching Atlas pages, with a note that the interactive desktop needs JavaScript.
- The Atlas portfolio itself stays fully readable without JS.
