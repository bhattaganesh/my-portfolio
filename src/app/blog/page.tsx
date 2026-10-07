import { MovedNotice, movedMetadata } from '@/components/atlas/moved-notice';

export const metadata = movedMetadata('Articles', null);

export default function BlogNoticePage() {
  return (
    <MovedNotice
      title="Articles are being revised"
      message="The articles from the previous version of this site aren't published right now. My work and contact details are below."
      links={[{ label: 'See my work', href: '/work/' }, { label: 'Contact', href: '/contact/' }]}
    />
  );
}
