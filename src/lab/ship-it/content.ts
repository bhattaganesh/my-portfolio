/**
 * Ship It scenarios. Every situation and number here is invented for the game ("Simulation · made-up
 * numbers") and describes no real product, client or incident.
 */

export type Outcome = 'viable' | 'partial' | 'none' | 'worsened';

/** Facts a result asserts about a fix; tests check the debrief only claims what these mark true. */
export interface Claims {
  /** The fix removes the actual cause rather than hiding it. */
  fixesCause: boolean;
  /** Payments only: an acknowledged event is never lost and failed attempts are retried. */
  reliableProcessing?: boolean;
  /** Payments only: how many duplicate enrolments remain in the simulated sale (0 = none). */
  duplicateEffects?: number;
  /** Payments only: repeats are detected by a unique key recorded with the side effects. */
  idempotentBoundary?: boolean;
  /** The fix can show one person's data to another. */
  leaksData?: boolean;
}

export interface Option {
  id: string;
  /** Plain-language choice, no jargon. */
  label: string;
  /** One sentence on what the choice does, still plain language. */
  detail: string;
  /** The engineering name, shown only when the player asks for it. */
  technical: string;
}

export interface Result {
  outcome: Outcome;
  headline: string;
  /** Plain-language consequence and why it happened. */
  explanation: string;
  /** The metric after the change, in the same made-up units as the pass's `metric.before`. */
  after: string;
  claims: Claims;
}

export interface Pass {
  /** What is true in this pass; the twist changes exactly one of these assumptions. */
  situation: string;
  metric: { label: string; before: string };
  options: readonly Option[];
  results: Readonly<Record<string, Result>>;
}

export interface Round {
  id: 'catalogue' | 'payments' | 'editor';
  title: string;
  story: string;
  base: Pass;
  twist: Pass & { change: string };
  /** A tempting fix that is not offered, and why it would not help. */
  whyNot?: { question: string; answer: string };
  lesson: string;
}

const catalogueOptions = {
  servers: { id: 'servers', label: 'Add more web servers', detail: 'Run the website on four machines instead of one.', technical: 'Horizontal scaling of the application tier' },
  query: {
    id: 'query',
    label: 'Fix the slow database lookup',
    detail: 'Change how the page asks the database for course data so it reads only what it needs.',
    technical: 'Add a composite index and remove the N+1 query per course',
  },
  cache: {
    id: 'cache',
    label: 'Keep a ready-made copy of the page for five minutes',
    detail: 'Build the page once and hand the same copy to everyone for a short while.',
    technical: 'Full-page cache with a 5-minute TTL',
  },
  spinner: {
    id: 'spinner',
    label: 'Show a loading animation sooner',
    detail: 'Display the page outline straight away while the course list loads.',
    technical: 'Skeleton UI / perceived-performance improvement',
  },
} as const;

const paymentOptions = {
  retries: {
    id: 'retries',
    label: 'Add more servers and retry anything that fails',
    detail: 'Throw more machines at the spike and automatically re-run any payment that errors.',
    technical: 'Scale out workers with blind retries',
  },
  queue: {
    id: 'queue',
    label: 'Put payments in a waiting line and work through them',
    detail: 'Accept and acknowledge each confirmation instantly, store it, and process the line at a steady pace.',
    technical: 'Durable message queue (at-least-once delivery)',
  },
  remember: {
    id: 'remember',
    label: 'Remember every payment already handled, and ignore repeats',
    detail: 'Record each payment’s unique number in the same step as the enrolment, with a rule that the same number can never be recorded twice.',
    technical: 'Idempotent processing: a unique constraint on the provider event ID, inserted in the same transaction as the enrolment and ledger rows',
  },
  both: {
    id: 'both',
    label: 'Do both: a waiting line, and remember handled payments',
    detail: 'Store every confirmation in a line, and have the worker record each payment number under the same never-twice rule.',
    technical: 'Durable queue with an idempotent consumer (unique constraint on the event ID)',
  },
} as const;

