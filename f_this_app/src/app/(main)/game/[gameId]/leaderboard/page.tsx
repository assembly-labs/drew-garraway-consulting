'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Leaderboard, TeamLeaderboard } from '@/components/game/leaderboard';
import { createClient } from '@/lib/supabase/client';
import { Game, GamePlayer, LeaderboardEntry } from '@/types/database';
import { cn } from '@/lib/utils/cn';
import { useDevModeData } from '@/lib/dev/use-dev-mode';

export default function LeaderboardPage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId as string;

  const [game, setGame] = useState<Game | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [viewMode, setViewMode] = useState<'individual' | 'teams'>('individual');
  const [isLoading, setIsLoading] = useState(true);
  const { isDevMode, mockGame, mockLeaderboard } = useDevModeData();

  useEffect(() => {
    if (isDevMode) {
      setGame(mockGame);
      setEntries(mockLeaderboard);
      setIsLoading(false);
    } else {
      loadLeaderboard();
    }
  }, [isDevMode, mockGame, mockLeaderboard]);

  const loadLeaderboard = useCallback(async () => {
    if (isDevMode) return;
    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();

      const { data: gameData } = await supabase
        .from('games')
        .select(`
          *,
          game_players (
            *,
            user:users (*),
            team:teams (*)
          )
        `)
        .eq('id', gameId)
        .single();

      if (!gameData) {
        router.push('/home');
        return;
      }

      setGame(gameData);

      // Build leaderboard entries
      const sortedPlayers = [...gameData.game_players].sort(
        (a: GamePlayer, b: GamePlayer) => a.current_score - b.current_score
      );

      // Get today's curse counts
      const today = new Date().toISOString().split('T')[0];
      const { data: todayReports } = await supabase
        .from('curse_reports')
        .select('offender_id')
        .eq('game_id', gameId)
        .gte('timestamp', today);

      const cursesTodayMap = (todayReports || []).reduce((acc, r) => {
        acc[r.offender_id] = (acc[r.offender_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const leaderboardEntries: LeaderboardEntry[] = sortedPlayers.map(
        (player: GamePlayer & {
          user?: { display_name: string; avatar_url?: string | null };
          team?: { name: string; color?: string };
        }, index: number) => ({
          rank: index + 1,
          user_id: player.user_id,
          display_name: player.user?.display_name || 'Unknown',
          avatar_url: player.user?.avatar_url ?? null,
          score: player.current_score,
          streak_days: player.streak_days,
          curses_today: cursesTodayMap[player.user_id] || 0,
          is_you: player.user_id === user?.id,
          team_id: player.team_id,
          team_name: player.team?.name,
          team_color: player.team?.color,
        })
      );

      setEntries(leaderboardEntries);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [gameId, router]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏆</div>
      </div>
    );
  }

  const isTeamsMode = game?.mode === 'teams';

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Leaderboard</h1>
            <p className="text-sm text-gray-400">{game?.name}</p>
          </div>
        </div>

        {/* View toggle for teams mode */}
        {isTeamsMode && (
          <div className="flex bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('individual')}
              className={cn(
                'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                viewMode === 'individual'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Individual
            </button>
            <button
              onClick={() => setViewMode('teams')}
              className={cn(
                'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                viewMode === 'teams'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Teams
            </button>
          </div>
        )}
      </header>

      {/* Leaderboard */}
      <main className="px-6">
        {isTeamsMode && viewMode === 'teams' ? (
          <TeamLeaderboard entries={entries} />
        ) : (
          <Leaderboard entries={entries} showTeams={isTeamsMode} />
        )}
      </main>
    </div>
  );
}
