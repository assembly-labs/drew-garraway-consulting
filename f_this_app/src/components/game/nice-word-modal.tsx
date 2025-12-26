'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { CLEAN_MOUTH, getRandomQuip } from '@/lib/constants/characters';
import { cn } from '@/lib/utils/cn';

interface NiceWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string;
  remainingUses: number;
  maxUses: number;
  pointsValue: number;
  onUseWord: () => Promise<void>;
}

export function NiceWordModal({
  isOpen,
  onClose,
  word,
  remainingUses,
  maxUses,
  pointsValue,
  onUseWord,
}: NiceWordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUseWord = async () => {
    if (remainingUses <= 0) return;

    setIsSubmitting(true);
    try {
      await onUseWord();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to use nice word:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} showClose={false}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center py-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: 2, duration: 0.3 }}
            className="text-7xl mb-4"
          >
            😇
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Beautiful!</h2>
          <p className="text-green-400 text-xl font-bold mb-4">
            {pointsValue} point{pointsValue !== -1 && 's'}
          </p>
          <p className="text-gray-400 italic">
            &ldquo;{getRandomQuip(CLEAN_MOUTH.niceWordQuips)}&rdquo;
          </p>
        </motion.div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nice Word of the Week">
      <div className="space-y-6">
        {/* Character */}
        <div className="text-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl mb-2"
          >
            😇
          </motion.div>
          <p className="text-sm text-gray-400">
            {CLEAN_MOUTH.name} says:
          </p>
        </div>

        {/* Word display */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={cn(
            'text-center py-6 px-4 rounded-2xl',
            'bg-gradient-to-br from-green-500/20 to-teal-500/20',
            'border border-green-500/30'
          )}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-400 font-medium">This week&apos;s word</span>
            <Sparkles className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-4xl font-black text-white">
            &ldquo;{word}&rdquo;
          </div>
          <div className="text-green-400 font-bold mt-3">
            {pointsValue} point per use
          </div>
        </motion.div>

        {/* Usage counter */}
        <div className="flex items-center justify-center gap-2">
          {[...Array(maxUses)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-4 h-4 rounded-full transition-colors',
                i < (maxUses - remainingUses)
                  ? 'bg-green-500'
                  : 'bg-gray-700'
              )}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-400">
          {remainingUses} use{remainingUses !== 1 && 's'} remaining today
        </p>

        {/* Action */}
        <div className="space-y-3">
          <Button
            onClick={handleUseWord}
            disabled={remainingUses <= 0}
            isLoading={isSubmitting}
            size="lg"
            className={cn(
              'w-full',
              remainingUses > 0
                ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
                : ''
            )}
          >
            {remainingUses > 0 ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                I Used &ldquo;{word}&rdquo;!
              </>
            ) : (
              'No uses left today'
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            Maybe later
          </Button>
        </div>
      </div>
    </Modal>
  );
}
