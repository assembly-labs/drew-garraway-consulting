'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Card, StatCard } from '@/components/ui/card';
import { WeeklyRecap } from '@/components/game/weekly-recap';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Game, GamePlayer, WeeklyStats } from '@/types/database';
import { formatScore } from '@/lib/utils/scoring';
import { cn } from '@/lib/utils/cn';
import { useDevModeData } from '@/lib/dev/use-dev-mode';
import { MOCK_WEEKLY_STATS, MOCK_REPORTS } from '@/lib/dev/mock-data';

function StatsPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-4xl animate-bounce">📊</div>
    </div>
  );
}

export default function StatsPage() {
  return (
    <Suspense fallback={<StatsPageLoading />}>
      <StatsPageContent />
    </Suspense>
  );
}

function StatsPageContent() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId as string;

  const [game, setGame] = useState<Game | null>(null);
  const [myPlayer, setMyPlayer] = useState<GamePlayer | null>(null);
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [showRecap, setShowRecap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isDevMode, mockGame, mockPlayers } = useDevModeData();

  // Activity feed
  interface ReportWithDetails {
    id: string;
    timestamp: string;
    reporter_id: string;
    offender_id: string;
    points_awarded: number;
    multiplier_applied: number;
    reporter?: { display_name: string };
    offender?: { display_name: string };
  }
  const [recentReports, setRecentReports] = useState<ReportWithDetails[]>([]);

  useEffect(() => {
    if (isDevMode) {
      setGame(mockGame);
      setMyPlayer(mockPlayers[0]);
      setStats(MOCK_WEEKLY_STATS);
      setRecentReports(MOCK_REPORTS.map(r => ({
        id: r.id,
        timestamp: r.timestamp,
        reporter_id: r.reporter_id,
        offender_id: r.offender_id,
        points_awarded: r.points_awarded,
        multiplier_applied: r.multiplier_applied,
        reporter: r.reporter ? { display_name: r.reporter.display_name } : undefined,
        offender: r.offender ? { display_name: r.offender.display_name } : undefined,
      })));
      setIsLoading(false);
      return;
    }
    loadStats();
  }, [gameId, isDevMode]);

  const loadStats = async () => {
    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get game and player data
      const { data: gameData } = await supabase
        .from('games')
        .select(`
          *,
          game_players (
            *,
            user:users (*)
          )
        `)
        .eq('id', gameId)
        .single();

      if (!gameData) {
        router.push('/home');
        return;
      }

      setGame(gameData);

      const myPlayerData = gameData.game_players.find(
        (p: GamePlayer) => p.user_id === user.id
      );
      setMyPlayer(myPlayerData);

      // Get this week's data
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: weekReports } = await supabase
        .from('curse_reports')
        .select(`
          *,
          reporter:users!curse_reports_reporter_id_fkey (display_name),
          offender:users!curse_reports_offender_id_fkey (display_name)
        `)
        .eq('game_id', gameId)
        .gte('timestamp', weekAgo.toISOString())
        .order('timestamp', { ascending: false });

      const { data: weekNiceWords } = await supabase
        .from('nice_word_logs')
        .select('*')
        .eq('game_id', gameId)
        .eq('user_id', user.id)
        .gte('timestamp', weekAgo.toISOString());

      // Calculate stats
      const myCurses = (weekReports || []).filter(
        (r) => r.offender_id === user.id
      );
      const myReports = (weekReports || []).filter(
        (r) => r.reporter_id === user.id
      );
      const multiplierCurses = myCurses.filter((r) => r.multiplier_applied > 1);

      // Get clean days (days with no curses)
      const daysWithCurses = new Set(
        myCurses.map((r) => new Date(r.timestamp).toDateString())
      );
      const cleanDays = 7 - daysWithCurses.size;

      // Rank calculation
      const sortedPlayers = [...gameData.game_players].sort(
        (a: GamePlayer, b: GamePlayer) => a.current_score - b.current_score
      );
      const rank = sortedPlayers.findIndex((p) => p.user_id === user.id) + 1;

      // Most reported player
      const reportCounts = (weekReports || []).reduce((acc, r) => {
        acc[r.offender_id] = acc[r.offender_id] || { name: r.offender?.display_name, count: 0 };
        acc[r.offender_id].count++;
        return acc;
      }, {} as Record<string, { name: string; count: number }>);

      type CountRecord = { name: string; count: number };
      const mostReported = (Object.values(reportCounts) as CountRecord[]).sort(
        (a, b) => b.count - a.count
      )[0] as CountRecord | undefined;

      // Top snitch
      const snitchCounts = (weekReports || []).reduce((acc, r) => {
        acc[r.reporter_id] = acc[r.reporter_id] || { name: r.reporter?.display_name, count: 0 };
        acc[r.reporter_id].count++;
        return acc;
      }, {} as Record<string, { name: string; count: number }>);

      const topSnitch = (Object.values(snitchCounts) as CountRecord[]).sort(
        (a, b) => b.count - a.count
      )[0] as CountRecord | undefined;

      // Winner and loser
      const winner = sortedPlayers[0];
      const loser = sortedPlayers[sortedPlayers.length - 1];

      setStats({
        total_curses: myCurses.length,
        curses_reported_by_you: myReports.length,
        multiplier_curses: multiplierCurses.length,
        nice_words_used: (weekNiceWords || []).length,
        clean_days: cleanDays,
        streak_days: myPlayerData?.streak_days || 0,
        rank,
        total_players: gameData.game_players.length,
        trend: 'same', // TODO: Compare with last week
        trend_amount: 0,
        most_reported_player: mostReported || null,
        top_snitch: topSnitch || null,
        winner: winner
          ? { name: winner.user?.display_name || 'Unknown', score: winner.current_score }
          : null,
        biggest_loser:
          loser && loser !== winner
            ? { name: loser.user?.display_name || 'Unknown', score: loser.current_score }
            : null,
      });

      // Recent activity
      setRecentReports((weekReports || []).slice(0, 10));
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">📊</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Stats</h1>
            <p className="text-sm text-gray-400">{game?.name}</p>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {/* Weekly recap button */}
        <Button
          onClick={() => setShowRecap(true)}
          variant="outline"
          size="lg"
          className="w-full"
        >
          📊 View Weekly Recap
        </Button>

        {/* Quick stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4"
          >
            <StatCard
              label="Your Curses"
              value={stats.total_curses}
              icon={<span className="text-xl">🤬</span>}
            />
            <StatCard
              label="Reports Filed"
              value={stats.curses_reported_by_you}
              icon={<span className="text-xl">🕵️</span>}
            />
            <StatCard
              label="Clean Days"
              value={stats.clean_days}
              icon={<span className="text-xl">😇</span>}
            />
            <StatCard
              label="Nice Words"
              value={stats.nice_words_used}
              icon={<span className="text-xl">✨</span>}
            />
          </motion.div>
        )}

        {/* Your rank */}
        {stats && myPlayer && (
          <Card className="text-center py-6">
            <p className="text-sm text-gray-400 mb-2">Your Current Rank</p>
            <p className="text-4xl font-black text-white mb-1">
              #{stats.rank}
              <span className="text-lg text-gray-400 font-normal ml-2">
                of {stats.total_players}
              </span>
            </p>
            <p className="text-lg font-bold text-red-400">
              {formatScore(myPlayer.current_score)}
            </p>
          </Card>
        )}

        {/* Recent activity */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {recentReports.length === 0 ? (
              <Card className="text-center py-8 text-gray-400">
                No reports this week yet
              </Card>
            ) : (
              recentReports.map((report) => (
                <Card key={report.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤬</span>
                    <div>
                      <p className="text-sm text-white">
                        <span className="font-semibold">{report.reporter?.display_name}</span>
                        {' reported '}
                        <span className="font-semibold">{report.offender?.display_name}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(report.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    'text-sm font-bold',
                    report.multiplier_applied > 1 ? 'text-yellow-400' : 'text-red-400'
                  )}>
                    +{report.points_awarded}
                  </span>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Weekly recap modal */}
      {stats && myPlayer && (
        <WeeklyRecap
          isOpen={showRecap}
          onClose={() => setShowRecap(false)}
          stats={stats}
          playerName={myPlayer.user?.display_name || 'Player'}
        />
      )}
    </div>
  );
}
