'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActionStrip() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    // Check if dismissed this session
    const dismissed = sessionStorage.getItem('actionStripDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }

    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    if (isDismissed) return;

    const handleScroll = () => {
      // Show after scrolling past hero (100vh)
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      setIsVisible(scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    setIsVisible(false);
    sessionStorage.setItem('actionStripDismissed', 'true');
  }, []);

  const scrollToNewsletter = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const newsletter = document.getElementById('newsletter');
    if (newsletter) {
      newsletter.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }, [prefersReducedMotion]);

  // Hide on mobile - too intrusive
  // Also hide if dismissed
  if (isDismissed) return null;

  const stripContent = (
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <nav
        className="flex items-center gap-6"
        aria-label="Quick actions"
      >
        <Link
          href="/donate"
          className="text-sm font-medium text-charcoal transition-colors hover:text-forest"
        >
          Donate
        </Link>
        <span className="text-charcoal/30" aria-hidden="true">|</span>
        <Link
          href="/get-involved"
          className="text-sm font-medium text-charcoal transition-colors hover:text-forest"
        >
          Volunteer
        </Link>
        <span className="text-charcoal/30" aria-hidden="true">|</span>
        <button
          type="button"
          onClick={scrollToNewsletter}
          className="text-sm font-medium text-charcoal transition-colors hover:text-forest"
        >
          Newsletter
        </button>
      </nav>
      <button
        type="button"
        onClick={handleDismiss}
        className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal/60 transition-colors hover:bg-charcoal/10 hover:text-charcoal focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-2"
        aria-label="Dismiss action bar"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 hidden border-t border-charcoal/10 bg-white/95 backdrop-blur-sm md:block"
          role="complementary"
          aria-label="Quick action bar"
        >
          {stripContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
