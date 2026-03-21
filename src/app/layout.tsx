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
import { PageBackground } from '@/components/shared/page-background';
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
    'Nepali Developer',
    'Gutenberg Expert',
    'WordPress Expert',
    'React JS Expert',
    'LMS Expert',
    'LMS Developer',
    'Page Builder Expert',
    'Gutenberg Page Builder Expert',
    'AI Developer',
    'WordPress AI Expert',
    'Contact Form Expert',
    'ThemeGrill Developer',
    'Kathmandu Developer',
    'Hire Nepali Developer',
    'Software Engineer Nepal',
    'WordPress Plugin Developer',
    'Ganesh Bhatt',
    'Ganesh Prasad Bhatt',
    'Masteriyo Developer',
    'Everest Forms Developer',
    'WordPress Forms Developer',
    'Page Builder Developer',
    'WordPress Consultant Nepal',
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
  jobTitle: 'Senior Full-Stack Software Developer',
  description:
    'Senior Full-Stack Developer from Nepal specializing in WordPress, Gutenberg, React, PHP, and LMS development. Core engineer on Spectra Blocks at Brainstorm Force.',
  image: `${SITE_CONFIG.url}/images/ganesh.webp`,
  worksFor: {
    '@type': 'Organization',
    name: 'Brainstorm Force',
    url: 'https://developer.brainstormforce.com',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Tribhuvan University',
    address: { '@type': 'PostalAddress', addressCountry: 'NP' },
  },
  nationality: { '@type': 'Country', name: 'Nepal' },
  knowsAbout: [
    'WordPress',
    'Gutenberg',
    'Gutenberg Blocks',
    'Page Builder Development',
    'React',
    'PHP',
    'TypeScript',
    'JavaScript',
    'MySQL',
    'REST API',
    'GraphQL',
    'Next.js',
    'Laravel',
    'LMS Development',
    'AI Agents',
    'WordPress Plugin Development',
    'Contact Form Development',
    'Full-Stack Development',
    'Software Engineering',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Full-Stack Software Developer',
    occupationalCategory: '15-1252.00',
    skills:
      'WordPress, Gutenberg, React, PHP, TypeScript, MySQL, REST API, Next.js, Laravel, LMS, AI',
  },
  sameAs: [
    SITE_CONFIG.socials.linkedin,
    SITE_CONFIG.socials.github,
    SITE_CONFIG.socials.facebook,
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kathmandu',
    addressRegion: 'Bagmati',
    addressCountry: 'NP',
  },
};

const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: `${SITE_CONFIG.name} — Full-Stack Developer`,
  url: SITE_CONFIG.url,
  description:
    'Senior full-stack software developer specializing in WordPress, Gutenberg blocks, React, PHP, LMS development, AI integration, and contact form solutions.',
  telephone: SITE_CONFIG.phone,
  email: SITE_CONFIG.email,
  priceRange: '$$',
  areaServed: [
    { '@type': 'Country', name: 'Nepal' },
    { '@type': 'Place', name: 'Worldwide' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kathmandu',
    addressRegion: 'Bagmati',
    addressCountry: 'NP',
  },
  founder: {
    '@type': 'Person',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
  serviceType: [
    'WordPress Development',
    'Gutenberg Block Development',
    'React Development',
    'PHP Development',
    'LMS Development',
    'AI Integration',
    'Contact Form Development',
    'Full-Stack Web Development',
    'Page Builder Development',
  ],
  knowsAbout: [
    'WordPress Expert',
    'Gutenberg Expert',
    'React JS Expert',
    'PHP Expert',
    'LMS Expert',
    'Page Builder Expert',
    'AI Developer',
    'Contact Form Expert',
    'Nepali Developer',
    'Full Stack Developer',
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
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
          <PageBackground />
          <ScrollProgress />
          <Header />
          <main id="main-content" className="relative z-[1]">{children}</main>
          <Footer />
          <BackToTop />
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
