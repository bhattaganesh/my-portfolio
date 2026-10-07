import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  description: "The page you're looking for doesn't exist.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto grid max-w-[720px] gap-5 px-5 py-24 md:px-10">
      <p className="eyebrow">404</p>
      <h1 className="m-0 text-4xl font-extrabold md:text-6xl">This page doesn&apos;t exist</h1>
      <p className="m-0 text-lg text-muted">It may have moved when the site was rebuilt. These are good places to start:</p>
      <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
        <li>
          <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-cobalt px-5 font-semibold text-on-cobalt">
            Home
          </Link>
        </li>
        <li>
          <Link href="/work/" className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-ink px-5 font-semibold">
            Work
          </Link>
        </li>
        <li>
          <Link href="/contact/" className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-ink px-5 font-semibold">
            Contact
          </Link>
        </li>
      </ul>
  </section>
);
}
