import React from 'react';
import Link from 'next/link';

interface CAPLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  linkToHome?: boolean;
}

export function CAPLogo({ size = 'md', className = '', linkToHome = true }: CAPLogoProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const logo = (
    <span className={`font-display ${sizeClasses[size]} ${className}`}>
      <span className="text-cap-gold">C</span>
      <span className="text-cap-secondary">A</span>
      <span className="text-cap-accent">P</span>
    </span>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
        {logo}
      </Link>
    );
  }

  return logo;
}