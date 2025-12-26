'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/game-store';
import {
  Home, LogIn, UserPlus, GraduationCap, Plus, Users, User,
  Trophy, BarChart3, Settings, Gamepad2, Play, Pause, Flag
} from 'lucide-react';

// Mock data for testing
const MOCK_USER = {
  id: 'user-test-001',
  email: 'test@example.com',
  display_name: 'Drew (Test)',
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_PLAYERS = [
  {
    id: 'player-001',
    game_id: 'game-test-001',
    user_id: 'user-test-001',
    team_id: null,
    current_score: 3,
    streak_days: 2,
    last_curse_date: new Date().toISOString(),
    is_admin: true,
    joined_at: new Date().toISOString(),
    user: MOCK_USER,
  },
  {
    id: 'player-002',
    game_id: 'game-test-001',
    user_id: 'user-test-002',
    team_id: null,
    current_score: 7,
    streak_days: 0,
    last_curse_date: new Date().toISOString(),
    is_admin: false,
    joined_at: new Date().toISOString(),
    user: {
      id: 'user-test-002',
      email: 'sarah@example.com',
      display_name: 'Sarah',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'player-003',
    game_id: 'game-test-001',
    user_id: 'user-test-003',
    team_id: null,
    current_score: 1,
    streak_days: 5,
    last_curse_date: null,
    is_admin: false,
    joined_at: new Date().toISOString(),
    user: {
      id: 'user-test-003',
      email: 'mike@example.com',
      display_name: 'Mike',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'player-004',
    game_id: 'game-test-001',
    user_id: 'user-test-004',
    team_id: null,
    current_score: 12,
    streak_days: 0,
    last_curse_date: new Date().toISOString(),
    is_admin: false,
    joined_at: new Date().toISOString(),
    user: {
      id: 'user-test-004',
      email: 'alex@example.com',
      display_name: 'Alex the Potty Mouth',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

const MOCK_GAME = {
  id: 'game-test-001',
  name: 'Office Swear Jar',
  invite_code: 'ABC123',
  creator_id: 'user-test-001',
  mode: 'ffa' as const,
  preset_type: 'office_mode' as const,
  settings: {
    multiplier_days: ['sunday'],
    holidays_2x: true,
    around_kids_enabled: true,
    immunity_windows: [],
    streak_rewards: true,
    nice_word_enabled: true,
    nice_word_daily_limit: 3,
    nice_word_points: -1,
  },
  status: 'active' as const,
  start_date: new Date().toISOString(),
  end_date: null,
  current_nice_word: 'Splendid',
  around_kids_active: false,
  cease_fire_until: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_LEADERBOARD = [
  { rank: 1, user_id: 'user-test-003', display_name: 'Mike', avatar_url: null, score: 1, streak_days: 5, curses_today: 0, is_you: false },
  { rank: 2, user_id: 'user-test-001', display_name: 'Drew (Test)', avatar_url: null, score: 3, streak_days: 2, curses_today: 1, is_you: true },
  { rank: 3, user_id: 'user-test-002', display_name: 'Sarah', avatar_url: null, score: 7, streak_days: 0, curses_today: 2, is_you: false },
  { rank: 4, user_id: 'user-test-004', display_name: 'Alex the Potty Mouth', avatar_url: null, score: 12, streak_days: 0, curses_today: 4, is_you: false },
];

// Screen definitions
const screens = [
  {
    category: 'Landing & Auth',
    icon: LogIn,
    items: [
      { name: 'Landing Page', path: '/', icon: Home, description: 'Marketing hero page' },
      { name: 'Login', path: '/login', icon: LogIn, description: 'Email/OAuth login' },
      { name: 'Sign Up', path: '/signup', icon: UserPlus, description: 'Registration' },
      { name: 'Onboarding', path: '/onboarding', icon: GraduationCap, description: '5-slide tutorial' },
    ],
  },
  {
    category: 'Main App',
    icon: Gamepad2,
    items: [
      { name: 'Home Dashboard', path: '/home', icon: Home, description: 'Your games list' },
      { name: 'Create Game', path: '/create', icon: Plus, description: 'Multi-step game creation' },
      { name: 'Join Game', path: '/join?code=ABC123', icon: Users, description: 'Join via code' },
      { name: 'Profile', path: '/profile', icon: User, description: 'User stats & settings' },
    ],
  },
  {
    category: 'Gameplay',
    icon: Play,
    items: [
      { name: 'Game Screen (Active)', path: '/game/game-test-001', icon: Gamepad2, description: 'Main curse button & reporting' },
      { name: 'Leaderboard', path: '/game/game-test-001/leaderboard', icon: Trophy, description: 'Player rankings' },
      { name: 'Stats & Recap', path: '/game/game-test-001/stats', icon: BarChart3, description: 'Weekly stats' },
      { name: 'Game Settings', path: '/game/game-test-001/settings', icon: Settings, description: 'Admin controls' },
    ],
  },
];

export default function DevPage() {
  const { setUser, setCurrentGame, setPlayers, setMyPlayer, setLeaderboard } = useGameStore();

  // Inject mock data into store on mount
  useEffect(() => {
    // Set dev mode cookie
    document.cookie = 'dev_mode=true; path=/; max-age=86400';

    setUser(MOCK_USER);
    setCurrentGame(MOCK_GAME);
    setPlayers(MOCK_PLAYERS);
    setMyPlayer(MOCK_PLAYERS[0]);
    setLeaderboard(MOCK_LEADERBOARD);

    // Also put mock data in localStorage for pages that read from Supabase
    localStorage.setItem('dev_mock_user', JSON.stringify(MOCK_USER));
    localStorage.setItem('dev_mock_game', JSON.stringify(MOCK_GAME));
    localStorage.setItem('dev_mock_players', JSON.stringify(MOCK_PLAYERS));
  }, [setUser, setCurrentGame, setPlayers, setMyPlayer, setLeaderboard]);

  // Helper to add dev param to paths
  const devPath = (path: string) => {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}dev=true`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111] pb-12">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 border-b border-gray-800">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">🧪</div>
            <div>
              <h1 className="text-2xl font-bold text-white">Dev Test Harness</h1>
              <p className="text-gray-400 text-sm">Navigate all screens with mock data</p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
              ✓ Mock User Loaded
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
              ✓ Mock Game Active
            </span>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
              4 Test Players
            </span>
          </div>
        </div>
      </header>

      {/* Screen Categories */}
      <main className="px-6 py-8 max-w-2xl mx-auto space-y-8">
        {screens.map((category, catIdx) => (
          <motion.section
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <category.icon className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">{category.category}</h2>
            </div>

            <div className="grid gap-3">
              {category.items.map((screen, idx) => (
                <motion.div
                  key={screen.path}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={devPath(screen.path)}
                    className="block p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-red-500/50 hover:bg-gray-800/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                        <screen.icon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{screen.name}</h3>
                        <p className="text-sm text-gray-500">{screen.description}</p>
                      </div>
                      <div className="text-gray-600 text-sm font-mono">{screen.path}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}

        {/* Quick Test Scenarios */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Flag className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">Test Scenarios</h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl">
              <h3 className="font-medium text-white mb-2">🎮 Full Game Flow</h3>
              <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                <li>Start at <Link href={devPath('/')} className="text-red-400 hover:underline">/</Link> (Landing)</li>
                <li>Go to <Link href={devPath('/onboarding')} className="text-red-400 hover:underline">/onboarding</Link> (Tutorial)</li>
                <li>View <Link href={devPath('/home')} className="text-red-400 hover:underline">/home</Link> (Dashboard)</li>
                <li>Enter <Link href={devPath('/game/game-test-001')} className="text-red-400 hover:underline">/game/game-test-001</Link> (Play!)</li>
              </ol>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
              <h3 className="font-medium text-white mb-2">👑 Admin Flow</h3>
              <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                <li>Visit <Link href={devPath('/create')} className="text-red-400 hover:underline">/create</Link> (Create game)</li>
                <li>Check <Link href={devPath('/game/game-test-001/settings')} className="text-red-400 hover:underline">/game/.../settings</Link></li>
              </ol>
            </div>

            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl">
              <h3 className="font-medium text-white mb-2">📊 Stats Flow</h3>
              <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                <li>View <Link href={devPath('/game/game-test-001/leaderboard')} className="text-red-400 hover:underline">Leaderboard</Link></li>
                <li>Check <Link href={devPath('/game/game-test-001/stats')} className="text-red-400 hover:underline">Weekly Stats</Link></li>
                <li>See <Link href={devPath('/profile')} className="text-red-400 hover:underline">Profile</Link> (all-time stats)</li>
              </ol>
            </div>
          </div>
        </motion.section>

        {/* Mock Data Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-gray-900 border border-gray-800 rounded-xl"
        >
          <h3 className="font-medium text-white mb-3">📦 Mock Data Loaded</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">User</p>
              <p className="text-white font-mono">{MOCK_USER.display_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Game</p>
              <p className="text-white font-mono">{MOCK_GAME.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Game Code</p>
              <p className="text-white font-mono">{MOCK_GAME.invite_code}</p>
            </div>
            <div>
              <p className="text-gray-500">Players</p>
              <p className="text-white font-mono">{MOCK_PLAYERS.length} in game</p>
            </div>
            <div>
              <p className="text-gray-500">Your Score</p>
              <p className="text-white font-mono">+{MOCK_PLAYERS[0].current_score}</p>
            </div>
            <div>
              <p className="text-gray-500">Nice Word</p>
              <p className="text-white font-mono">&ldquo;{MOCK_GAME.current_nice_word}&rdquo;</p>
            </div>
          </div>
        </motion.section>

        {/* Notes */}
        <div className="text-center text-gray-600 text-sm pt-4">
          <p>⚠️ Some screens may still try to fetch from Supabase.</p>
          <p>Mock data is injected via Zustand store + localStorage.</p>
        </div>
      </main>
    </div>
  );
}
