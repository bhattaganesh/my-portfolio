import { education, roles } from '@/content/profile';

/**
 * Decorative contour plate with the career route marked on it. Server-only: its computed SVG paths
 * never take part in hydration. The route labels repeat facts that the Journey page lists in full.
 */

const WIDTH = 500;
const HEIGHT = 625;
const RING_COUNT = 10;
const INDEX_EVERY = 4;

function ring(cx: number, cy: number, r: number): string {
  let d = '';
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const k = r * (1 + 0.05 * Math.sin(2 * a + 0.6) + 0.025 * Math.sin(3 * a + 1.02));
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * k * 1.3).toFixed(1)} ${(cy + Math.sin(a) * k).toFixed(1)}`;
  }
  return `${d}Z`;
}

const RINGS = Array.from({ length: RING_COUNT }, (_, i) => ({ d: ring(WIDTH * 0.3, HEIGHT * 0.36, 34 * (i + 1)), index: (i + 1) % INDEX_EVERY === 0 }));

const year = (text: string) => text.match(/\d{4}/)?.[0] ?? text;

const STOPS = [
  ...roles.map((r) => ({ year: year(r.start), label: r.title.includes('intern') ? `${r.organization} · intern` : r.organization })),
  { year: year(education.years), label: education.title },
];

/**
 * Renders the plate.
 *
 * @returns A decorative figure; the route list inside it is hidden from assistive technology.
 */
export function ContourPlate() {
  return (
    <figure className="contour-plate relative m-0 aspect-[4/5] max-h-[620px] w-full border border-rule bg-tint max-md:aspect-[16/11]">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true" focusable="false">
        <g fill="none" stroke="var(--contour)" strokeWidth="1">
          {RINGS.filter((r) => !r.index).map((r) => (
            <path key={r.d.slice(0, 32)} d={r.d} />
          ))}
        </g>
        <g fill="none" stroke="var(--contour-index)" strokeWidth="1.4">
          {RINGS.filter((r) => r.index).map((r) => (
            <path key={r.d.slice(0, 32)} d={r.d} />
          ))}
        </g>
      </svg>
      <ol aria-hidden="true" className="absolute inset-y-[14%] left-[8%] m-0 grid list-none content-between p-0 font-mono text-xs">
        {STOPS.map((s) => (
          <li key={`${s.year}-${s.label}`} className="grid grid-cols-[auto_1fr] items-center gap-x-2.5">
            <span className="row-span-2 size-2.5 rounded-full border-2 border-orange bg-tint" />
            <span className="font-medium">{s.year}</span>
            <span className="text-muted">{s.label}</span>
          </li>
        ))}
      </ol>
      <figcaption className="absolute right-4 bottom-3 font-mono text-[11px] text-muted">
        Career route, {STOPS[STOPS.length - 1].year} → {STOPS[0].year}
      </figcaption>
    </figure>
  );
}
