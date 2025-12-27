"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CAPLogo } from './CAPLogo';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth/helpers';

interface CAPHeaderProps {
  user?: any;
}

export function CAPHeader({ user }: CAPHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <CAPLogo size="md" />

        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-cap-secondary">
                Dashboard
              </Link>
              <Link href="/dashboard/teams" className="text-sm font-medium hover:text-cap-secondary">
                Teams
              </Link>
              <Link href="/dashboard/orders" className="text-sm font-medium hover:text-cap-secondary">
                Orders
              </Link>
            </>
          ) : (
            <>
              <Link href="/#features" className="text-sm font-medium hover:text-cap-secondary">
                Features
              </Link>
              <Link href="/#pricing" className="text-sm font-medium hover:text-cap-secondary">
                Pricing
              </Link>
              <Link href="/support" className="text-sm font-medium hover:text-cap-secondary">
                Support
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600 hidden md:block">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="cap" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}