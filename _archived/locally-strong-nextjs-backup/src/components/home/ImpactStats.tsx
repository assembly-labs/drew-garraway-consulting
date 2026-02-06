'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import type { HomeContent } from '@/lib/types';

interface ImpactStatsProps {
  impact: HomeContent['impact'];
}

function useCountUp(
  end: string,
  duration: number = 2000,
  shouldStart: boolean,
  prefersReducedMotion: boolean
): string {
  const [count, setCount] = useState(prefersReducedMotion ? end : '0');

  useEffect(() => {
    if (prefersReducedMotion || !shouldStart) {
      if (shouldStart) setCount(end);
      return;
    }

    // Extract numeric value and prefix/suffix
    const numericMatch = end.match(/^([^\d]*)([\d,]+)([^\d]*)$/);
    if (!numericMatch) {
      setCount(end);
      return;
    }

    const [, prefix, numStr, suffix] = numericMatch;
    const targetNum = parseInt(numStr.replace(/,/g, ''), 10);

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentNum = Math.floor(easeOut * targetNum);

      // Format with commas if original had them
      const formatted = numStr.includes(',')
        ? currentNum.toLocaleString()
        : currentNum.toString();

      setCount(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, shouldStart, prefersReducedMotion]);

  return count;
}

function StatItem({
  value,
  label,
  shouldAnimate,
  prefersReducedMotion,
}: {
  value: string;
  label: string;
  shouldAnimate: boolean;
  prefersReducedMotion: boolean;
}) {
  const displayValue = useCountUp(value, 2000, shouldAnimate, prefersReducedMotion);

  return (
    <div className="text-center">
      <div className="font-heading text-4xl text-white md:text-5xl lg:text-6xl">
        {displayValue}
      </div>
      <div className="mt-2 text-sm text-white/80 md:text-base">{label}</div>
    </div>
  );
}

export default function ImpactStats({ impact }: ImpactStatsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="bg-forest py-16 md:py-24"
      aria-labelledby="impact-heading"
    >
      <Container>
        <SectionHeading
          headline={impact.headline}
          className="mb-12 text-white [&_h2]:text-white"
        />
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {impact.stats.map((stat) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              shouldAnimate={isVisible}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
