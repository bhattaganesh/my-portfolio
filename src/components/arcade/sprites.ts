/**
 * Original pixel-art sprites for Summit Run. Each sprite is rows of characters:
 * '#' body colour, 'o' accent, '+' highlight, anything else transparent.
 */
export type Sprite = readonly string[];

export const TREKKER_A: Sprite = [
  '.....oo.....',
  '....####....',
  '...######...',
  '...##.###...',
  '...######...',
  '....####....',
  '.oo#####....',
  '.ooo######..',
  '.ooo#####.#.',
  '.ooo#####...',
  '..oo####....',
  '...####.....',
  '...##.##....',
  '..##...##...',
  '..#.....#...',
];

export const TREKKER_B: Sprite = [
  ...TREKKER_A.slice(0, 12),
  '....###.....',
  '....#.##....',
  '...##..#....',
];

export const TREKKER_DUCK: Sprite = [
  '..........oo....',
  '..ooo....####...',
  '.ooooo..######..',
  '.ooooo###.####..',
  '.oooo#########..',
  '..#############.',
  '...#########....',
  '...##.....##....',
  '..##.......##...',
];

export const TREKKER_HIT: Sprite = TREKKER_A.map((row, y) => (y === 3 ? '...##+###...' : row));

export const BIRD_UP: Sprite = [
  '.....#.........',
  '.....##........',
  '.....###.......',
  '..o..####......',
  '.ooo#######....',
  'ooo##########..',
  '...######......',
  '...............',
  '...............',
];

export const BIRD_DOWN: Sprite = [
  '...............',
  '...............',
  '...............',
  '..o............',
  '.ooo#######....',
  'ooo##########..',
  '....######.....',
  '....###........',
  '....##.........',
];

export const CLOUD: Sprite = [
  '.....######.........',
  '...###....###.......',
  '.###........######..',
  '##...............###',
  '####################',
];

/**
 * A rock sprite: a jagged half-dome sitting on the ground, with a highlight along its top-left edge.
 *
 * @param w Width in sprite pixels.
 * @param h Height in sprite pixels.
 * @param bumps Seed for the jagged outline.
 * @returns The sprite rows.
 */
export function rockSprite(w: number, h: number, bumps: number): Sprite {
  const rows: string[] = [];
  const cx = (w - 1) / 2;
  for (let y = 0; y < h; y++) {
    let row = '';
    for (let x = 0; x < w; x++) {
      const jag = 0.08 * Math.sin(x * 1.7 + bumps) + 0.05 * Math.sin(x * 3.1 + bumps * 2);
      const dx = (x - cx) / (w / 2);
      const dy = (h - y) / h;
      const inside = dx * dx + dy * dy <= 1 + jag;
      const edge = inside && x < cx && y < h * 0.6 && (x === 0 || !(((x - 1 - cx) / (w / 2)) ** 2 + dy * dy <= 1 + jag) || y === 0);
      row += inside ? (edge ? '+' : '#') : '.';
    }
    rows.push(row);
  }
  return rows;
}

/**
 * Draws a sprite with its bottom-left corner at (x, groundY - y).
 *
 * @param ctx Canvas context.
 * @param sprite Sprite rows.
 * @param x Left edge in world pixels.
 * @param bottom Bottom edge in canvas pixels.
 * @param px Size of one sprite pixel in world pixels.
 * @param colours Fill for '#', 'o' and '+'.
 */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  bottom: number,
  px: number,
  colours: { body: string; accent: string; highlight: string },
) {
  const top = bottom - sprite.length * px;
  for (let r = 0; r < sprite.length; r++) {
    const row = sprite[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      if (ch !== '#' && ch !== 'o' && ch !== '+') continue;
      ctx.fillStyle = ch === '#' ? colours.body : ch === 'o' ? colours.accent : colours.highlight;
      ctx.fillRect(Math.round(x + c * px), Math.round(top + r * px), px, px);
    }
  }
}
