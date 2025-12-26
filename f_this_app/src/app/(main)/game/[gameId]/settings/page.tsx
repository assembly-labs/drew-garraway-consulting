'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Clock,
  Sparkles,
  Users,
  Trash2,
  Square,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Avatar } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { Game, GamePlayer, User } from '@/types/database';
import { NICE_WORD_SUGGESTIONS } from '@/lib/constants/presets';
import { cn } from '@/lib/utils/cn';

export default function GameSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId as string;

  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<(GamePlayer & { user: User })[]>([]);
  const [myPlayer, setMyPlayer] = useState<GamePlayer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Modals
  const [showNiceWordModal, setShowNiceWordModal] = useState(false);
  const [showCeaseFireModal, setShowCeaseFireModal] = useState(false);
  const [showEndGameModal, setShowEndGameModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Form state
  const [newNiceWord, setNewNiceWord] = useState('');
  const [ceaseFireHours, setCeaseFireHours] = useState(1);

  useEffect(() => {
    loadGame();
  }, [gameId]);

  const loadGame = async () => {
    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

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
      setPlayers(gameData.game_players);
      setMyPlayer(
        gameData.game_players.find((p: GamePlayer) => p.user_id === user.id) || null
      );
    } catch (error) {
      console.error('Failed to load game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteLink = async () => {
    if (!game) return;
    const link = `${window.location.origin}/join?code=${game.invite_code}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateNiceWord = async () => {
    if (!game || !newNiceWord) return;

    const supabase = createClient();
    await supabase
      .from('games')
      .update({ current_nice_word: newNiceWord })
      .eq('id', game.id);

    setGame({ ...game, current_nice_word: newNiceWord });
    setShowNiceWordModal(false);
    setNewNiceWord('');
  };

  const activateCeaseFire = async () => {
    if (!game) return;

    const until = new Date();
    until.setHours(until.getHours() + ceaseFireHours);

    const supabase = createClient();
    await supabase
      .from('games')
      .update({ cease_fire_until: until.toISOString() })
      .eq('id', game.id);

    setGame({ ...game, cease_fire_until: until.toISOString() });
    setShowCeaseFireModal(false);
  };

  const endCeaseFire = async () => {
    if (!game) return;

    const supabase = createClient();
    await supabase
      .from('games')
      .update({ cease_fire_until: null })
      .eq('id', game.id);

    setGame({ ...game, cease_fire_until: null });
  };

  const endGame = async () => {
    if (!game) return;

    const supabase = createClient();
    await supabase
      .from('games')
      .update({ status: 'completed', end_date: new Date().toISOString() })
      .eq('id', game.id);

    router.push('/home');
  };

  const leaveGame = async () => {
    if (!myPlayer) return;

    const supabase = createClient();
    await supabase
      .from('game_players')
      .delete()
      .eq('id', myPlayer.id);

    router.push('/home');
  };

  const removePlayer = async (playerId: string) => {
    const supabase = createClient();
    await supabase.from('game_players').delete().eq('id', playerId);
    setPlayers(players.filter((p) => p.id !== playerId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">⚙️</div>
      </div>
    );
  }

  const isAdmin = myPlayer?.is_admin;
  const ceaseFireActive = game?.cease_fire_until && new Date(game.cease_fire_until) > new Date();

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
            <h1 className="text-xl font-bold text-white">Game Settings</h1>
            <p className="text-sm text-gray-400">{game?.name}</p>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {/* Invite code */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Invite Code</h3>
            <Button
              onClick={copyInviteLink}
              variant="ghost"
              size="sm"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-1" />
              ) : (
                <Copy className="w-4 h-4 mr-1" />
              )}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
          <p className="text-3xl font-mono font-bold text-white tracking-widest text-center">
            {game?.invite_code}
          </p>
        </Card>

        {/* Admin controls */}
        {isAdmin && (
          <>
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                Admin Controls
              </h2>

              <div className="space-y-3">
                {/* Nice word */}
                {game?.settings.nice_word_enabled && (
                  <Card
                    onClick={() => setShowNiceWordModal(true)}
                    className="flex items-center justify-between cursor-pointer hover:border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Nice Word</p>
                        <p className="text-sm text-gray-400">
                          Current: &ldquo;{game.current_nice_word || 'Not set'}&rdquo;
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Cease fire */}
                <Card
                  onClick={() => ceaseFireActive ? endCeaseFire() : setShowCeaseFireModal(true)}
                  className={cn(
                    'flex items-center justify-between cursor-pointer',
                    ceaseFireActive
                      ? 'border-yellow-500/50 hover:border-yellow-500'
                      : 'hover:border-gray-600'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      ceaseFireActive ? 'bg-yellow-500/20' : 'bg-gray-700'
                    )}>
                      <Clock className={cn(
                        'w-5 h-5',
                        ceaseFireActive ? 'text-yellow-400' : 'text-gray-400'
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-white">Cease-Fire</p>
                      <p className="text-sm text-gray-400">
                        {ceaseFireActive
                          ? `Active until ${new Date(game!.cease_fire_until!).toLocaleTimeString()}`
                          : 'Pause reporting temporarily'}
                      </p>
                    </div>
                  </div>
                  {ceaseFireActive && (
                    <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                      ACTIVE
                    </span>
                  )}
                </Card>

                {/* End game */}
                {game?.status === 'active' && (
                  <Card
                    onClick={() => setShowEndGameModal(true)}
                    className="flex items-center justify-between cursor-pointer hover:border-red-500/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <Square className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">End Game</p>
                        <p className="text-sm text-gray-400">
                          Finish the game and see final results
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Players */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Players ({players.length})
              </h2>

              <div className="space-y-2">
                {players.map((player) => (
                  <Card key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={player.user?.avatar_url}
                        name={player.user?.display_name || 'Player'}
                        size="md"
                      />
                      <div>
                        <p className="font-medium text-white">
                          {player.user?.display_name}
                          {player.is_admin && (
                            <span className="ml-2 text-xs text-red-400">(Admin)</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-400">
                          Score: +{player.current_score}
                        </p>
                      </div>
                    </div>
                    {!player.is_admin && (
                      <Button
                        onClick={() => removePlayer(player.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Leave game */}
        {!isAdmin && (
          <Button
            onClick={() => setShowLeaveModal(true)}
            variant="outline"
            size="lg"
            className="w-full text-red-400 border-red-400/50 hover:bg-red-400/10"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Leave Game
          </Button>
        )}
      </main>

      {/* Nice word modal */}
      <Modal
        isOpen={showNiceWordModal}
        onClose={() => setShowNiceWordModal(false)}
        title="Set Nice Word"
      >
        <div className="space-y-4">
          <Input
            placeholder="Enter a nice word..."
            value={newNiceWord}
            onChange={(e) => setNewNiceWord(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {NICE_WORD_SUGGESTIONS.slice(0, 6).map((word) => (
              <button
                key={word}
                onClick={() => setNewNiceWord(word)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm transition-colors',
                  newNiceWord === word
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                )}
              >
                {word}
              </button>
            ))}
          </div>
          <Button
            onClick={updateNiceWord}
            size="lg"
            className="w-full"
            disabled={!newNiceWord}
          >
            Set Word
          </Button>
        </div>
      </Modal>

      {/* Cease fire modal */}
      <Modal
        isOpen={showCeaseFireModal}
        onClose={() => setShowCeaseFireModal(false)}
        title="Activate Cease-Fire"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Pause curse reporting for a set amount of time.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white">Duration:</span>
            <div className="flex gap-2">
              {[1, 2, 4, 8].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setCeaseFireHours(hours)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    ceaseFireHours === hours
                      ? 'bg-yellow-500 text-yellow-900'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  )}
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>
          <Button onClick={activateCeaseFire} size="lg" className="w-full">
            Activate Cease-Fire
          </Button>
        </div>
      </Modal>

      {/* End game modal */}
      <Modal
        isOpen={showEndGameModal}
        onClose={() => setShowEndGameModal(false)}
        title="End Game?"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Are you sure you want to end this game? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowEndGameModal(false)}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={endGame}
              size="lg"
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              End Game
            </Button>
          </div>
        </div>
      </Modal>

      {/* Leave game modal */}
      <Modal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Leave Game?"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Are you sure you want to leave this game? Your score will be removed.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowLeaveModal(false)}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={leaveGame}
              size="lg"
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              Leave Game
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
