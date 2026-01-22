'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import type { HomeContent } from '@/lib/types';

interface MissionTriadProps {
  triad: HomeContent['triad'];
}

export default function MissionTriad({ triad }: MissionTriadProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <section className="bg-wheat py-16 md:py-24" aria-labelledby="triad-heading">
      <Container>
        <SectionHeading headline={triad.headline} className="mb-12" />
        <div
          className="grid gap-8 md:grid-cols-3"
          id="triad-heading"
        >
          {triad.items.map((item) => (
            <div
              key={item.word}
              className={`rounded-2xl bg-cream p-8 text-center shadow-sm ${
                prefersReducedMotion
                  ? ''
                  : 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              <h3 className="font-heading text-3xl text-forest md:text-4xl">
                {item.word}
              </h3>
              <p className="mt-4 text-charcoal/80">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
