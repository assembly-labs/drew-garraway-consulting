'use client';

import { motion } from 'framer-motion';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import { GamePlayer } from '@/types/database';
import { formatScore } from '@/lib/utils/scoring';

interface PlayerSelectorProps {
  players: GamePlayer[];
  currentUserId: string;
  onSelect: (player: GamePlayer) => void;
  selectedPlayerId?: string;
}

export function PlayerSelector({
  players,
  currentUserId,
  onSelect,
  selectedPlayerId,
}: PlayerSelectorProps) {
  // Filter out current user - can't report yourself
  const otherPlayers = players.filter((p) => p.user_id !== currentUserId);

  if (otherPlayers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No other players in this game yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-400 mb-4">
        Who let one slip? Tap to report:
      </p>
      {otherPlayers.map((player, index) => (
        <motion.button
          key={player.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(player)}
          className={cn(
            'w-full p-4 rounded-xl',
            'flex items-center justify-between',
            'transition-all duration-200',
            selectedPlayerId === player.id
              ? 'bg-red-500/20 border-2 border-red-500'
              : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
          )}
        >
          <div className="flex items-center gap-3">
            <Avatar
              src={player.user?.avatar_url}
              name={player.user?.display_name || 'Player'}
              size="lg"
            />
            <div className="text-left">
              <div className="font-semibold text-white">
                {player.user?.display_name || 'Unknown Player'}
              </div>
              <div className="text-sm text-gray-400">
                Score: {formatScore(player.current_score)}
                {player.streak_days > 0 && (
                  <span className="ml-2 text-green-400">
                    🔥 {player.streak_days} day streak
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={cn(
            'text-2xl',
            selectedPlayerId === player.id ? 'opacity-100' : 'opacity-30'
          )}>
            👆
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// Compact player list for leaderboard preview
interface PlayerListPreviewProps {
  players: GamePlayer[];
  currentUserId: string;
  limit?: number;
}

export function PlayerListPreview({
  players,
  currentUserId,
  limit = 3,
}: PlayerListPreviewProps) {
  const sortedPlayers = [...players].sort((a, b) => a.current_score - b.current_score);
  const displayPlayers = sortedPlayers.slice(0, limit);

  return (
    <div className="space-y-2">
      {displayPlayers.map((player, index) => (
        <div
          key={player.id}
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg',
            player.user_id === currentUserId && 'bg-gray-800'
          )}
        >
          <span className={cn(
            'w-6 text-center font-bold',
            index === 0 && 'text-yellow-400',
            index === 1 && 'text-gray-300',
            index === 2 && 'text-amber-600',
            index > 2 && 'text-gray-500'
          )}>
            {index + 1}
          </span>
          <Avatar
            src={player.user?.avatar_url}
            name={player.user?.display_name || 'Player'}
            size="sm"
          />
          <div className="flex-1 truncate">
            <span className={cn(
              'text-sm',
              player.user_id === currentUserId ? 'text-white font-semibold' : 'text-gray-300'
            )}>
              {player.user_id === currentUserId ? 'You' : player.user?.display_name}
            </span>
          </div>
          <span className="text-sm font-semibold text-gray-400">
            {formatScore(player.current_score)}
          </span>
        </div>
      ))}
    </div>
  );
}
