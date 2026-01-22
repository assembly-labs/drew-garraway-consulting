'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import type { HomeContent } from '@/lib/types';

interface TestimonialCarouselProps {
  testimonials: HomeContent['testimonials'];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = testimonials.items;
  const totalItems = items.length;

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  }, [totalItems]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  }, [totalItems]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if focus is within the carousel section
      const carousel = document.getElementById('testimonial-carousel');
      if (!carousel?.contains(document.activeElement)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  if (totalItems === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <section
      id="testimonial-carousel"
      className="bg-cream py-16 md:py-24"
      aria-labelledby="testimonials-heading"
      aria-roledescription="carousel"
    >
      <Container size="md">
        <SectionHeading headline={testimonials.headline} className="mb-12" />

        <div
          className="relative"
          role="group"
          aria-label={`Testimonial ${currentIndex + 1} of ${totalItems}`}
        >
          {/* Testimonial Content */}
          <div className="min-h-[200px] text-center">
            <blockquote>
              <p className="font-heading text-xl italic text-charcoal md:text-2xl lg:text-3xl">
                &ldquo;{currentItem.quote}&rdquo;
              </p>
              <footer className="mt-6">
                <cite className="not-italic">
                  <span className="block font-medium text-charcoal">
                    {currentItem.author}
                  </span>
                  <span className="block text-sm text-charcoal/70">
                    {currentItem.role}
                  </span>
                </cite>
              </footer>
            </blockquote>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={goToPrevious}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-colors hover:border-forest hover:text-forest focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-2"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Dots Indicator */}
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Testimonial slides"
            >
              {items.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Go to testimonial ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  className={`h-3 w-3 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-2 ${
                    index === currentIndex
                      ? 'bg-forest'
                      : 'bg-charcoal/20 hover:bg-charcoal/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goToNext}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-colors hover:border-forest hover:text-forest focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-2"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
