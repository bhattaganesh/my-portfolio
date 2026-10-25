import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { SkillsGrid } from '@/components/sections/skills-grid';
import { CtaSection } from '@/components/sections/cta-section';
import { Download, MapPin, Mail } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { services } from '@/data/services';
import * as LucideIcons from 'lucide-react';

export const metadata: Metadata = {
  title:
    'About Ganesh Prasad Bhatt — Senior WordPress Developer, Gutenberg Expert & React Developer from Nepal',
  description:
    'Learn about Ganesh Prasad Bhatt — senior full-stack software developer from Kathmandu, Nepal. 4+ years building WordPress plugins, Gutenberg blocks, React apps, and LMS platforms at Brainstorm Force and ThemeGrill. PHP developer, page builder expert, AI developer.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
};

const stats = [
  { value: '4+', label: 'Years Experience' },
  { value: '6+', label: 'WordPress Plugins' },
  { value: '2', label: 'Product Companies' },
  { value: '380+', label: 'Merged PRs at ThemeGrill' },
] as const;

export default function AboutPage() {
  return (
    <div className="relative">
      {/* ── Page Hero ───────────────────────────────────────────── */}
      <section className="pt-24 pb-16">
        <Container>
          <Breadcrumbs items={[{ label: 'About' }]} className="mb-6" />
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: text */}
            <ScrollReveal direction="up" delay={0}>
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                  <MapPin className="w-4 h-4" />
                  <span>{SITE_CONFIG.location}</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold font-display text-surface-900 dark:text-surface-50 leading-tight">
                  About Me
                </h1>
                <p className="text-xl text-surface-500 dark:text-surface-400 leading-relaxed">
                  Senior Full-Stack Developer building production-grade software for
                  the WordPress ecosystem and beyond.
                </p>
                <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
                  I&apos;m a Senior Developer at ThemeGrill, where I work across the
                  company&apos;s WordPress plugins. I work across PHP, React, TypeScript,
                  REST APIs and MySQL.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={SITE_CONFIG.resumeUrl}
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </a>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    <Mail className="w-4 h-4" />
                    Get in Touch
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: photo */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                  {/* Decorative glow behind photo */}
                  <div
                    className="absolute -inset-6 rounded-3xl opacity-25 dark:opacity-35"
                    aria-hidden="true"
                    style={{
                      background: 'linear-gradient(135deg, #4c6ef5, #748ffc, #3b5bdb)',
                      filter: 'blur(30px)',
                    }}
                  />
                  {/* Decorative ring */}
                  <div className="absolute inset-0 rounded-2xl ring-4 ring-primary-200 dark:ring-primary-900 ring-offset-4 ring-offset-white dark:ring-offset-surface-950" />
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-surface-900/20 dark:shadow-black/40">
                    <Image
                      src="/images/ganesh.webp"
                      alt="Ganesh Prasad Bhatt"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ── Extended Bio ────────────────────────────────────────── */}
      <section className="py-16 bg-surface-50/80 dark:bg-surface-900/80 backdrop-blur-sm">
        <Container className="max-w-3xl">
          <ScrollReveal direction="up" delay={0}>
            <SectionHeading
              title="My Story"
              subtitle="How I got here and what drives me"
              className="mb-10"
            />
            <div className="space-y-5 text-surface-700 dark:text-surface-300 leading-relaxed text-[1.0625rem] max-w-prose"> {/* [UX-FIX] surface-600 on surface-50 = borderline contrast; 700 = 8:1. max-w-prose caps line length at ~65ch */}
              <p>
                {`I'm Ganesh Prasad Bhatt, a senior full-stack developer in Kathmandu,
                Nepal, with nearly five years of building WordPress plugins that real
                businesses depend on. Today I'm a Senior Developer at ThemeGrill, working
                across its product line on new features, stability, performance and
                security, from paid memberships and online courses to block-editor plugins.`}
              </p>
              <p>
                {`I started at ThemeGrill in December 2021 as an intern with no WordPress
                background and grew into a Senior PHP Developer, building forms,
                memberships, analytics and learning-management features, and eventually
                leading backend development on Masteriyo LMS. In 2025 I joined Brainstorm
                Force as a core developer on the ground-up rebuild of Spectra, where I worked
                on its core architecture and built many of its major blocks and extensions.
                Along the way I learned to treat code as something other people will
                maintain, scale and build on long after it ships.`}
              </p>
              <p>
                {`I care about what happens after a feature ships: whether it solves the
                problem it was built for, whether the next developer can maintain it, and
                whether it keeps working as the product grows. That is why I put as much
                weight on code review, tests and clear pull requests as on the feature itself.`}
              </p>
              <p>
                {`I learn by building, and I go deep rather than wide. I work with AI coding
                agents such as Claude Code, Codex, Cursor and Google Antigravity every day
                to move faster, while every change still goes through review and tests. My
                motto is that knowledge integration is the best way to grow: each thing I
                learn makes the rest of my stack more useful.`}
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Stats Row ───────────────────────────────────────────── */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} direction="up" delay={i * 0.08}>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
                  <span className="text-4xl font-bold font-display text-primary-600 dark:text-primary-400 mb-1">
                    {stat.value}
                  </span>
                  <span className="text-sm text-surface-600 dark:text-surface-400 font-medium"> {/* [UX-FIX] surface-500 on surface-50 = 4.48:1, borderline fail; 600 = safe */}
                    {stat.label}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Services ────────────────────────────────────────────── */}
      <section className="py-16 bg-surface-50/80 dark:bg-surface-900/80 backdrop-blur-sm">
        <Container>
          <ScrollReveal direction="up" delay={0}>
            <SectionHeading
              title="What I Do"
              subtitle="Areas where I create the most value"
              className="mb-12"
            />
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-6">
            {services.map((service, i) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const IconComponent = (LucideIcons as unknown as Record<string, React.FC<any>>)[service.icon];
              return (
                <ScrollReveal key={service.title} direction="up" delay={i * 0.1}>
                  <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 h-full">
                    <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center shrink-0">
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 font-display mb-1">
                        {service.title}
                      </h3>
                      <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed"> {/* [UX-FIX] surface-500 on white fails WCAG AA for normal text */}
                        {service.description}
                      </p>
                    </div>
                    <ul className="flex flex-wrap gap-2 mt-auto pt-2">
                      {service.features.map((feature) => (
                        <li key={feature}>
                          <Badge variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Skills ──────────────────────────────────────────────── */}
      <SkillsGrid />

      {/* ── Resume CTA ──────────────────────────────────────────── */}
      <section className="py-16 bg-surface-50/80 dark:bg-surface-900/80 backdrop-blur-sm">
        <Container className="max-w-xl text-center">
          <ScrollReveal direction="up" delay={0}>
            <h2 className="text-2xl font-bold font-display text-surface-900 dark:text-surface-100 mb-3">
              Want the full picture?
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-6"> {/* [UX-FIX] surface-500 on surface-50 bg borderline WCAG fail */}
              Download my resume for a complete overview of my experience, skills, and
              accomplishments.
            </p>
            <a
              href={SITE_CONFIG.resumeUrl}
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <CtaSection />
    </div>
  );
}
