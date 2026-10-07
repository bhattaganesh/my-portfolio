'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Shown when a portfolio page fails to render in the browser; logs the error and offers a retry.
 */
export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Page failed to render', error);
  }, [error]);

  return (
    <section className="mx-auto grid max-w-[720px] gap-5 px-5 py-24 md:px-10" role="alert">
      <h1 className="m-0 text-4xl font-extrabold">This page didn&apos;t load properly</h1>
      <p className="m-0 text-lg text-muted">Try again, or go back to the home page.</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="inline-flex min-h-12 items-center rounded-full bg-cobalt px-5 font-semibold text-on-cobalt">
          Try again
        </button>
        <Link href="/" className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-ink px-5 font-semibold">
          Home
        </Link>
      </div>
    </section>
  );
}
