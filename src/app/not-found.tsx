import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 \u2013 Page Not Found',
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white dark:bg-surface-950">
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="blob absolute -top-32 -left-32 h-96 w-96 bg-primary-100 opacity-40 dark:bg-primary-950 dark:opacity-20 animate-[var(--animate-float)]" />
        <div className="blob absolute -bottom-32 -right-32 h-80 w-80 bg-primary-200 opacity-30 dark:bg-primary-900 dark:opacity-15 animate-[var(--animate-float)] [animation-delay:2s]" />
      </div>

      <div className="relative z-10 text-center space-y-6 animate-[var(--animate-slide-up)]">
        {/* Large 404 */}
        <p className="font-display text-[8rem] sm:text-[12rem] font-extrabold leading-none text-gradient select-none">
          404
        </p>

        {/* Heading */}
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-50">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="max-w-md mx-auto text-base sm:text-lg text-surface-500 dark:text-surface-400">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        {/* Action */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-primary-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:translate-y-0"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
