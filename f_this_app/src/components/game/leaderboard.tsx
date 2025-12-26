'use client';

import { motion } from 'framer-motion';
import { Trophy, Flame, TrendingDown, TrendingUp } from 'lucide-react';
import { Avatar, RankedAvatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { LeaderboardEntry } from '@/types/database';
import { formatScore, formatRank } from '@/lib/utils/scoring';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  showTeams?: boolean;
}

export function Leaderboard({ entries, showTeams = false }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <Card className="text-center py-8 text-gray-400">
        No players yet. Invite some friends!
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.user_id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <LeaderboardRow
            entry={entry}
            showTeam={showTeams}
          />
        </motion.div>
      ))}
    </div>
  );
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  showTeam?: boolean;
}

function LeaderboardRow({ entry, showTeam }: LeaderboardRowProps) {
  const isTop3 = entry.rank <= 3;
  const isWinning = entry.rank === 1;

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl transition-all',
        entry.is_you
          ? 'bg-gradient-to-r from-red-500/20 to-transparent border border-red-500/50'
          : 'bg-gray-800/50',
        isWinning && !entry.is_you && 'bg-gradient-to-r from-yellow-500/10 to-transparent'
      )}
    >
      {/* Rank */}
      <div className={cn(
        'w-8 text-center font-bold text-lg',
        entry.rank === 1 && 'text-yellow-400',
        entry.rank === 2 && 'text-gray-300',
        entry.rank === 3 && 'text-amber-600',
        entry.rank > 3 && 'text-gray-500'
      )}>
        {entry.rank === 1 && <Trophy className="w-5 h-5 mx-auto" />}
        {entry.rank > 1 && entry.rank}
      </div>

      {/* Avatar */}
      <RankedAvatar
        src={entry.avatar_url}
        name={entry.display_name}
        rank={entry.rank}
        size="md"
      />

      {/* Name & Stats */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-semibold truncate',
            entry.is_you ? 'text-white' : 'text-gray-200'
          )}>
            {entry.is_you ? 'You' : entry.display_name}
          </span>
          {entry.streak_days > 0 && (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <Flame className="w-3 h-3" />
              {entry.streak_days}
            </span>
          )}
        </div>
        {showTeam && entry.team_name && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.team_color }}
            />
            {entry.team_name}
          </div>
        )}
        {entry.curses_today > 0 && (
          <div className="text-xs text-red-400">
            {entry.curses_today} curse{entry.curses_today !== 1 && 's'} today
          </div>
        )}
      </div>

      {/* Score */}
      <div className={cn(
        'text-xl font-bold',
        entry.score === 0 && 'text-green-400',
        entry.score > 0 && entry.score <= 5 && 'text-yellow-400',
        entry.score > 5 && 'text-red-400'
      )}>
        {formatScore(entry.score)}
      </div>
    </div>
  );
}

// Team leaderboard view
interface TeamLeaderboardProps {
  entries: LeaderboardEntry[];
}

export function TeamLeaderboard({ entries }: TeamLeaderboardProps) {
  // Group by team
  const teamScores = entries.reduce((acc, entry) => {
    const teamId = entry.team_id || 'no-team';
    if (!acc[teamId]) {
      acc[teamId] = {
        id: teamId,
        name: entry.team_name || 'No Team',
        color: entry.team_color || '#666',
        score: 0,
        players: [],
      };
    }
    acc[teamId].score += entry.score;
    acc[teamId].players.push(entry);
    return acc;
  }, {} as Record<string, { id: string; name: string; color: string; score: number; players: LeaderboardEntry[] }>);

  const sortedTeams = Object.values(teamScores).sort((a, b) => a.score - b.score);

  return (
    <div className="space-y-4">
      {sortedTeams.map((team, index) => (
        <Card key={team.id} className="overflow-hidden">
          {/* Team header */}
          <div
            className="p-4 flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg, ${team.color}22 0%, transparent 100%)`,
              borderLeft: `4px solid ${team.color}`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                'text-2xl font-bold',
                index === 0 && 'text-yellow-400',
                index === 1 && 'text-gray-300',
                index === 2 && 'text-amber-600',
                index > 2 && 'text-gray-500'
              )}>
                #{index + 1}
              </span>
              <div>
                <div className="font-bold text-white">{team.name}</div>
                <div className="text-xs text-gray-400">
                  {team.players.length} player{team.players.length !== 1 && 's'}
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatScore(team.score)}
            </div>
          </div>

          {/* Team players */}
          <div className="p-2 space-y-1">
            {team.players
              .sort((a, b) => a.score - b.score)
              .map((player) => (
                <div
                  key={player.user_id}
                  className="flex items-center gap-2 p-2 text-sm"
                >
                  <Avatar
                    src={player.avatar_url}
                    name={player.display_name}
                    size="sm"
                  />
                  <span className={cn(
                    'flex-1 truncate',
                    player.is_you ? 'text-white font-semibold' : 'text-gray-400'
                  )}>
                    {player.is_you ? 'You' : player.display_name}
                  </span>
                  <span className="text-gray-500">
                    {formatScore(player.score)}
                  </span>
                </div>
              ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
