/**
 * Original "Himalayan dawn" wallpaper: layered ridgelines under a dawn sky with faint survey contours.
 * Rendered on the server only, so its computed paths never take part in hydration.
 */

const WIDTH = 1600;
const HEIGHT = 1000;
const STEP = 16;

type Wave = readonly [amplitude: number, frequency: number, phase: number];

function ridge(base: number, waves: readonly Wave[]): string {
  let d = `M0 ${HEIGHT} L0 ${base}`;
  for (let x = 0; x <= WIDTH; x += STEP) {
    const lift = waves.reduce((sum, [a, f, p]) => sum + a * Math.abs(Math.sin(x * f + p)), 0);
    d += ` L${x} ${(base - lift).toFixed(1)}`;
  }
  return `${d} L${WIDTH} ${HEIGHT} Z`;
}

function contour(cx: number, cy: number, rx: number, ry: number): string {
  let d = '';
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const wobble = 1 + 0.04 * Math.sin(3 * a + 0.8) + 0.025 * Math.sin(5 * a + 1.9);
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rx * wobble).toFixed(1)} ${(cy + Math.sin(a) * ry * wobble).toFixed(1)}`;
  }
  return `${d}Z`;
}

const RIDGES = [
  { d: ridge(560, [[150, 0.0042, 0.3], [70, 0.011, 1.2], [26, 0.031, 0.5]]), fill: 'url(#gw-far)' },
  { d: ridge(690, [[90, 0.0031, 1.7], [44, 0.0093, 0.2], [14, 0.027, 2.2]]), fill: '#3E3470' },
  { d: ridge(800, [[70, 0.0024, 0.9], [30, 0.0071, 2.4], [10, 0.022, 0.4]]), fill: '#262150' },
  { d: ridge(905, [[54, 0.0019, 2.1], [22, 0.0063, 0.7]]), fill: '#171433' },
];

const CONTOURS = Array.from({ length: 7 }, (_, i) => contour(1180, 1010, 140 + i * 70, 60 + i * 30));

/**
 * Renders the decorative workspace background.
 *
 * @returns An aria-hidden SVG that fills its container.
 */
export function Wallpaper() {
  return (
    <svg className="gw-wallpaper" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#10163A" />
          <stop offset="0.45" stopColor="#3A2E6E" />
          <stop offset="0.72" stopColor="#B65C7A" />
          <stop offset="0.9" stopColor="#F0A06A" />
        </linearGradient>
        <linearGradient id="gw-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9DDF2" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#9C86C4" />
          <stop offset="1" stopColor="#5D4C93" />
        </linearGradient>
        <radialGradient id="gw-sun" cx="0.66" cy="0.62" r="0.35">
          <stop offset="0" stopColor="#FFD3A1" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFD3A1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="url(#gw-sky)" />
      <rect width={WIDTH} height={HEIGHT} fill="url(#gw-sun)" />
      {RIDGES.map((r) => (
        <path key={r.d.slice(0, 24)} d={r.d} fill={r.fill} />
      ))}
      <g fill="none" stroke="#FFFFFF" strokeOpacity="0.07" strokeWidth="1.2">
        {CONTOURS.map((d, i) => (
          <path key={i} d={d} strokeOpacity={i % 4 === 3 ? 0.14 : undefined} />
        ))}
      </g>
    </svg>
  );
}
