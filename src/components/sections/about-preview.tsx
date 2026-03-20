import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Code2, Globe, Users } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { AnimatedCounter } from '@/components/shared/animated-counter';

const STATS = [
  {
    numericValue: 4,
    suffix: '+',
    label: 'Years Experience',
    sublabel: 'in full-stack development',
    icon: Code2,
    color: 'text-primary-500',
    bg: 'bg-primary-500/10',
  },
  {
    numericValue: 1,
    suffix: 'M+',
    label: 'Sites Impacted',
    sublabel: 'via WordPress plugins',
    icon: Globe,
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
  },
  {
    numericValue: 2,
    suffix: '',
    label: 'Great Companies',
    sublabel: 'Brainstorm Force & ThemeGrill',
    icon: Users,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
] as const;

export function AboutPreview() {
  return (
    <section
      className="py-20 lg:py-28 bg-white dark:bg-surface-950"
      aria-label="About me"
    >
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT: Photo ── */}
          <ScrollReveal direction="left" delay={0.1} className="flex justify-center lg:justify-start">
            <div className="relative w-64 sm:w-72 lg:w-full max-w-xs">
              {/* Decorative glow */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-20"
                aria-hidden="true"
                style={{
                  background:
                    'linear-gradient(135deg, #4c6ef5, #748ffc, #3b5bdb)',
                  filter: 'blur(24px)',
                }}
              />
              {/* Card glow ring */}
              <div
                className="absolute inset-0 rounded-2xl ring-1 ring-primary-500/15"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-primary-950/15 aspect-[3/4]">
                <Image
                  src="/images/ganesh.webp"
                  alt="Ganesh Prasad Bhatt — Senior Full-Stack Developer"
                  width={400}
                  height={533}
                  className="w-full h-full object-cover object-top"
                  priority
                />
                {/* Gradient overlay at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                  aria-hidden="true"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(15,23,42,0.5) 0%, transparent 100%)',
                  }}
                />
              </div>

              {/* Floating badge */}
              <div
                className="absolute -bottom-3 -right-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-lg shadow-surface-900/10 dark:shadow-black/30"
                aria-hidden="true"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                <span className="text-xs font-semibold text-surface-800 dark:text-surface-100 whitespace-nowrap">
                  Available for work
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* ── RIGHT: Text content ── */}
          <div className="space-y-8">
            <ScrollReveal direction="right" delay={0.1}>
              <SectionHeading
                eyebrow="About Me"
                title="I ship software that scales to millions"
                subtitle="Senior WordPress & React engineer with 4+ years building production-grade plugins and web applications at product companies."
                as="h2"
              />
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <p className="text-base leading-relaxed text-surface-600 dark:text-surface-400"> {/* [UX-FIX] surface-500 barely fails WCAG AA on white; surface-600 = 6.5:1 */}
                At{' '}
                <strong className="text-surface-700 dark:text-surface-300 font-semibold">Brainstorm Force</strong>
                {' '}I was a core engineer on{' '}
                <strong className="text-surface-700 dark:text-surface-300 font-semibold">Spectra v3</strong>
                {' '}— architected key systems and built major features for this ground-up rewrite of the most-used Gutenberg blocks plugin, now in beta and rolling out to 1M+ sites.
                Before that, three years at{' '}
                <strong className="text-surface-700 dark:text-surface-300 font-semibold">ThemeGrill</strong>
                {' '}shipping features across LMS, forms, payments, and authentication — the kind of varied, high-stakes work that makes engineers grow fast.
              </p>
            </ScrollReveal>

            {/* Stats row */}
            <ScrollReveal direction="up" delay={0.3}>
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-2">
                {STATS.map(({ numericValue, suffix, label, sublabel, icon: Icon, color, bg }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-2 p-4 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
                  >
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />
                    </div>
                    <p className={`text-2xl sm:text-3xl font-bold font-display ${color}`}>
                      <AnimatedCounter value={numericValue} suffix={suffix} />
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-surface-800 dark:text-surface-100 leading-snug">
                        {label}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-500 mt-0.5 leading-snug"> {/* [UX-FIX] surface-400 (#a8a29e) = 2.37:1 contrast on surface-50 — critical fail */}
                        {sublabel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* CTA link */}
            <ScrollReveal direction="up" delay={0.4}>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 font-semibold text-sm transition-colors duration-200 group"
              >
                Read Full Story
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                  aria-hidden="true"
                />
              </Link>
            </ScrollReveal>
          </div>

        </div>
      </Container>
    </section>
  );
}

export default AboutPreview;
