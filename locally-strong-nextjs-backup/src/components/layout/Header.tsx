'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import type { SiteContent } from '@/lib/types';
import MobileNav from './MobileNav';

interface HeaderProps {
  siteContent: SiteContent;
}

export default function Header({ siteContent }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-shadow duration-200 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Org Name */}
          <Link
            href="/"
            className="font-heading text-xl font-normal text-forest"
          >
            {siteContent.orgName}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {siteContent.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-charcoal transition-colors hover:text-forest"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: CTA + Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Donate CTA */}
            <Link
              href={siteContent.cta.href}
              className="rounded-full bg-forest px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90"
            >
              {siteContent.cta.label}
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-charcoal md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        siteContent={siteContent}
      />
    </>
  );
}
