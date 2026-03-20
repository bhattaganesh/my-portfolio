import React from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export function CtaSection() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      aria-labelledby="cta-heading"
      style={{
        background: 'linear-gradient(135deg, #0d1b4b 0%, #1e2f7a 35%, #2b3f9e 65%, #1a357a 100%)',
      }}
    >
      {/* Animated radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(76,110,245,0.25) 0%, transparent 65%)',
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">

          {/* Eyebrow */}
          <ScrollReveal direction="up" delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-400/20 bg-primary-500/10">
              <Briefcase className="w-3.5 h-3.5 text-primary-300" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-300">
                Available for work
              </span>
            </div>
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal direction="up" delay={0.1}>
            <h2
              id="cta-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-white leading-[1.1] tracking-tight"
            >
              Ready to build{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #748ffc, #91a7ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                something great?
              </span>
            </h2>
          </ScrollReveal>

          {/* Body */}
          <ScrollReveal direction="up" delay={0.2}>
            <p className="text-lg sm:text-xl text-primary-200 leading-relaxed max-w-xl">
              I&apos;m open to full-time roles, freelance projects, and open&nbsp;source collaboration.
              Let&apos;s turn your ideas into polished, production-ready software.
            </p>
          </ScrollReveal>

          {/* Buttons */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-primary-700 hover:bg-primary-50 font-semibold text-sm shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/25 hover:-translate-y-0.5 transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800"
              >
                Let&apos;s Talk
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-white/25 hover:border-white/50 text-white font-semibold text-sm hover:bg-white/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800"
              >
                View My Work
              </Link>
            </div>
          </ScrollReveal>

          {/* Trust line */}
          <ScrollReveal direction="up" delay={0.4}>
            <p className="text-sm text-primary-300"> {/* [UX-FIX] /70 opacity dropped contrast below AA on dark navy */}
              Currently working at{' '}
              <span className="text-primary-200 font-medium">Brainstorm Force</span>
              {' '}—{' '}
              building tools used by{' '}
              <span className="text-primary-200 font-medium">1M+ WordPress sites</span>.
            </p>
          </ScrollReveal>

        </div>
      </Container>
    </section>
  );
}

export default CtaSection;