const editorOptions = {
  wait: {
    id: 'wait',
    label: 'Only update the page after the writer pauses',
    detail: 'Hold back changes until nobody has typed for half a second, then update everything at once.',
    technical: 'Debounce state updates (500 ms)',
  },
  redraw: {
    id: 'redraw',
    label: 'Only redraw the block being edited',
    detail: 'Teach the editor to skip blocks whose content did not change.',
    technical: 'Memoised block components with stable props and selectors',
  },
  local: {
    id: 'local',
    label: 'Keep typing inside the block, and share it when done',
    detail: 'The block keeps its own text while you type and tells the rest of the page when you move on.',
    technical: 'Move state down: local component state, committed on blur',
  },
  server: {
    id: 'server',
    label: 'Upgrade the server',
    detail: 'Move the site to a machine with twice the processing power.',
    technical: 'Vertical scaling of the backend',
  },
} as const;

export const ROUNDS: readonly Round[] = [
  {
    id: 'catalogue',
    title: 'The slow catalogue',
    story:
      'Every Monday morning hundreds of students open the course catalogue at once, and it takes six seconds to appear. The web servers are mostly idle; the database is working flat out.',
    base: {
      situation: 'The catalogue looks the same for everyone and changes a few times a day.',
      metric: { label: 'Catalogue load time', before: '6.2 s' },
      options: [catalogueOptions.servers, catalogueOptions.query, catalogueOptions.cache, catalogueOptions.spinner],
      results: {
        servers: {
          outcome: 'none',
          headline: 'Four servers, same six seconds',
          explanation: 'The servers were never the bottleneck. They all wait on the same overloaded database, so adding more of them changes nothing.',
          after: '6.1 s',
          claims: { fixesCause: false },
        },
        query: {
          outcome: 'viable',
          headline: 'Fast, and fixed at the source',
          explanation: 'The page was asking the database one question per course and scanning every enrolment each time. Asking once, with the right index, removes the work itself.',
          after: '0.4 s',
          claims: { fixesCause: true },
        },
        cache: {
          outcome: 'viable',
          headline: 'Fast for almost everyone',
          explanation: 'Because the catalogue is the same for everyone, one copy can serve hundreds of visitors. A new course can take up to five minutes to appear, which is fine here.',
          after: '0.1 s (cached)',
          claims: { fixesCause: false },
        },
        spinner: {
          outcome: 'partial',
          headline: 'Feels quicker, is not quicker',
          explanation: 'Students see the outline sooner, which helps, but the courses still take six seconds and the database is still overloaded.',
          after: '6.2 s (outline at 0.3 s)',
          claims: { fixesCause: false },
        },
      },
    },
    twist: {
      change: 'Now the catalogue also shows each student’s own progress on every course.',
      situation: 'Part of every catalogue page is personal to the student viewing it.',
      metric: { label: 'Catalogue load time', before: '6.8 s' },
      options: [
        catalogueOptions.servers,
        catalogueOptions.query,
        catalogueOptions.cache,
        catalogueOptions.spinner,
        {
          id: 'split',
          label: 'Keep a copy of the shared part, and load each student’s progress separately',
          detail: 'Cache the course list everyone sees, then fill in the student’s own progress with one indexed lookup.',
          technical: 'Fragment caching plus a per-user request served by an indexed query',
        },
      ],
      results: {
        servers: {
          outcome: 'none',
          headline: 'Still waiting on the database',
          explanation: 'Personal progress makes the database work even harder. More web servers only add more waiting.',
          after: '6.7 s',
          claims: { fixesCause: false },
        },
        query: {
          outcome: 'viable',
          headline: 'Still the right fix',
          explanation: 'Fixing the lookup makes both the shared list and the personal progress fast, because the wasted work is gone.',
          after: '0.6 s',
          claims: { fixesCause: true },
        },
        cache: {
          outcome: 'worsened',
          headline: 'Students see someone else’s progress',
          explanation: 'One ready-made copy is now handed to everybody, including the first student’s personal progress. It is fast and it leaks private data.',
          after: '0.1 s, with the wrong student’s data',
          claims: { fixesCause: false, leaksData: true },
        },
        spinner: {
          outcome: 'partial',
          headline: 'A nicer wait',
          explanation: 'The outline appears quickly, but the page is still slow underneath.',
          after: '6.8 s (outline at 0.3 s)',
          claims: { fixesCause: false },
        },
        split: {
          outcome: 'viable',
          headline: 'Shared parts cached, personal parts fresh',
          explanation: 'Everyone shares the expensive course list; each student’s progress is one indexed lookup, so it is quick and never shown to anyone else.',
          after: '0.5 s',
          claims: { fixesCause: false, leaksData: false },
        },
      },
    },
    lesson: 'Find the real bottleneck before adding capacity, and only share a cached copy of something that is genuinely the same for everyone.',
  },
  {
    id: 'payments',
    title: 'The double enrolment',
    story:
      'During a big sale, payment confirmations arrive faster than the site can handle them. The payment provider resends any confirmation the site has not acknowledged within ten seconds, and some students end up enrolled twice, with two rows in the accounts.',
    base: {
      situation: 'The provider keeps resending an unacknowledged confirmation for three days.',
      metric: { label: 'Duplicate enrolments during the sale', before: '212' },
      options: [paymentOptions.retries, paymentOptions.queue, paymentOptions.remember, paymentOptions.both],
      results: {
        retries: {
          outcome: 'worsened',
          headline: 'More duplicates, faster',
          explanation: 'Every retry is another chance to enrol the same student again. More servers just run the repeats in parallel.',
          after: '540',
          claims: { fixesCause: false, reliableProcessing: false, duplicateEffects: 540, idempotentBoundary: false },
        },
        queue: {
          outcome: 'partial',
          headline: 'Nothing lost, but still doubled',
          explanation:
            'Acknowledging at once stops most resends, and nothing is lost. But a line delivers each item at least once: when a worker times out or crashes part-way through a payment, the item goes back in the line and is processed again.',
          after: '31',
          claims: { fixesCause: false, reliableProcessing: true, duplicateEffects: 31, idempotentBoundary: false },
        },
        remember: {
          outcome: 'viable',
          headline: 'Every repeat becomes harmless',
          explanation:
            'The payment’s unique number is recorded in the same step as the enrolment, and the database refuses to record it twice, so even two copies arriving at the same moment produce one enrolment. Payments that time out are simply resent by the provider later, and it keeps trying for days.',
          after: '0',
          claims: { fixesCause: true, reliableProcessing: true, duplicateEffects: 0, idempotentBoundary: true },
        },
        both: {
          outcome: 'viable',
          headline: 'Steady and duplicate-free',
          explanation: 'The line absorbs the spike and the worker skips anything already handled. It works, with one more moving part to run.',
          after: '0',
          claims: { fixesCause: true, reliableProcessing: true, duplicateEffects: 0, idempotentBoundary: true },
        },
      },
    },
    twist: {
      change: 'Now the provider gives up after one hour instead of three days, and the spike lasts two hours.',
      situation: 'Confirmations the site misses for more than an hour are never resent.',
      metric: { label: 'Duplicate enrolments during the sale', before: '212' },
      options: [
        paymentOptions.retries,
        paymentOptions.queue,
        paymentOptions.remember,
        paymentOptions.both,
        {
          id: 'reconcile',
          label: 'Remember handled payments, and check every hour for any the provider gave up on',
          detail: 'Skip repeats as before, and once an hour ask the provider for its list of payments and handle any still missing.',
          technical: 'Idempotent processing plus scheduled reconciliation against the provider’s events API',
        },
      ],
      results: {
        retries: {
          outcome: 'worsened',
          headline: 'Duplicates and lost payments',
          explanation: 'Blind retries still double-enrol students, and anything stuck past an hour is never resent.',
          after: '540, plus 37 paid students never enrolled',
          claims: { fixesCause: false, reliableProcessing: false, duplicateEffects: 540, idempotentBoundary: false },
        },
        queue: {
          outcome: 'partial',
          headline: 'Nothing lost, still doubled',
          explanation: 'The line keeps every confirmation it accepted, but an item retried after a worker timeout or crash is still processed twice.',
          after: '31',
          claims: { fixesCause: false, reliableProcessing: true, duplicateEffects: 31, idempotentBoundary: false },
        },
        remember: {
          outcome: 'partial',
          headline: 'No duplicates, but some students are missing',
          explanation: 'Repeats are harmless, but confirmations that timed out during the two-hour spike are never resent, so some paid students are never enrolled.',
          after: '0 duplicates, 37 paid students never enrolled',
          claims: { fixesCause: false, reliableProcessing: false, duplicateEffects: 0, idempotentBoundary: true },
        },
        both: {
          outcome: 'viable',
          headline: 'The line holds what the provider will not resend',
          explanation: 'Every confirmation is stored the moment it arrives, so nothing depends on the provider trying again, and repeats are skipped.',
          after: '0',
          claims: { fixesCause: true, reliableProcessing: true, duplicateEffects: 0, idempotentBoundary: true },
        },
        reconcile: {
          outcome: 'viable',
          headline: 'Missed payments are found within the hour',
          explanation: 'Repeats are skipped, and the hourly check finds the payments the provider gave up on, keyed by the same unique number. A few students wait up to an hour.',
          after: '0',
          claims: { fixesCause: true, reliableProcessing: true, duplicateEffects: 0, idempotentBoundary: true },
        },
      },
    },
    whyNot: {
      question: 'Why not just stop students double-clicking “Pay”?',
      answer: 'The repeats are not coming from students. The provider resends confirmations from its own servers, which a button in the browser cannot see or stop.',
    },
    lesson: 'A waiting line makes sure nothing is lost; remembering what you already handled is what stops duplicates. Reliable payments usually need both ideas.',
  },
  {
    id: 'editor',
    title: 'The frozen editor',
    story:
      'Writers say the page editor freezes while they type on long pages. With 300 blocks on a page, every keystroke makes the browser redraw all 300.',
    base: {
      situation: 'One writer edits a page at a time.',
      metric: { label: 'Delay after each keystroke', before: '180 ms' },
      options: [editorOptions.wait, editorOptions.redraw, editorOptions.local, editorOptions.server],
      results: {
        wait: {
          outcome: 'partial',
          headline: 'Smooth typing, jumpy pauses',
          explanation: 'Typing feels fine, but every pause still redraws all 300 blocks at once, so the page stutters whenever the writer stops.',
          after: '12 ms while typing, 190 ms on each pause',
          claims: { fixesCause: false },
        },
        redraw: {
          outcome: 'viable',
          headline: 'Only one block does any work',
          explanation: 'Unchanged blocks are skipped, so a keystroke costs one block instead of 300.',
          after: '9 ms',
          claims: { fixesCause: true },
        },
        local: {
          outcome: 'viable',
          headline: 'Typing never leaves the block',
          explanation: 'Keystrokes stay inside the block being edited; the page hears about it once, when the writer moves on.',
          after: '6 ms',
          claims: { fixesCause: true },
        },
        server: {
          outcome: 'none',
          headline: 'The server was not involved',
          explanation: 'The redraw happens in the writer’s browser. A faster server cannot make someone else’s laptop draw less.',
          after: '180 ms',
          claims: { fixesCause: false },
        },
      },
    },
    twist: {
      change: 'Now several writers edit the same page together, and everyone’s changes stream in live.',
      situation: 'Changes from other writers arrive many times a second.',
      metric: { label: 'Delay after each keystroke', before: '320 ms' },
      options: [
        editorOptions.wait,
        editorOptions.redraw,
        editorOptions.local,
        editorOptions.server,
        {
          id: 'batch',
          label: 'Only redraw changed blocks, and apply incoming changes together once per screen refresh',
          detail: 'Skip unchanged blocks, and collect changes from other writers so the page updates at most once per refresh.',
          technical: 'Memoised blocks plus remote updates batched per animation frame (requestAnimationFrame)',
        },
      ],
      results: {
        wait: {
          outcome: 'partial',
          headline: 'Your typing is smooth, theirs is not',
          explanation: 'Holding back your own updates does nothing about the stream of changes from everyone else.',
          after: '210 ms',
          claims: { fixesCause: false },
        },
        redraw: {
          outcome: 'viable',
          headline: 'Each change costs one block',
          explanation: 'Whoever made the change, only the blocks that actually changed are redrawn.',
          after: '14 ms',
          claims: { fixesCause: true },
        },
        local: {
          outcome: 'partial',
          headline: 'Fast, but edits can collide',
          explanation: 'Your block is quick, but while you type in it someone else’s change to the same block can be overwritten when yours is shared.',
          after: '8 ms, with lost edits',
          claims: { fixesCause: false },
        },
        server: {
          outcome: 'none',
          headline: 'Still drawn in the browser',
          explanation: 'More server power delivers the changes no faster to a browser that is busy redrawing.',
          after: '320 ms',
          claims: { fixesCause: false },
        },
        batch: {
          outcome: 'viable',
          headline: 'Small redraws, at most one per refresh',
          explanation: 'Each update only touches the blocks that changed, and a burst of incoming changes becomes one update per screen refresh, so typing stays responsive however busy the page is.',
          after: '11 ms',
          claims: { fixesCause: true },
        },
      },
    },
    lesson: 'Make the expensive thing happen less often or to less of the page; delaying it only moves the pause, and server power cannot fix work done in the browser.',
  },
];
