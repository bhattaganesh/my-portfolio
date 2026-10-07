import { Toaster } from 'sonner';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollProgress } from '@/components/shared/scroll-progress';
import { BackToTop } from '@/components/shared/back-to-top';
import { PageBackground } from '@/components/shared/page-background';
import { CustomCursor } from '@/components/shared/custom-cursor';

/**
 * Wraps portfolio pages in the site header, footer and page-level decorations.
 *
 * @param props.children Page content rendered inside the main landmark.
 * @returns The page framed by the shared site chrome.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageBackground />
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <main id="main-content" className="relative z-[1]">{children}</main>
      <Footer />
      <BackToTop />
      <Toaster richColors position="bottom-right" />
    </>
  );
}
