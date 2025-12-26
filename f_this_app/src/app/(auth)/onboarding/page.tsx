'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    emoji: '🤬',
    title: 'Report Curses',
    description:
      'When someone drops a curse word, tap the big red button and report them. They get points. Points are bad.',
  },
  {
    emoji: '🏆',
    title: 'Lowest Score Wins',
    description:
      "Like golf, the person with the LEAST points wins. Keep your mouth clean and you'll come out on top.",
  },
  {
    emoji: '😈',
    title: 'Meet Filthy Phil',
    description:
      "He'll roast you when you curse. He lives for chaos. Don't give him the satisfaction.",
  },
  {
    emoji: '😇',
    title: 'Meet Sunny',
    description:
      "She celebrates your clean streaks and nice word usage. Be the person Sunny believes you can be.",
  },
  {
    emoji: '⚡',
    title: 'Watch for 2X Days',
    description:
      'Sundays, holidays, and "Around Kids" mode all double your points. Choose your words wisely!',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push('/home');
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={handleSkip}
        className="self-end text-gray-500 hover:text-white transition-colors text-sm"
      >
        Skip
      </motion.button>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-8xl mb-8"
            >
              {slides[currentSlide].emoji}
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {slides[currentSlide].title}
            </h2>
            <p className="text-gray-400 leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-red-500 w-6'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handlePrev}
          variant="ghost"
          size="lg"
          disabled={currentSlide === 0}
          className="flex-1"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext} size="lg" className="flex-1">
          {currentSlide === slides.length - 1 ? "Let's Go!" : 'Next'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
