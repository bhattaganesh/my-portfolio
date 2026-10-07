import { MovedNotice, movedMetadata } from '@/components/atlas/moved-notice';

export const metadata = movedMetadata('Projects', '/work/');

export default function ProjectsMovedPage() {
  return (
    <MovedNotice
      title="Projects have moved"
      message="Projects now live on the Work page."
      to="/work/"
      links={[{ label: 'Go to Work', href: '/work/' }, { label: 'Home', href: '/' }]}
    />
  );
}
