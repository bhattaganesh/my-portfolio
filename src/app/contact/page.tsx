import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { ContactForm } from '@/components/contact/contact-form';
import { SocialLinks } from '@/components/shared/social-links';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { Mail, MapPin, Clock, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title:
    'Contact Ganesh Prasad Bhatt — Hire a WordPress Developer, Gutenberg Expert & React Developer',
  description:
    'Get in touch with Ganesh Prasad Bhatt for WordPress development, Gutenberg expertise, React projects, LMS consulting, or full-stack engineering. Nepali developer based in Kathmandu, Nepal. Open to remote work worldwide.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
};

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
    description: 'Best way to reach me',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: SITE_CONFIG.location,
    description: 'Open to remote worldwide',
  },
  {
    icon: Clock,
    label: 'Response time',
    value: 'Within 24 hours',
    description: 'Usually same day',
  },
];

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      {/* ── Hero ── */}
      <section className="pb-12">
        <Container>
          <Breadcrumbs items={[{ label: 'Contact' }]} className="mb-6" />
        </Container>
        <Container className="max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Available for work
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-surface-900 dark:text-surface-50 leading-tight mb-4">
            Let&apos;s Build{' '}
            <span className="text-gradient">Something Great</span>
          </h1>
          <p className="text-lg text-surface-600 dark:text-surface-400 max-w-xl mx-auto"> {/* [UX-FIX] surface-500 on white = 4.48:1, borderline fail for normal text */}
            Whether you have a project in mind, a role to discuss, or just want to say hello —
            I&apos;d love to hear from you.
          </p>
        </Container>
      </section>

      {/* ── Main content ── */}
      <div className="pb-8">
        <Container>
          <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">

            {/* ── Left: info panel ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Contact cards */}
              <div className="space-y-3">
                {contactInfo.map(({ icon: Icon, label, value, href, description }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-surface-500 dark:text-surface-500 mb-0.5"> {/* [UX-FIX] surface-400 on white = 2.37:1 — critical WCAG AA fail at small size */}
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="font-semibold text-surface-900 dark:text-surface-50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm truncate block"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="font-semibold text-surface-900 dark:text-surface-50 text-sm">{value}</p>
                      )}
                      <p className="text-xs text-surface-500 dark:text-surface-500 mt-0.5">{description}</p> {/* [UX-FIX] surface-400 on white fails WCAG AA */}
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-surface-200 dark:border-surface-800" />

              {/* Social links */}
              <div>
                <p className="text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-widest mb-4"> {/* [UX-FIX] bumped from 500→600 for WCAG AA at small uppercase text */}
                  Find me online
                </p>
                <SocialLinks showLabels size={18} />
              </div>

              {/* Availability callout */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                  <p className="text-sm font-bold text-green-800 dark:text-green-300">Available for work</p>
                </div>
                <p className="text-xs text-green-700 dark:text-green-400 leading-relaxed">
                  Open to senior full-stack roles, WordPress architecture consulting, and interesting freelance projects.
                </p>
              </div>
            </div>

            {/* ── Right: form ── */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8 shadow-xl shadow-surface-900/5 dark:shadow-black/20">
                <h2 className="text-xl font-bold font-display text-surface-900 dark:text-surface-50 mb-1">
                  Send a message
                </h2>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
                  Tell me about your project, timeline, and how I can help.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
