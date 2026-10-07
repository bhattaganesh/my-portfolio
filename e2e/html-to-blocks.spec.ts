import { htmlToBlocks } from '../src/content/notes/html-to-blocks';
import { blocksSchema, type Block, type Inline } from '../src/content/notes/schema';
import { expect, test } from './fixtures';

const BASE = 'https://www.ganeshbhatt.com.np/blog/example/';

/** Runs the converter inside a real Chromium page, then validates the result against the schema in Node. */
async function convert(page: import('@playwright/test').Page, html: string) {
  await page.setContent('<!doctype html><title>converter</title>');
  const raw = await page.evaluate(htmlToBlocks, { html, base: BASE });
  return blocksSchema.parse(raw);
}

test('drops scripts, styles, frames and their text entirely', async ({ page }) => {
  const blocks = await convert(
    page,
    '<p>keep</p><script>alert(1)</script><style>p{}</style><iframe src="https://evil.test">frame</iframe><svg onload="alert(2)"><text>svg</text></svg><noscript>ns</noscript><template><p>tpl</p></template>',
  );
  expect(JSON.stringify(blocks)).not.toMatch(/alert|frame|svg|ns|tpl|p\{\}/);
  expect(blocks).toEqual([{ type: 'paragraph', inlines: [{ t: 'text', value: 'keep' }] }]);
});

test('never copies event handlers or other attributes, and does not trigger them while parsing', async ({ page }) => {
  const blocks = await convert(
    page,
    '<p onclick="alert(1)" style="x" class="y" id="z">hi <span onmouseover="alert(2)"><img src="x" onerror="alert(3)">there</span></p>' +
      'loose <span><img src="nope" onerror="alert(4)"></span> text',
  );
  await page.waitForTimeout(300);
  const json = JSON.stringify(blocks);
  expect(json).not.toMatch(/"on[a-z]+"|onclick|onerror|style|class|"id"/);
  expect(blocks).toEqual([
    { type: 'paragraph', inlines: [{ t: 'text', value: 'hi there' }] },
    { type: 'paragraph', inlines: [{ t: 'text', value: 'loose text' }] },
  ]);
});

test('turns unsafe link schemes into plain text and upgrades or resolves the rest', async ({ page }) => {
  const unsafe = [
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    '&#106;avascript:alert(1)',
    '  \tjavascript:alert(1)',
    'java\tscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
  ];
  for (const href of unsafe) {
    const blocks = await convert(page, `<p><a href="${href}">click</a></p>`);
    expect(blocks, href).toEqual([{ type: 'paragraph', inlines: [{ t: 'text', value: 'click' }] }]);
  }
  const [http] = await convert(page, '<p><a href="http://example.com/a">a</a> <a href="../other/">b</a> <a href="mailto:x@example.com">c</a></p>');
  expect(http).toEqual({
    type: 'paragraph',
    inlines: [
      { t: 'link', href: 'https://example.com/a', children: [{ t: 'text', value: 'a' }] },
      { t: 'text', value: ' ' },
      { t: 'link', href: 'https://www.ganeshbhatt.com.np/blog/other/', children: [{ t: 'text', value: 'b' }] },
      { t: 'text', value: ' ' },
      { t: 'link', href: 'mailto:x@example.com', children: [{ t: 'text', value: 'c' }] },
    ],
  });
});

test('keeps the text of malformed markup in valid blocks', async ({ page }) => {
  const inlineText = (items: Inline[]): string =>
    items.map((i) => ('value' in i ? i.value : inlineText(i.children))).join(' ');
  const words = (blocks: Block[]) =>
    blocks
      .map((b) => ('inlines' in b ? inlineText(b.inlines) : 'items' in b ? b.items.map(inlineText).join(' ') : b.text))
      .join(' ')
      .split(/\s+/)
      .filter(Boolean);
  const blocks = await convert(page, '<p><b>bold<i>both</p><ul><li>a<li>b<ul><li>nested</ul></ul></div><blockquote>q');
  expect(words(blocks)).toEqual(['bold', 'both', 'a', 'b', 'nested', 'q']);
  expect(blocks.map((b) => b.type)).toEqual(['paragraph', 'list', 'quote']);

  const headings = await convert(page, '<h1>Title</h1><h3>Mid</h3><h6>Small</h6>');
  expect(headings).toEqual([
    { type: 'heading', level: 2, inlines: [{ t: 'text', value: 'Title' }] },
    { type: 'heading', level: 3, inlines: [{ t: 'text', value: 'Mid' }] },
    { type: 'heading', level: 4, inlines: [{ t: 'text', value: 'Small' }] },
  ]);
  const deep = await convert(page, `${'<div>'.repeat(200)}<p>deep</p>`);
  expect(deep).toEqual([{ type: 'paragraph', inlines: [{ t: 'text', value: 'deep' }] }]);
});

test('decodes entities and keeps code blocks verbatim with a validated language', async ({ page }) => {
  const blocks = await convert(
    page,
    '<p>It&#8217;s done&hellip; &amp; &lt;b&gt;</p><pre><code class="language-php hljs">&lt;?php echo "x";\n  $a = 1;\n</code></pre><pre><code class="language-&quot;onload">y</code></pre>',
  );
  expect(blocks).toEqual([
    { type: 'paragraph', inlines: [{ t: 'text', value: 'It’s done… & <b>' }] },
    { type: 'code', lang: 'php', text: '<?php echo "x";\n  $a = 1;' },
    { type: 'code', text: 'y' },
  ]);
});
