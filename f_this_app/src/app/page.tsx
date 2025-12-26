'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo/Title */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          className="text-center mb-8"
        >
          <div className="text-7xl mb-4">🤬</div>
          <h1 className="text-4xl md:text-5xl font-black text-gradient mb-2">
            F*** This App!
          </h1>
          <p className="text-gray-400 text-lg">
            The game where your dirty mouth costs you.
          </p>
        </motion.div>

        {/* Mascots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-8 mb-12"
        >
          <div className="text-center">
            <div className="text-5xl mb-2">😇</div>
            <div className="text-xs text-gray-500">Sunny</div>
          </div>
          <div className="text-2xl text-gray-600">vs</div>
          <div className="text-center">
            <div className="text-5xl mb-2">😈</div>
            <div className="text-xs text-gray-500">Filthy Phil</div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-6 mb-12 max-w-md w-full"
        >
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-xs text-gray-400">Play with friends</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-xs text-gray-400">Lowest score wins</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-xs text-gray-400">Real-time updates</div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <Button
            onClick={() => router.push('/signup')}
            size="xl"
            className="w-full"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            onClick={() => router.push('/login')}
            variant="outline"
            size="lg"
            className="w-full"
          >
            I already have an account
          </Button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600 text-sm">
        <p>Like golf, but for your mouth.</p>
      </footer>
    </div>
  );
}
