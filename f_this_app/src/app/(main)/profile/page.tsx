'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Camera,
  LogOut,
  Trophy,
  Flame,
  Target,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, StatCard } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { createClient } from '@/lib/supabase/client';
import { User } from '@/types/database';
import { useDevModeData } from '@/lib/dev/use-dev-mode';

interface AllTimeStats {
  total_games: number;
  total_wins: number;
  total_curses: number;
  total_reports_filed: number;
  longest_streak: number;
  total_nice_words: number;
}

const MOCK_PROFILE_STATS: AllTimeStats = {
  total_games: 5,
  total_wins: 2,
  total_curses: 47,
  total_reports_filed: 63,
  longest_streak: 5,
  total_nice_words: 12,
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<AllTimeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { isDevMode, mockUser } = useDevModeData();

  useEffect(() => {
    if (isDevMode) {
      setUser(mockUser);
      setNewDisplayName(mockUser.display_name);
      setStats(MOCK_PROFILE_STATS);
      setIsLoading(false);
      return;
    }
    loadProfile();
  }, [isDevMode]);

  const loadProfile = async () => {
    try {
      const supabase = createClient();

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
      setNewDisplayName(profile?.display_name || '');

      // Get all-time stats
      const { data: gamePlayerRecords } = await supabase
        .from('game_players')
        .select('*, game:games(*)')
        .eq('user_id', authUser.id);

      const { count: totalCurses } = await supabase
        .from('curse_reports')
        .select('*', { count: 'exact', head: true })
        .eq('offender_id', authUser.id);

      const { count: totalReports } = await supabase
        .from('curse_reports')
        .select('*', { count: 'exact', head: true })
        .eq('reporter_id', authUser.id);

      const { count: totalNiceWords } = await supabase
        .from('nice_word_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authUser.id);

      // Calculate wins (rank 1 in completed games)
      let wins = 0;
      let longestStreak = 0;

      if (gamePlayerRecords) {
        for (const record of gamePlayerRecords) {
          if (record.streak_days > longestStreak) {
            longestStreak = record.streak_days;
          }

          if (record.game?.status === 'completed') {
            // Check if this player had the lowest score
            const { data: allPlayers } = await supabase
              .from('game_players')
              .select('current_score')
              .eq('game_id', record.game_id)
              .order('current_score', { ascending: true })
              .limit(1)
              .single();

            if (allPlayers && record.current_score === allPlayers.current_score) {
              wins++;
            }
          }
        }
      }

      setStats({
        total_games: gamePlayerRecords?.length || 0,
        total_wins: wins,
        total_curses: totalCurses || 0,
        total_reports_filed: totalReports || 0,
        longest_streak: longestStreak,
        total_nice_words: totalNiceWords || 0,
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user || !newDisplayName.trim()) return;

    setIsSaving(true);
    try {
      const supabase = createClient();
      await supabase
        .from('users')
        .update({ display_name: newDisplayName.trim() })
        .eq('id', user.id);

      setUser({ ...user, display_name: newDisplayName.trim() });
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">👤</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </header>

      <main className="px-6 space-y-8">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="relative inline-block mb-4">
            <Avatar
              src={user?.avatar_url}
              name={user?.display_name || 'User'}
              size="xl"
              className="w-24 h-24"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {user?.display_name}
          </h1>
          <p className="text-gray-400 text-sm mb-4">{user?.email}</p>
          <Button
            onClick={() => setShowEditModal(true)}
            variant="outline"
            size="sm"
          >
            Edit Profile
          </Button>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold text-white mb-4">All-Time Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                label="Games Played"
                value={stats.total_games}
                icon={<Target className="w-5 h-5 text-blue-400" />}
              />
              <StatCard
                label="Wins"
                value={stats.total_wins}
                icon={<Trophy className="w-5 h-5 text-yellow-400" />}
              />
              <StatCard
                label="Total Curses"
                value={stats.total_curses}
                icon={<span className="text-xl">🤬</span>}
              />
              <StatCard
                label="Reports Filed"
                value={stats.total_reports_filed}
                icon={<span className="text-xl">🕵️</span>}
              />
              <StatCard
                label="Longest Streak"
                value={`${stats.longest_streak} days`}
                icon={<Flame className="w-5 h-5 text-orange-400" />}
              />
              <StatCard
                label="Nice Words Used"
                value={stats.total_nice_words}
                icon={<Star className="w-5 h-5 text-green-400" />}
              />
            </div>
          </motion.div>
        )}

        {/* Badges/Trophies placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Badges</h2>
          <Card className="text-center py-8 text-gray-400">
            <span className="text-4xl mb-2 block">🏅</span>
            <p>Coming soon!</p>
            <p className="text-sm">Play more games to earn badges.</p>
          </Card>
        </motion.div>

        {/* Sign out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={signOut}
            variant="outline"
            size="lg"
            className="w-full text-red-400 border-red-400/50 hover:bg-red-400/10"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </main>

      {/* Edit profile modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <Input
            label="Display Name"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            placeholder="Your name"
          />
          <Button
            onClick={updateProfile}
            size="lg"
            className="w-full"
            isLoading={isSaving}
            disabled={!newDisplayName.trim()}
          >
            Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  );
}
