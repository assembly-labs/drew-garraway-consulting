'use client';

import Link from 'next/link';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import type { SiteContent } from '@/lib/types';

interface FooterProps {
  siteContent: SiteContent;
}

export default function Footer({ siteContent }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Column */}
          <div>
            <h3 className="font-heading text-lg font-normal">About</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              {siteContent.footer.about}
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-heading text-lg font-normal">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {siteContent.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={siteContent.cta.href}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {siteContent.cta.label}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-heading text-lg font-normal">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>{siteContent.footer.address}</li>
              <li>
                <a
                  href={`mailto:${siteContent.footer.email}`}
                  className="transition-colors hover:text-white"
                >
                  {siteContent.footer.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteContent.footer.phone.replace(/[^\d+]/g, '')}`}
                  className="transition-colors hover:text-white"
                >
                  {siteContent.footer.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-heading text-lg font-normal">Newsletter</h3>
            <p className="mt-4 text-sm text-white/80">
              Stay updated on our programs and community events.
            </p>
            <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-md bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="rounded-md bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Social Icons */}
        <div className="mt-12 flex items-center justify-center gap-6 border-t border-white/10 pt-8">
          <a
            href={siteContent.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 transition-colors hover:text-white"
            aria-label="Instagram"
          >
            <Instagram className="h-6 w-6" />
          </a>
          <a
            href={siteContent.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 transition-colors hover:text-white"
            aria-label="Facebook"
          >
            <Facebook className="h-6 w-6" />
          </a>
          <a
            href={siteContent.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 transition-colors hover:text-white"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-6 w-6" />
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-white/60">
          &copy; {currentYear} {siteContent.orgName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
