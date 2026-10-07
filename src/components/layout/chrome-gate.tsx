'use client';

import { usePathname } from 'next/navigation';

/** Routes that draw their own full-screen shell instead of the site header and footer. */
const CHROMELESS_PREFIXES = ['/workspace'];

interface ChromeGateProps {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Adds the site header, main landmark and footer around portfolio pages, and leaves them out on
 * full-screen routes. Gating by path keeps every route directly under app/ and gives the root not-found page
 * the same chrome without wrapping it a second time.
 */
export function ChromeGate({ header, footer, children }: ChromeGateProps) {
  const pathname = usePathname() ?? '/';
  if (CHROMELESS_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return <>{children}</>;
  return (
    <>
      {header}
      <main id="main-content">{children}</main>
      {footer}
    </>
  );
}
