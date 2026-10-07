import Link from 'next/link';
import type { WorkItem } from '@/content/work';

/**
 * Editorial list of work: numbered rows whose title link covers the whole row.
 *
 * @param props.items Work items in display order; their position becomes the chapter number.
 * @param props.headingLevel Heading level for each title, so the list nests under its section heading.
 */
export function WorkList({ items, headingLevel = 3 }: { items: readonly WorkItem[]; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as const;
  return (
    <ol className="m-0 list-none p-0">
      {items.map((item, i) => (
        <li
          key={item.slug}
          className="motion-colors relative grid grid-cols-[40px_1fr_24px] items-baseline gap-x-3 gap-y-1.5 border-b border-rule py-5 hover:bg-tint md:grid-cols-[72px_1.1fr_1.6fr_200px_32px] md:gap-6 md:py-7"
        >
          <span className="font-mono text-sm text-orange">{String(i + 1).padStart(2, '0')}</span>
          <Heading className="m-0 text-2xl font-bold md:text-[32px] md:leading-tight">
            <Link href={`/work/${item.slug}/`} className="stretched-link focus-visible:outline-none">
              {item.title}
            </Link>
          </Heading>
          <p className="col-start-2 m-0 text-[15px] text-muted md:col-start-auto md:text-base">{item.summary}</p>
          <p className="col-start-2 m-0 font-mono text-xs text-muted md:col-start-auto md:text-[13px]">
            {item.organization}
            <br className="hidden md:block" />
            <span className="md:hidden"> · </span>
            {item.year}
          </p>
          <span aria-hidden="true" className="col-start-3 row-start-1 font-mono text-xl text-cobalt md:col-start-auto md:row-start-auto">
            →
          </span>
        </li>
      ))}
    </ol>
  );
}
