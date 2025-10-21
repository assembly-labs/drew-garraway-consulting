import React from 'react';
import Link from 'next/link';
import { CAPLogo } from './CAPLogo';

export function CAPFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <CAPLogo size="lg" linkToHome={true} />
            <p className="mt-2 text-sm text-gray-600">
              Championship Athletic Prospects
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Make every kid feel like a champion
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/#features" className="hover:text-cap-secondary">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-cap-secondary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-cap-secondary">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/samples" className="hover:text-cap-secondary">
                  Sample Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/support" className="hover:text-cap-secondary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cap-secondary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cap-secondary">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="mailto:support@cap-platform.com" className="hover:text-cap-secondary">
                  support@cap-platform.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/privacy" className="hover:text-cap-secondary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cap-secondary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/coppa" className="hover:text-cap-secondary">
                  COPPA Compliance
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-cap-secondary">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>© {currentYear} Championship Athletic Prospects. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">
            Built with ❤️ for young champions everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}