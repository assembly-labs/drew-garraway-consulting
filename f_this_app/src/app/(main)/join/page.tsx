'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { Game, GamePlayer, User } from '@/types/database';

interface GameWithPlayers extends Game {
  game_players: (GamePlayer & { user: User })[];
  creator: User;
}

function JoinGameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code');

  const [code, setCode] = useState(codeFromUrl || '');
  const [game, setGame] = useState<GameWithPlayers | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (codeFromUrl) {
      lookupGame(codeFromUrl);
    }
  }, [codeFromUrl]);

  const lookupGame = async (inviteCode: string) => {
    if (inviteCode.length < 6) return;

    setIsLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data, error: lookupError } = await supabase
        .from('games')
        .select(`
          *,
          creator:users!games_creator_id_fkey (*),
          game_players (
            *,
            user:users (*)
          )
        `)
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (lookupError || !data) {
        setError('Game not found. Check the code and try again.');
        setGame(null);
      } else {
        setGame(data as GameWithPlayers);
      }
    } catch (err) {
      setError('Failed to look up game.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (value: string) => {
    const upperValue = value.toUpperCase().slice(0, 6);
    setCode(upperValue);
    setError('');

    if (upperValue.length === 6) {
      lookupGame(upperValue);
    } else {
      setGame(null);
    }
  };

  const joinGame = async () => {
    if (!game) return;

    setIsJoining(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Check if already in game
      const existingPlayer = game.game_players.find(
        (p) => p.user_id === user.id
      );

      if (existingPlayer) {
        router.push(`/game/${game.id}`);
        return;
      }

      // Join the game
      const { error: joinError } = await supabase
        .from('game_players')
        .insert({
          game_id: game.id,
          user_id: user.id,
        });

      if (joinError) throw joinError;

      router.push(`/game/${game.id}`);
    } catch (err) {
      console.error('Failed to join game:', err);
      setError('Failed to join game. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      {/* Header */}
      <button
        onClick={() => router.push('/home')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Join a game</h1>
            <p className="text-gray-400">
              Enter the invite code to join your friends.
            </p>
          </div>

          {/* Code input */}
          <div>
            <Input
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="XXXXXX"
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={6}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-2 text-center"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4 animate-bounce">🔍</div>
              <p className="text-gray-400">Looking for game...</p>
            </div>
          )}

          {/* Game preview */}
          {game && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{game.name}</h2>
                    <p className="text-sm text-gray-400">
                      Created by {game.creator?.display_name}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    game.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : game.status === 'lobby'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {game.status === 'active' && 'In Progress'}
                    {game.status === 'lobby' && 'Waiting to Start'}
                    {game.status === 'completed' && 'Completed'}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>
                    {game.game_players.length} player
                    {game.game_players.length !== 1 && 's'}
                  </span>
                </div>

                {/* Player avatars */}
                <div className="flex items-center -space-x-2">
                  {game.game_players.slice(0, 6).map((player) => (
                    <Avatar
                      key={player.id}
                      src={player.user?.avatar_url}
                      name={player.user?.display_name || 'Player'}
                      size="md"
                      className="ring-2 ring-gray-900"
                    />
                  ))}
                  {game.game_players.length > 6 && (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm text-gray-400 ring-2 ring-gray-900">
                      +{game.game_players.length - 6}
                    </div>
                  )}
                </div>

                {/* Game settings preview */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700">
                  <span className="px-2 py-1 rounded-md bg-gray-700 text-gray-300 text-xs">
                    {game.mode === 'ffa' ? 'Free-for-All' : 'Teams'}
                  </span>
                  {game.settings.nice_word_enabled && (
                    <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs">
                      Nice Word
                    </span>
                  )}
                  {game.settings.around_kids_enabled && (
                    <span className="px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-400 text-xs">
                      Around Kids Mode
                    </span>
                  )}
                </div>
              </Card>

              <Button
                onClick={joinGame}
                size="lg"
                className="w-full mt-6"
                isLoading={isJoining}
                disabled={game.status === 'completed'}
              >
                {game.status === 'completed' ? (
                  'Game has ended'
                ) : (
                  <>
                    Join Game
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function JoinGamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🎮</div>
      </div>
    }>
      <JoinGameContent />
    </Suspense>
  );
}
