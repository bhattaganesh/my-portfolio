import fs from 'node:fs';
import path from 'node:path';

/**
 * Finds a published résumé PDF at build time. Server/build-time only (uses the filesystem).
 *
 * @returns The public path of the first PDF in public/resume, or null when none is published.
 * @throws When the folder exists but cannot be read, so a broken build is not mistaken for "no résumé".
 */
export function findResume(): string | null {
  const dir = path.join(process.cwd(), 'public', 'resume');
  try {
    const pdf = fs.readdirSync(dir).find((file) => file.toLowerCase().endsWith('.pdf'));
    return pdf ? `/resume/${encodeURIComponent(pdf)}` : null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}
