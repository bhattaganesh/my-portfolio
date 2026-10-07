import { SiteFooter } from '@/components/atlas/site-footer';
import { SiteHeader } from '@/components/atlas/site-header';
import { ChromeGate } from './chrome-gate';

/**
 * Wraps every route in the site header and footer, except full-screen routes such as the workspace.
 *
 * @param props.children Route content.
 * @returns The content framed by the shared site chrome.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <ChromeGate header={<SiteHeader />} footer={<SiteFooter />}>
      {children}
    </ChromeGate>
  );
}
