import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { experience } from '@/data/experience';
import { ExperienceClient } from './client';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Experience – Ganesh Prasad Bhatt',
  description:
    'Career journey and educational background of Ganesh Prasad Bhatt — Senior Full-Stack Developer.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/experience`,
  },
};

export default function ExperiencePage() {
  return (
    <div className="pt-24 pb-16">
      <Container>
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
