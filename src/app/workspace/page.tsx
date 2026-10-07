import type { Metadata } from 'next';
import Link from 'next/link';
import { Wallpaper } from '@/components/workspace/wallpaper';
import { Workspace } from '@/components/workspace/workspace';
import { findResume } from '@/lib/resume';

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'An optional desktop-style way to explore Ganesh Bhatt’s projects, plus a portfolio terminal.',
};

export default function WorkspacePage() {
  return (
    <>
      <Workspace resumeHref={findResume()} wallpaper={<Wallpaper />} />
      <noscript>
        <div className="gw-noscript">
          <p>The interactive workspace needs JavaScript. Everything in it is also on the main portfolio:</p>
          <ul>
            <li><Link href="/work/">Work</Link></li>
            <li><Link href="/journey/">Career journey</Link></li>
            <li><Link href="/contact/">Contact</Link></li>
            <li><Link href="/">Back to the portfolio</Link></li>
          </ul>
        </div>
      </noscript>
    </>
  );
}
