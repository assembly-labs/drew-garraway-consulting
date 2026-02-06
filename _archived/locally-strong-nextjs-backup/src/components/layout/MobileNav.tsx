'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SiteContent } from '@/lib/types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  siteContent: SiteContent;
}

export default function MobileNav({ isOpen, onClose, siteContent }: MobileNavProps) {
  // Prevent body scroll when nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{
            type: 'tween',
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className="fixed inset-0 z-50 bg-cream md:hidden"
          style={{
            // Respect reduced motion preference
            // The motion component handles this automatically with CSS
          }}
        >
          {/* Close Button */}
          <div className="flex h-16 items-center justify-end px-4">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-md text-charcoal"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col px-6 py-8">
            {siteContent.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="border-b border-wheat py-4 text-lg font-medium text-charcoal transition-colors hover:text-forest"
              >
                {item.label}
              </Link>
            ))}

            {/* Donate CTA */}
            <div className="mt-8">
              <Link
                href={siteContent.cta.href}
                onClick={onClose}
                className="inline-block w-full rounded-full bg-forest px-6 py-4 text-center text-lg font-medium text-white transition-colors hover:bg-forest/90"
              >
                {siteContent.cta.label}
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
