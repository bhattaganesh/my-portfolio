import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Wallpaper } from '@/components/workspace/wallpaper';
import { Workspace } from '@/components/workspace/workspace';

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'An optional desktop-style way to explore Ganesh Bhatt’s projects, plus a portfolio terminal.',
};

/**
 * Finds a published résumé PDF at build time.
 *
 * @returns The public path of the first PDF in public/resume, or null when none is published.
 * @throws When the folder exists but cannot be read, so a broken build is not mistaken for "no résumé".
 */
function findResume(): string | null {
  const dir = path.join(process.cwd(), 'public', 'resume');
  try {
    const pdf = fs.readdirSync(dir).find((file) => file.toLowerCase().endsWith('.pdf'));
    return pdf ? `/resume/${pdf}` : null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}

export default function WorkspacePage() {
  return (
    <>
      <Workspace resumeHref={findResume()} wallpaper={<Wallpaper />} />
      <noscript>
        <div className="gw-noscript">
          <p>The interactive workspace needs JavaScript. Everything in it is also on the main portfolio:</p>
          <ul>
            <li><Link href="/projects/">Projects</Link></li>
            <li><Link href="/experience/">Career journey</Link></li>
            <li><Link href="/contact/">Contact</Link></li>
            <li><Link href="/">Back to the portfolio</Link></li>
          </ul>
        </div>
      </noscript>
    </>
  );
}
