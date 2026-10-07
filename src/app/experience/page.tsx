import { MovedNotice, movedMetadata } from '@/components/atlas/moved-notice';

export const metadata = movedMetadata('Experience', '/journey/');

export default function ExperienceMovedPage() {
  return (
    <MovedNotice
      title="Experience has moved"
      message="My career timeline now lives on the Journey page."
      to="/journey/"
      links={[{ label: 'Go to Journey', href: '/journey/' }, { label: 'Home', href: '/' }]}
    />
  );
}
