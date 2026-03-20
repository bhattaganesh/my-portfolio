import type { Metadata } from 'next';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { inter, jetbrainsMono, cabinetGrotesk } from '@/lib/fonts';
import { SITE_CONFIG } from '@/lib/constants';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollProgress } from '@/components/shared/scroll-progress';
import { BackToTop } from '@/components/shared/back-to-top';
import './globals.css';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} \u2013 ${SITE_CONFIG.title}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'Full Stack Developer',
    'PHP Developer',
    'WordPress Developer',
    'React Developer',
    'Gutenberg Developer',
    'Software Engineer',
    'Nepal',
    'Kathmandu',
    'Brainstorm Force',
    'WordPress Developer Nepal',
    'Gutenberg Block Developer',
    'Headless WordPress Developer',
    'React Developer Kathmandu',
    'PHP Developer Nepal',
    'Spectra Developer',
    'Full Stack Developer Nepal',
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} \u2013 ${SITE_CONFIG.title}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} \u2013 ${SITE_CONFIG.title}`,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  description: SITE_CONFIG.description,
  author: {
    '@type': 'Person',
    name: SITE_CONFIG.name,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_CONFIG.url}/blog?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  email: SITE_CONFIG.email,
  telephone: SITE_CONFIG.phone,
  jobTitle: SITE_CONFIG.title,
  worksFor: { '@type': 'Organization', name: 'Brainstorm Force' },
  sameAs: [
    SITE_CONFIG.socials.linkedin,
    SITE_CONFIG.socials.github,
    SITE_CONFIG.socials.facebook,
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kathmandu',
    addressCountry: 'NP',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${cabinetGrotesk.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {/* [UX-FIX] Skip link for keyboard/screen reader users — only visible on focus */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary-600 focus:text-white focus:font-semibold focus:shadow-lg"
          >
            Skip to main content
          </a>
          <ScrollProgress />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <BackToTop />
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
