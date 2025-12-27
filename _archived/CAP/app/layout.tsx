import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CAP - Championship Athletic Prospects',
  description: 'Create professional trading cards for your young champions in under 5 minutes',
  keywords: ['youth sports', 'trading cards', 'sports cards', 'team photos', 'CAP'],
  authors: [{ name: 'CAP Platform' }],
  openGraph: {
    title: 'CAP - Championship Athletic Prospects',
    description: 'Turn phone photos into professional trading cards in minutes',
    url: 'https://cap-platform.com',
    siteName: 'CAP',
    images: [
      {
        url: '/cap-og-image.png',
        width: 1200,
        height: 630,
        alt: 'CAP - Championship Athletic Prospects',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAP - Championship Athletic Prospects',
    description: 'Turn phone photos into professional trading cards in minutes',
    images: ['/cap-og-image.png'],
  },
  icons: {
    icon: '/cap-icon-192.png',
    apple: '/cap-icon-192.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-ui antialiased">
        {children}
      </body>
    </html>
  );
}