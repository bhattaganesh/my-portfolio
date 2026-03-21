import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { experience } from '@/data/experience';
import { ExperienceClient } from './client';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title:
    'Experience — Brainstorm Force Developer, ThemeGrill Developer | Ganesh Prasad Bhatt',
  description:
    'Professional experience of Ganesh Prasad Bhatt — Software Developer at Brainstorm Force (Spectra, Gutenberg page builder), PHP Developer at ThemeGrill (Masteriyo LMS, Everest Forms). Nepali full-stack developer and software engineer.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/experience`,
  },
};

export default function ExperiencePage() {
  return (
    <div className="relative pt-24 pb-16 overflow-hidden">
      {/* Ambient glow — top-left */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[500px] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 20% 10%, rgba(76,110,245,0.10) 0%, transparent 60%)',
        }}
      />
      <Container className="relative z-10">
        <Breadcrumbs items={[{ label: 'Experience' }]} className="mb-6" />
        <ScrollReveal direction="up" delay={0}>
          <SectionHeading
            as="h1"
            title="Experience"
            subtitle="My professional journey and educational background"
            className="mb-12"
          />
        </ScrollReveal>
        <ExperienceClient experience={experience} />
      </Container>
    </div>
  );
}
