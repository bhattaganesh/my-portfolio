import { MovedNotice, movedMetadata } from '@/components/atlas/moved-notice';
import { loadNotes } from '@/content/notes';

export const dynamicParams = false;
export const metadata = movedMetadata('Article', null);

/** Every archived article keeps a working URL, whether or not it is published again. */
export function generateStaticParams() {
  return loadNotes().map((note) => ({ slug: note.slug }));
}

export default function ArticleNoticePage() {
  return (
    <MovedNotice
      title="This article is being revised"
      message="Articles from the previous version of this site aren't published right now. My work and contact details are below."
      links={[{ label: 'See my work', href: '/work/' }, { label: 'Contact', href: '/contact/' }]}
    />
  );
}
