'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Users, ArrowRight, Trophy, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { Game, GamePlayer, User } from '@/types/database';
import { formatScore } from '@/lib/utils/scoring';
import { useDevModeData } from '@/lib/dev/use-dev-mode';

interface GameWithPlayers extends Game {
  game_players: (GamePlayer & { user: User })[];
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [games, setGames] = useState<GameWithPlayers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDevMode, mockUser, mockGamesWithPlayers } = useDevModeData();

  useEffect(() => {
    if (isDevMode) {
      setUser(mockUser);
      setGames(mockGamesWithPlayers as GameWithPlayers[]);
      setIsLoading(false);
      return;
    }
    loadUserAndGames();
  }, [isDevMode]);

  const loadUserAndGames = async () => {
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

      // Get user's games
      const { data: playerRecords } = await supabase
        .from('game_players')
        .select('game_id')
        .eq('user_id', authUser.id);

      if (playerRecords && playerRecords.length > 0) {
        const gameIds = playerRecords.map((p) => p.game_id);

        const { data: gamesData } = await supabase
          .from('games')
          .select(`
            *,
            game_players (
              *,
              user:users (*)
            )
          `)
          .in('id', gameIds)
          .order('updated_at', { ascending: false });

        setGames(gamesData || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeGames = games.filter((g) => g.status === 'active');
  const lobbyGames = games.filter((g) => g.status === 'lobby');
  const completedGames = games.filter((g) => g.status === 'completed');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🤬</div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Hey, {user?.display_name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-gray-400 text-sm">Ready to watch your mouth?</p>
          </div>
          <Link href="/profile">
            <Avatar
              src={user?.avatar_url}
              name={user?.display_name || 'User'}
              size="lg"
            />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 space-y-8">
        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/create">
              <Card className="h-32 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30 hover:border-red-500/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-red-400" />
                </div>
                <span className="font-semibold text-white">Create Game</span>
              </Card>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/join">
              <Card className="h-32 flex flex-col items-center justify-center gap-2 hover:border-gray-600 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <span className="font-semibold text-white">Join Game</span>
              </Card>
            </Link>
          </motion.div>
        </div>

        {/* Active Games */}
        {activeGames.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Active Games
            </h2>
            <div className="space-y-3">
              {activeGames.map((game) => (
                <GameCard key={game.id} game={game} userId={user?.id || ''} />
              ))}
            </div>
          </section>
        )}

        {/* Lobby Games */}
        {lobbyGames.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              Waiting to Start
            </h2>
            <div className="space-y-3">
              {lobbyGames.map((game) => (
                <GameCard key={game.id} game={game} userId={user?.id || ''} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {games.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-white mb-2">No games yet!</h3>
            <p className="text-gray-400 mb-6">
              Create a game and invite your friends to start playing.
            </p>
            <Button onClick={() => router.push('/create')} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Game
            </Button>
          </motion.div>
        )}

        {/* Completed Games */}
        {completedGames.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-500 mb-4">
              Completed Games
            </h2>
            <div className="space-y-3">
              {completedGames.slice(0, 3).map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  userId={user?.id || ''}
                  isCompleted
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// Game card component
interface GameCardProps {
  game: GameWithPlayers;
  userId: string;
  isCompleted?: boolean;
}

function GameCard({ game, userId, isCompleted }: GameCardProps) {
  const router = useRouter();
  const myPlayer = game.game_players.find((p) => p.user_id === userId);
  const playerCount = game.game_players.length;

  // Sort players by score for ranking
  const sortedPlayers = [...game.game_players].sort(
    (a, b) => a.current_score - b.current_score
  );
  const myRank = sortedPlayers.findIndex((p) => p.user_id === userId) + 1;

  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
      <Card
        onClick={() => router.push(`/game/${game.id}`)}
        className={`cursor-pointer ${isCompleted ? 'opacity-60' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">{game.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {playerCount} player{playerCount !== 1 && 's'}
              </span>
              {myPlayer && (
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  #{myRank}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {myPlayer && (
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {formatScore(myPlayer.current_score)}
                </div>
                <div className="text-xs text-gray-500">your score</div>
              </div>
            )}
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* Player avatars */}
        <div className="flex items-center mt-4 -space-x-2">
          {game.game_players.slice(0, 5).map((player) => (
            <Avatar
              key={player.id}
              src={player.user?.avatar_url}
              name={player.user?.display_name || 'Player'}
              size="sm"
              className="ring-2 ring-gray-900"
            />
          ))}
          {playerCount > 5 && (
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 ring-2 ring-gray-900">
              +{playerCount - 5}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
