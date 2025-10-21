import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Display, H2, Body } from '@/components/ui/typography';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gold-50 to-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Display className="mb-6">
              <span className="text-gradient-gold">CHAMPIONSHIP</span>
              <br />
              ATHLETIC PROSPECTS
            </Display>
            <Body className="mb-8 text-xl md:text-2xl text-navy-700">
              Turn phone photos into professional trading cards in under 5 minutes
            </Body>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild variant="primary" size="lg">
                <Link href="/signup">
                  Create Your First Card
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <H2 className="mb-12 text-center">
            Make Your Champions Shine
          </H2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold-500">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="mb-2 text-xl font-bold font-body text-navy-900">Upload Photos</h3>
              <Body className="text-sm">
                Take photos with your phone or upload existing images - we handle the rest
              </Body>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-navy-900">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="mb-2 text-xl font-bold font-body text-navy-900">AI Enhancement</h3>
              <Body className="text-sm">
                Professional background removal and bio generation powered by AI
              </Body>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-fire-red-500">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="mb-2 text-xl font-bold font-body text-fire-red-500">Print & Deliver</h3>
              <Body className="text-sm">
                Professional quality cards delivered to your door in 5-7 days
              </Body>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-navy-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <H2 className="mb-12 text-center">
            Simple Pricing
          </H2>
          <div className="mx-auto max-w-md card-premium p-8">
            <div className="mb-4 text-center">
              <span className="font-mono text-5xl font-bold text-gold-500">$28</span>
              <span className="font-body text-navy-700">/pack</span>
            </div>
            <ul className="mb-8 space-y-3 font-body">
              <li className="flex items-center text-navy-800">
                <span className="mr-2 text-green-500">✓</span>
                8 professional trading cards
              </li>
              <li className="flex items-center text-navy-800">
                <span className="mr-2 text-green-500">✓</span>
                AI background removal
              </li>
              <li className="flex items-center text-navy-800">
                <span className="mr-2 text-green-500">✓</span>
                AI-generated player bios
              </li>
              <li className="flex items-center text-navy-800">
                <span className="mr-2 text-green-500">✓</span>
                5-7 day delivery
              </li>
              <li className="flex items-center text-navy-800">
                <span className="mr-2 text-green-500">✓</span>
                100% satisfaction guarantee
              </li>
            </ul>
            <Button asChild variant="primary" className="w-full">
              <Link href="/signup">
                Get Started Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-navy-500/20 bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <span className="text-3xl font-display text-gold-500 uppercase">CAP</span>
              <p className="text-sm font-body text-navy-700">© 2024 Championship Athletic Prospects</p>
            </div>
            <div className="flex gap-6 text-sm font-body">
              <Link href="/privacy" className="text-navy-700 hover:text-gold-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-navy-700 hover:text-gold-500 transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="text-navy-700 hover:text-gold-500 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}