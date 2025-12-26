'use client';

import { motion } from 'framer-motion';
import { Trophy, Skull, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Card, StatCard } from '@/components/ui/card';
import { WeeklyStats } from '@/types/database';
import { CLEAN_MOUTH, DIRTY_MOUTH, getRandomQuip } from '@/lib/constants/characters';
import { cn } from '@/lib/utils/cn';

interface WeeklyRecapProps {
  isOpen: boolean;
  onClose: () => void;
  stats: WeeklyStats;
  playerName: string;
}

export function WeeklyRecap({ isOpen, onClose, stats, playerName }: WeeklyRecapProps) {
  const isWinner = stats.rank === 1;
  const isLoser = stats.rank === stats.total_players && stats.total_players > 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-2">
            {isWinner ? '🏆' : isLoser ? '💀' : '📊'}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isWinner
              ? 'Congratulations!'
              : isLoser
              ? 'Well well well...'
              : 'Weekly Recap'}
          </h2>
          <p className="text-gray-400 mt-1">
            {isWinner
              ? getRandomQuip(CLEAN_MOUTH.recapWinnerQuips)
              : isLoser
              ? getRandomQuip(DIRTY_MOUTH.recapLoserQuips)
              : `Here's how your week went, ${playerName}`}
          </p>
        </motion.div>

        {/* Winner/Loser callouts */}
        {(stats.winner || stats.biggest_loser) && (
          <div className="grid grid-cols-2 gap-4">
            {stats.winner && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-yellow-500/20 to-transparent border-yellow-500/50">
                  <div className="text-center">
                    <Trophy className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
                    <div className="text-sm text-yellow-400 font-medium">Cleanest Mouth</div>
                    <div className="text-lg font-bold text-white mt-1">{stats.winner.name}</div>
                    <div className="text-sm text-gray-400">+{stats.winner.score} points</div>
                  </div>
                </Card>
              </motion.div>
            )}
            {stats.biggest_loser && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-red-500/20 to-transparent border-red-500/50">
                  <div className="text-center">
                    <Skull className="w-8 h-8 mx-auto text-red-400 mb-2" />
                    <div className="text-sm text-red-400 font-medium">Dirtiest Mouth</div>
                    <div className="text-lg font-bold text-white mt-1">{stats.biggest_loser.name}</div>
                    <div className="text-sm text-gray-400">+{stats.biggest_loser.score} points</div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        )}

        {/* Your stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-3">Your Week</h3>
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              label="Total Curses"
              value={stats.total_curses}
              icon={<span className="text-xl">🤬</span>}
            />
            <StatCard
              label="Nice Words"
              value={stats.nice_words_used}
              icon={<span className="text-xl">✨</span>}
            />
            <StatCard
              label="Clean Days"
              value={stats.clean_days}
              icon={<span className="text-xl">😇</span>}
            />
          </div>
        </motion.div>

        {/* Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                stats.trend === 'down' && 'bg-green-500/20 text-green-400',
                stats.trend === 'up' && 'bg-red-500/20 text-red-400',
                stats.trend === 'same' && 'bg-gray-500/20 text-gray-400'
              )}>
                {stats.trend === 'down' && <TrendingDown className="w-5 h-5" />}
                {stats.trend === 'up' && <TrendingUp className="w-5 h-5" />}
                {stats.trend === 'same' && <Minus className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-semibold text-white">vs Last Week</div>
                <div className={cn(
                  'text-sm',
                  stats.trend === 'down' && 'text-green-400',
                  stats.trend === 'up' && 'text-red-400',
                  stats.trend === 'same' && 'text-gray-400'
                )}>
                  {stats.trend === 'down' && `${stats.trend_amount} fewer curses!`}
                  {stats.trend === 'up' && `${stats.trend_amount} more curses...`}
                  {stats.trend === 'same' && 'Same as last week'}
                </div>
              </div>
            </div>
            <div className="text-3xl">
              {stats.trend === 'down' && '📉'}
              {stats.trend === 'up' && '📈'}
              {stats.trend === 'same' && '➖'}
            </div>
          </Card>
        </motion.div>

        {/* Fun stats */}
        {(stats.most_reported_player || stats.top_snitch) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-3"
          >
            {stats.most_reported_player && (
              <Card>
                <div className="text-center">
                  <div className="text-2xl mb-1">🗣️</div>
                  <div className="text-xs text-gray-400">Most Reported</div>
                  <div className="font-semibold text-white text-sm mt-1">
                    {stats.most_reported_player.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stats.most_reported_player.count} times
                  </div>
                </div>
              </Card>
            )}
            {stats.top_snitch && (
              <Card>
                <div className="text-center">
                  <div className="text-2xl mb-1">🕵️</div>
                  <div className="text-xs text-gray-400">Top Snitch</div>
                  <div className="font-semibold text-white text-sm mt-1">
                    {stats.top_snitch.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stats.top_snitch.count} reports
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Your rank */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="text-center bg-gradient-to-r from-gray-800 to-gray-900">
            <div className="text-sm text-gray-400 mb-1">You finished</div>
            <div className="text-4xl font-black text-white">
              #{stats.rank}
              <span className="text-lg text-gray-400 font-normal ml-2">
                of {stats.total_players}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Close button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button onClick={onClose} size="lg" className="w-full">
            Let&apos;s do better this week!
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}
