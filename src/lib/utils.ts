import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function readingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/** Extract h2/h3 headings from HTML for a table of contents */
export function extractHeadings(html: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const regex = /<h([23])[^>]*>(.*?)<\/h\2>/gi;
  const idCount: Record<string, number> = {};
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10) as 2 | 3;
    const rawText = match[2].replace(/<[^>]*>/g, '').trim();
    const baseId = slugify(rawText);
    const count = idCount[baseId] ?? 0;
    const id = count === 0 ? baseId : `${baseId}-${count}`;
    idCount[baseId] = count + 1;
    headings.push({ id, text: rawText, level });
  }

  return headings;
}

/** Inject id attributes into h2/h3 tags in HTML so TOC anchors work */
export function addHeadingIds(html: string): string {
  const idCount: Record<string, number> = {};
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (_match, level, attrs, inner) => {
    const rawText = inner.replace(/<[^>]*>/g, '').trim();
    const baseId = slugify(rawText);
    const count = idCount[baseId] ?? 0;
    const id = count === 0 ? baseId : `${baseId}-${count}`;
    idCount[baseId] = count + 1;
    // Remove existing id attr if any, then inject
    const cleanAttrs = attrs.replace(/\s*id="[^"]*"/gi, '');
    return `<h${level}${cleanAttrs} id="${id}">${inner}</h${level}>`;
  });
}
