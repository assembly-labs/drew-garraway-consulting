'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  Settings,
  Sparkles,
  Share2,
  BarChart3,
} from 'lucide-react';
import { CurseButton } from '@/components/game/curse-button';
import { PlayerSelector, PlayerListPreview } from '@/components/game/player-selector';
import { ReportSuccess } from '@/components/game/report-success';
import { NiceWordModal } from '@/components/game/nice-word-modal';
import { AroundKidsToggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BottomSheet } from '@/components/ui/modal';
import { createClient } from '@/lib/supabase/client';
import { Game, GamePlayer, User } from '@/types/database';
import { useGameStore } from '@/stores/game-store';
import {
  calculateCursePoints,
  canReportCurse,
  isMultiplierDay,
  formatScore,
} from '@/lib/utils/scoring';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import { useDevModeData } from '@/lib/dev/use-dev-mode';

function GamePageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-4xl animate-bounce">🎮</div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<GamePageLoading />}>
      <GamePageContent />
    </Suspense>
  );
}

function GamePageContent() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId as string;

  const {
    currentGame,
    setCurrentGame,
    players,
    setPlayers,
    myPlayer,
    setMyPlayer,
    aroundKidsActive,
    setAroundKidsActive,
  } = useGameStore();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<GamePlayer | null>(null);
  const [showReportSuccess, setShowReportSuccess] = useState(false);
  const [lastReport, setLastReport] = useState<{
    offenderName: string;
    offenderAvatar?: string | null;
    points: number;
    multiplier: boolean;
  } | null>(null);
  const [showNiceWordModal, setShowNiceWordModal] = useState(false);
  const [niceWordUsesToday, setNiceWordUsesToday] = useState(0);
  const { isDevMode, mockUser, mockGame, mockPlayers } = useDevModeData();

  useEffect(() => {
    if (isDevMode) {
      setUser(mockUser);
      setCurrentGame(mockGame);
      setPlayers(mockPlayers);
      setMyPlayer(mockPlayers[0]);
      setAroundKidsActive(mockGame.around_kids_active);
      setIsLoading(false);
      return;
    }
    loadGame();
    setupRealtimeSubscription();
  }, [gameId, isDevMode]);

  const loadGame = async () => {
    try {
      const supabase = createClient();

      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/login');
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setUser(profile);

      // Get game with players
      const { data: game, error } = await supabase
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

      if (error || !game) {
        router.push('/home');
        return;
      }

      setCurrentGame(game);
      setPlayers(game.game_players);
      setAroundKidsActive(game.around_kids_active);

      // Find my player record
      const myPlayerRecord = game.game_players.find(
        (p: GamePlayer) => p.user_id === authUser.id
      );
      setMyPlayer(myPlayerRecord || null);

      // Get nice word uses today
      if (game.settings.nice_word_enabled) {
        const today = new Date().toISOString().split('T')[0];
        const { count } = await supabase
          .from('nice_word_logs')
          .select('*', { count: 'exact', head: true })
          .eq('game_id', gameId)
          .eq('user_id', authUser.id)
          .gte('timestamp', today);

        setNiceWordUsesToday(count || 0);
      }
    } catch (error) {
      console.error('Failed to load game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const supabase = createClient();

    // Subscribe to game changes
    const gameChannel = supabase
      .channel(`game:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          if (payload.new) {
            setCurrentGame(payload.new as Game);
            setAroundKidsActive((payload.new as Game).around_kids_active);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
          filter: `game_id=eq.${gameId}`,
        },
        () => {
          loadGame(); // Reload all players
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'curse_reports',
          filter: `game_id=eq.${gameId}`,
        },
        () => {
          loadGame(); // Reload to update scores
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gameChannel);
    };
  };

  const handleCurseButtonClick = () => {
    if (!currentGame) return;

    const reportCheck = canReportCurse(currentGame);
    if (!reportCheck.allowed) {
      // TODO: Show toast with reason
      return;
    }

    setShowReportSheet(true);
  };

  const handlePlayerSelect = (player: GamePlayer) => {
    setSelectedPlayer(player);
  };

  const confirmReport = async () => {
    if (!selectedPlayer || !currentGame || !user) return;

    try {
      const supabase = createClient();
      const { points, multiplier } = calculateCursePoints(currentGame);

      const { error } = await supabase.from('curse_reports').insert({
        game_id: currentGame.id,
        reporter_id: user.id,
        offender_id: selectedPlayer.user_id,
        multiplier_applied: multiplier,
        points_awarded: points,
        around_kids_active: aroundKidsActive,
      });

      if (error) throw error;

      // Show success animation
      setLastReport({
        offenderName: selectedPlayer.user?.display_name || 'Player',
        offenderAvatar: selectedPlayer.user?.avatar_url,
        points,
        multiplier: multiplier > 1,
      });
      setShowReportSheet(false);
      setSelectedPlayer(null);
      setShowReportSuccess(true);
    } catch (error) {
      console.error('Failed to report curse:', error);
    }
  };

  const toggleAroundKids = async (active: boolean) => {
    if (!currentGame) return;

    try {
      const supabase = createClient();
      await supabase
        .from('games')
        .update({ around_kids_active: active })
        .eq('id', currentGame.id);

      setAroundKidsActive(active);
    } catch (error) {
      console.error('Failed to toggle around kids mode:', error);
    }
  };

  const handleNiceWordUse = async () => {
    if (!currentGame || !user) return;

    const supabase = createClient();
    await supabase.from('nice_word_logs').insert({
      game_id: currentGame.id,
      user_id: user.id,
      word: currentGame.current_nice_word || '',
      points_awarded: currentGame.settings.nice_word_points,
    });

    setNiceWordUsesToday((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🤬</div>
          <p className="text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!currentGame) {
    return null;
  }

  const reportCheck = canReportCurse(currentGame);
  const multiplierActive = aroundKidsActive || isMultiplierDay(currentGame.settings);

  // Sort players by score for leaderboard
  const sortedPlayers = [...players].sort(
    (a, b) => a.current_score - b.current_score
  );
  const myRank = sortedPlayers.findIndex((p) => p.user_id === user?.id) + 1;

  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push('/home')}
            className="p-2 -ml-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Link href={`/game/${gameId}/leaderboard`}>
              <button className="p-2 text-gray-400 hover:text-white">
                <Trophy className="w-5 h-5" />
              </button>
            </Link>
            <Link href={`/game/${gameId}/stats`}>
              <button className="p-2 text-gray-400 hover:text-white">
                <BarChart3 className="w-5 h-5" />
              </button>
            </Link>
            {myPlayer?.is_admin && (
              <Link href={`/game/${gameId}/settings`}>
                <button className="p-2 text-gray-400 hover:text-white">
                  <Settings className="w-5 h-5" />
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-xl font-bold text-white">{currentGame.name}</h1>
          <p className="text-sm text-gray-400">
            {players.length} player{players.length !== 1 && 's'}
          </p>
        </div>
      </header>

      {/* Status bar */}
      {(multiplierActive || !reportCheck.allowed) && (
        <div className={cn(
          'mx-6 mb-4 p-3 rounded-xl text-center text-sm font-medium',
          !reportCheck.allowed
            ? 'bg-gray-700 text-gray-300'
            : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400'
        )}>
          {!reportCheck.allowed ? (
            <>🕊️ {reportCheck.reason}</>
          ) : (
            <>⚡ 2X POINTS ACTIVE</>
          )}
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* My score */}
        {myPlayer && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="text-sm text-gray-400 mb-1">Your Score</p>
            <p className="text-5xl font-black text-white">
              {formatScore(myPlayer.current_score)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Rank #{myRank} of {players.length}
            </p>
          </motion.div>
        )}

        {/* THE BIG CURSE BUTTON */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, delay: 0.2 }}
        >
          <CurseButton
            onClick={handleCurseButtonClick}
            disabled={currentGame.status !== 'active'}
            multiplierActive={multiplierActive}
            ceaseFireActive={!reportCheck.allowed}
          />
        </motion.div>

        {/* Around Kids toggle */}
        {currentGame.settings.around_kids_enabled && currentGame.status === 'active' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-xs mt-8"
          >
            <AroundKidsToggle
              enabled={aroundKidsActive}
              onChange={toggleAroundKids}
            />
          </motion.div>
        )}

        {/* Nice word button */}
        {currentGame.settings.nice_word_enabled &&
          currentGame.current_nice_word &&
          currentGame.status === 'active' && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => setShowNiceWordModal(true)}
              className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Nice Word: &ldquo;{currentGame.current_nice_word}&rdquo;
              </span>
            </motion.button>
          )}
      </main>

      {/* Leaderboard preview */}
      <div className="px-6 mt-auto">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Leaderboard</h3>
            <Link
              href={`/game/${gameId}/leaderboard`}
              className="text-sm text-red-400 hover:text-red-300"
            >
              See all
            </Link>
          </div>
          <PlayerListPreview
            players={players}
            currentUserId={user?.id || ''}
            limit={3}
          />
        </Card>
      </div>

      {/* Report bottom sheet */}
      <BottomSheet
        isOpen={showReportSheet}
        onClose={() => {
          setShowReportSheet(false);
          setSelectedPlayer(null);
        }}
        title="Who cursed?"
      >
        <div className="space-y-6">
          <PlayerSelector
            players={players}
            currentUserId={user?.id || ''}
            onSelect={handlePlayerSelect}
            selectedPlayerId={selectedPlayer?.id}
          />

          {selectedPlayer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">
                  Report {selectedPlayer.user?.display_name} for cursing?
                </p>
                <p className={cn(
                  'text-2xl font-bold',
                  multiplierActive ? 'text-yellow-400' : 'text-red-400'
                )}>
                  +{calculateCursePoints(currentGame).points} point
                  {calculateCursePoints(currentGame).points !== 1 && 's'}
                  {multiplierActive && ' (2X!)'}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setSelectedPlayer(null)}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={confirmReport} size="lg" className="flex-1">
                  Report! 🤬
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </BottomSheet>

      {/* Report success overlay */}
      <AnimatePresence>
        {showReportSuccess && lastReport && (
          <ReportSuccess
            offenderName={lastReport.offenderName}
            offenderAvatar={lastReport.offenderAvatar}
            pointsAwarded={lastReport.points}
            multiplierActive={lastReport.multiplier}
            onDismiss={() => setShowReportSuccess(false)}
          />
        )}
      </AnimatePresence>

      {/* Nice word modal */}
      <NiceWordModal
        isOpen={showNiceWordModal}
        onClose={() => setShowNiceWordModal(false)}
        word={currentGame.current_nice_word || ''}
        remainingUses={
          currentGame.settings.nice_word_daily_limit - niceWordUsesToday
        }
        maxUses={currentGame.settings.nice_word_daily_limit}
        pointsValue={currentGame.settings.nice_word_points}
        onUseWord={handleNiceWordUse}
      />

      {/* Lobby overlay for non-active games */}
      {currentGame.status === 'lobby' && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-40 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-sm"
          >
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Waiting for players
            </h2>
            <p className="text-gray-400 mb-6">
              {players.length} player{players.length !== 1 && 's'} joined.
              {myPlayer?.is_admin
                ? ' Start the game when ready!'
                : ' Waiting for the host to start.'}
            </p>

            <div className="space-y-3">
              {myPlayer?.is_admin && (
                <Button
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase
                      .from('games')
                      .update({ status: 'active', start_date: new Date().toISOString() })
                      .eq('id', currentGame.id);
                  }}
                  size="lg"
                  className="w-full"
                  disabled={players.length < 2}
                >
                  {players.length < 2 ? 'Need at least 2 players' : 'Start Game'}
                </Button>
              )}
              <Button
                onClick={() => {
                  const link = `${window.location.origin}/join?code=${currentGame.invite_code}`;
                  if (navigator.share) {
                    navigator.share({
                      title: `Join my F*** This App! game`,
                      text: `Join "${currentGame.name}"!`,
                      url: link,
                    });
                  } else {
                    navigator.clipboard.writeText(link);
                  }
                }}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Invite Link
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Code: <span className="font-mono font-bold">{currentGame.invite_code}</span>
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
