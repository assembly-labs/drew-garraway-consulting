'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Trophy, Camera, Sparkles, Package, ArrowRight, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PRICING_TIERS } from '@/lib/mock-data';

// Animated card carousel
const sampleCards = [
  { bg: 'bg-gradient-to-br from-cyan-500 to-cyan-600', sport: 'HOCKEY', number: '17' },
  { bg: 'bg-gradient-to-br from-dark-800 to-dark-700 border border-cyan-500/30', sport: 'FOOTBALL', number: '23' },
  { bg: 'bg-gradient-to-br from-cyan-600 to-dark-800', sport: 'BASEBALL', number: '8' },
  { bg: 'bg-gradient-to-br from-dark-700 to-dark-800 border border-cyan-500/20', sport: 'SOCCER', number: '10' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % sampleCards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800 py-20 border-b border-dark-600">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl uppercase mb-4">
                <span className="text-gradient-cyan">Championship</span>
                <br />
                <span className="text-gray-100">Athletic</span>
                <br />
                <span className="text-gray-100">Prospects</span>
              </h1>
              <p className="font-body text-xl md:text-2xl text-gray-300 mb-8">
                Turn phone photos into professional trading cards in under 5 minutes.
                Every kid's a champion with CAP.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link href="/dashboard" className="btn-primary inline-flex items-center justify-center">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link href="/signup" className="btn-primary inline-flex items-center justify-center">
                      Create Your First Card
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <Link href="/login" className="btn-ghost inline-flex items-center justify-center">
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap gap-4 text-sm font-body text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-cyan-500" />
                  4.9/5 Rating
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-cyan-500" />
                  15,000+ Champions
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4 text-cyan-500" />
                  5-Day Delivery
                </span>
              </div>
            </div>

            {/* Animated Cards */}
            <div className="relative h-[500px] hidden lg:block">
              {sampleCards.map((card, index) => (
                <div
                  key={index}
                  className={`absolute w-72 h-96 rounded-2xl shadow-2xl transition-all duration-500 ${card.bg} ${
                    index === currentCard
                      ? 'z-30 translate-x-0 rotate-0 opacity-100'
                      : index === (currentCard + 1) % sampleCards.length
                      ? 'z-20 translate-x-8 rotate-3 opacity-80'
                      : index === (currentCard + 2) % sampleCards.length
                      ? 'z-10 translate-x-16 rotate-6 opacity-60'
                      : 'z-0 translate-x-24 rotate-12 opacity-40'
                  }`}
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) translateX(${
                      index === currentCard ? 0 : (index - currentCard) * 30
                    }px) rotate(${index === currentCard ? 0 : (index - currentCard) * 3}deg)`,
                  }}
                >
                  <div className="p-6 h-full flex flex-col text-white">
                    <div className="font-accent text-sm uppercase tracking-widest mb-auto">
                      CAP Trading Card
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-6xl font-bold mb-2">#{card.number}</div>
                      <div className="font-display text-2xl uppercase">{card.sport}</div>
                      <div className="font-body text-sm mt-2">2024 Season</div>
                    </div>
                    <div className="mt-auto text-center">
                      <div className="font-accent text-xs uppercase tracking-wider">
                        Championship Edition
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-800 border-b border-dark-600">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-5xl text-center text-gray-100 uppercase mb-12">
            How CAP Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-500 flex items-center justify-center group-hover:animate-float group-hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all">
                <Camera className="w-10 h-10 text-dark-900" />
              </div>
              <h3 className="font-display text-2xl text-gray-100 uppercase mb-3">
                1. Upload Photos
              </h3>
              <p className="font-body text-gray-400">
                Take photos with your phone or upload existing images. Our AI handles the rest.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-700 border border-cyan-500/50 flex items-center justify-center group-hover:animate-float group-hover:border-cyan-500 transition-all">
                <Sparkles className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="font-display text-2xl text-gray-100 uppercase mb-3">
                2. AI Enhancement
              </h3>
              <p className="font-body text-gray-400">
                Professional background removal and bio generation powered by cutting-edge AI.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-700 border border-cyan-500/30 flex items-center justify-center group-hover:animate-float group-hover:border-cyan-500 group-hover:bg-cyan-500/10 transition-all">
                <Trophy className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="font-display text-2xl text-gray-100 uppercase mb-3">
                3. Print & Deliver
              </h3>
              <p className="font-body text-gray-400">
                Professional quality cards delivered to your door in 5-7 business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-dark-900 border-b border-dark-600">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-5xl text-center text-gray-100 uppercase mb-4">
            Simple Pricing
          </h2>
          <p className="font-body text-xl text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Choose the perfect package for your champions
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(PRICING_TIERS).map(([key, tier]) => (
              <div
                key={key}
                className={`relative rounded-2xl p-8 transition-all hover:scale-105 ${
                  key === 'pro' ? 'card-premium scale-105' : 'card-dark'
                }`}
              >
                {key === 'pro' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-dark-900 px-4 py-1 rounded-full font-accent text-xs uppercase tracking-wider font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-3xl text-gray-100 uppercase mb-2">
                  {tier.name}
                </h3>
                <div className="mb-6">
                  <span className="font-mono text-5xl font-bold text-cyan-500">
                    ${tier.price}
                  </span>
                  <span className="font-body text-gray-400">/{tier.cards} cards</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 font-body text-gray-300">
                      <span className="text-cyan-400 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={key === 'pro' ? 'btn-primary w-full text-center' : 'btn-secondary w-full text-center'}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-20 bg-dark-800 border-b border-dark-600">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-5xl text-center text-gray-100 uppercase mb-12">
            All Sports Covered
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
            {['Hockey', 'Football', 'Baseball', 'Soccer', 'Lacrosse', 'Basketball'].map((sport) => (
              <div
                key={sport}
                className="text-center p-6 rounded-xl bg-dark-700 border border-dark-600 hover:border-cyan-500/50 hover:bg-dark-700/50 transition-all group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {sport === 'Hockey' && '🏒'}
                  {sport === 'Football' && '🏈'}
                  {sport === 'Baseball' && '⚾'}
                  {sport === 'Soccer' && '⚽'}
                  {sport === 'Lacrosse' && '🥍'}
                  {sport === 'Basketball' && '🏀'}
                </div>
                <p className="font-display text-lg uppercase text-gray-300 group-hover:text-cyan-400 transition-colors">{sport}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-900/50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-5xl md:text-6xl text-dark-900 uppercase mb-6">
            Ready to Create Champions?
          </h2>
          <p className="font-body text-xl text-dark-900/80 mb-8 max-w-2xl mx-auto">
            Join thousands of parents and coaches who are turning their players into trading card stars.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-dark-900 text-cyan-400 px-8 py-4 rounded-lg font-display text-xl uppercase hover:bg-dark-800 hover:text-cyan-300 transition-all inline-flex items-center justify-center shadow-xl"
            >
              Start Creating Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="bg-white/10 backdrop-blur text-dark-900 border border-dark-900/30 px-8 py-4 rounded-lg font-display text-xl uppercase hover:bg-white/20 transition-all inline-flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-dark-600 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="font-display text-3xl text-cyan-500 uppercase">CAP</h3>
              <p className="font-body text-sm text-gray-500 mt-2">
                © 2024 Championship Athletic Prospects
              </p>
            </div>
            <div className="flex gap-6 font-body text-sm">
              <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="hover:text-cyan-400 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}