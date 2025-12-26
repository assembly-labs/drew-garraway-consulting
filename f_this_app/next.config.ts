import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for Cloudflare Pages compatibility
  // Note: For full SSR support on Cloudflare, use OpenNext adapter
  // For now, we'll use static export + client-side rendering

  // Optimize images
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile pics
      },
    ],
  },

  // Experimental features
  experimental: {
    // Enable server actions for form handling
  },

  // Headers for security and PWA
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
