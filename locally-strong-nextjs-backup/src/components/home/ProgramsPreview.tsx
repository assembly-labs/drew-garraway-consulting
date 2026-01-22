'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Store, BookOpen, HandHeart, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import type { HomeContent } from '@/lib/types';

interface ProgramsPreviewProps {
  programs: HomeContent['programs'];
}

// TODO: Replace with dynamic content from programs in Phase 3
const placeholderPrograms = [
  {
    slug: 'stronger-local-networks',
    title: 'Stronger Local Networks',
    description: 'Connecting small businesses, farmers, and producers to foster collaboration and mutual support.',
    icon: Users,
  },
  {
    slug: 'market-innovation-access',
    title: 'Market Innovation & Access',
    description: 'Evolving traditional farmers markets to meet modern consumer needs while preserving community spirit.',
    icon: Store,
  },
  {
    slug: 'education-advocacy',
    title: 'Education & Advocacy',
    description: 'Informing communities about the benefits of local commerce and sustainable food systems.',
    icon: BookOpen,
  },
  {
    slug: 'vendor-support',
    title: 'Vendor Support',
    description: 'Providing resources, mentorship, and funding opportunities to strengthen small businesses.',
    icon: HandHeart,
  },
];

export default function ProgramsPreview({ programs }: ProgramsPreviewProps) {
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

  // Use placeholder programs for now, will be replaced with dynamic content
  const displayPrograms = placeholderPrograms;

  return (
    <section className="bg-cream py-16 md:py-24" aria-labelledby="programs-heading">
      <Container>
        <SectionHeading
          headline={programs.headline}
          subheadline={programs.subheadline}
          className="mb-12"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayPrograms.map((program) => {
            const IconComponent = program.icon;
            return (
              <Link
                key={program.slug}
                href={`/programs/${program.slug}`}
                className={`group rounded-xl border border-sage/20 bg-white p-6 ${
                  prefersReducedMotion
                    ? ''
                    : 'transition-all duration-300 hover:-translate-y-1 hover:border-sage/40 hover:shadow-lg'
                }`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sage/20 text-forest">
                  <IconComponent className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-xl text-charcoal">{program.title}</h3>
                <p className="mt-2 text-sm text-charcoal/70">{program.description}</p>
                <span
                  className={`mt-4 inline-flex items-center gap-1 text-sm font-medium text-forest ${
                    prefersReducedMotion ? '' : 'group-hover:gap-2 transition-all duration-200'
                  }`}
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
