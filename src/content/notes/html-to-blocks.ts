/**
 * Converts archived article HTML into typed blocks (see schema.ts) using the browser's own HTML parser.
 * Self-contained, with no imports or outer references, so Playwright can serialize it into `page.evaluate`.
 * Elements outside the allowlist are unwrapped or dropped with their content; no attribute is ever copied
 * except a validated link URL and a code-language name.
 *
 * @param input.html Article body HTML (untrusted).
 * @param input.base Absolute URL the article was published at, used to resolve relative links.
 * @returns Blocks to be validated with `blocksSchema`.
 */
export function htmlToBlocks(input: { html: string; base: string }): unknown[] {
  const DROP = new Set([
    'SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'NOSCRIPT', 'SVG', 'MATH', 'FORM',
    'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'IMG', 'PICTURE', 'VIDEO', 'AUDIO', 'CANVAS', 'LINK', 'META', 'HEAD',
  ]);
  const LIST_TAGS = new Set(['UL', 'OL']);
  const tag = (el: Element) => el.tagName.toUpperCase();
  type Inline = { t: string; value?: string; href?: string; children?: Inline[] };

  const safeHref = (raw: string | null): string | null => {
    if (!raw) return null;
    let url: URL;
    try {
      url = new URL(raw.trim(), input.base);
    } catch {
      return null;
    }
    if (url.protocol === 'http:') url.protocol = 'https:';
    return url.protocol === 'https:' || url.protocol === 'mailto:' ? url.href : null;
  };

  const normalize = (items: Inline[]): Inline[] => {
    const out: Inline[] = [];
    for (const item of items) {
      const last = out[out.length - 1];
      if (item.t === 'text' && last?.t === 'text') last.value = `${last.value}${item.value}`.replace(/\s+/g, ' ');
      else if (item.t !== 'text' || item.value) out.push(item);
    }
    if (out[0]?.t === 'text') out[0].value = out[0].value!.trimStart();
    const end = out[out.length - 1];
    if (end?.t === 'text') end.value = end.value!.trimEnd();
    return out.filter((i) => i.t !== 'text' || i.value);
  };

  const inlines = (node: Node): Inline[] => {
    const out: Inline[] = [];
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        out.push({ t: 'text', value: (child.textContent ?? '').replace(/\s+/g, ' ') });
        return;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) return;
      const el = child as Element;
      if (DROP.has(tag(el)) || LIST_TAGS.has(tag(el))) return;
      if (tag(el) === 'BR') out.push({ t: 'text', value: ' ' });
      else if (tag(el) === 'CODE') out.push({ t: 'code', value: el.textContent ?? '' });
      else if (tag(el) === 'STRONG' || tag(el) === 'B') out.push({ t: 'strong', children: normalize(inlines(el)) });
      else if (tag(el) === 'EM' || tag(el) === 'I') out.push({ t: 'em', children: normalize(inlines(el)) });
      else if (tag(el) === 'A') {
        const href = safeHref(el.getAttribute('href'));
        const children = normalize(inlines(el));
        if (href && children.length) out.push({ t: 'link', href, children });
        else out.push(...children);
      } else out.push(...inlines(el));
    });
    return out.filter((i) => !(i.children && i.children.length === 0));
  };

  const listItems = (list: Element): Inline[][] => {
    const items: Inline[][] = [];
    for (const li of Array.from(list.children)) {
      const own = normalize(inlines(li));
      if (own.length) items.push(own);
      const nestedLists = Array.from(li.querySelectorAll('ul, ol')).filter((l) => l.parentElement?.closest('li') === li);
      for (const nested of nestedLists) items.push(...listItems(nested));
    }
    return items;
  };

  const doc = new DOMParser().parseFromString(input.html, 'text/html');
  const blocks: unknown[] = [];
  const walk = (container: Element) => {
    let loose: Node[] = [];
    const flushLoose = () => {
      // The wrapper must belong to the inert parsed document: nodes adopted into the live page would load images and run handlers.
      const wrapper = doc.createElement('div');
      loose.forEach((n) => wrapper.appendChild(n));
      const content = normalize(inlines(wrapper));
      if (content.length) blocks.push({ type: 'paragraph', inlines: content });
      loose = [];
    };
    for (const child of Array.from(container.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        loose.push(child);
        continue;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) continue;
      const el = child as Element;
      if (DROP.has(tag(el))) continue;
      const heading = /^H([1-6])$/.exec(tag(el));
      const isBlock = heading || ['P', 'PRE', 'BLOCKQUOTE', 'UL', 'OL', 'DIV', 'SECTION', 'ARTICLE', 'FIGURE', 'TABLE', 'HR'].includes(tag(el));
      if (!isBlock) {
        loose.push(el);
        continue;
      }
      flushLoose();
      if (heading) {
        const content = normalize(inlines(el));
        if (content.length) blocks.push({ type: 'heading', level: Math.min(4, Math.max(2, Number(heading[1]))), inlines: content });
      } else if (tag(el) === 'P') {
        const content = normalize(inlines(el));
        if (content.length) blocks.push({ type: 'paragraph', inlines: content });
      } else if (tag(el) === 'PRE') {
        const text = (el.textContent ?? '').replace(/\n+$/, '');
        const match = /(?:^|\s)language-([a-z0-9+#-]{1,20})(?:\s|$)/.exec(el.querySelector('code')?.className ?? '');
        if (text.trim()) blocks.push(match ? { type: 'code', lang: match[1], text } : { type: 'code', text });
      } else if (tag(el) === 'BLOCKQUOTE') {
        const content = normalize(inlines(el));
        if (content.length) blocks.push({ type: 'quote', inlines: content });
      } else if (LIST_TAGS.has(tag(el))) {
        const items = listItems(el);
        if (items.length) blocks.push({ type: 'list', ordered: tag(el) === 'OL', items });
      } else if (tag(el) !== 'HR') {
        walk(el);
      }
    }
    flushLoose();
  };

  walk(doc.body);
  return blocks;
}
