import type { Metadata } from 'next';
import { DM_Serif_Display, Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getSiteContent } from '@/lib/content';
import './globals.css';

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const siteContent = getSiteContent();

export const metadata: Metadata = {
  title: {
    template: '%s | Locally Strong',
    default: 'Locally Strong - Empowering Local Communities',
  },
  description: siteContent.missionShort,
  metadataBase: new URL('https://locallystrong.org'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Locally Strong',
    title: 'Locally Strong',
    description: siteContent.missionShort,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Locally Strong',
    description: siteContent.missionShort,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-forest focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
        <Header siteContent={siteContent} />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer siteContent={siteContent} />
      </body>
    </html>
  );
}
