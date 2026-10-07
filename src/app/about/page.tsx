import { MovedNotice, movedMetadata } from '@/components/atlas/moved-notice';

export const metadata = movedMetadata('About', '/journey/');

export default function AboutMovedPage() {
  return (
    <MovedNotice
      title="About has moved"
      message="My background now lives on the Journey page."
      to="/journey/"
      links={[{ label: 'Go to Journey', href: '/journey/' }, { label: 'Home', href: '/' }]}
    />
  );
}
