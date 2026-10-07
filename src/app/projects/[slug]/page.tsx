import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MovedNotice, movedMetadata } from '@/components/atlas/moved-notice';
import { LEGACY_PROJECT_SLUGS, findWork } from '@/content/work';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LEGACY_PROJECT_SLUGS).map((slug) => ({ slug }));
}

function target(slug: string) {
  const item = findWork(LEGACY_PROJECT_SLUGS[slug] ?? '');
  if (!item) notFound();
  return item;
}

export async function generateMetadata(props: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const item = target((await props.params).slug);
  return movedMetadata(item.title, `/work/${item.slug}/`);
}

export default async function ProjectMovedPage(props: PageProps<'/projects/[slug]'>) {
  const item = target((await props.params).slug);
  const to = `/work/${item.slug}/`;
  return <MovedNotice title={`${item.title} has moved`} message="This project now lives under Work." to={to} links={[{ label: `Go to ${item.title}`, href: to }, { label: 'All work', href: '/work/' }]} />;
}
