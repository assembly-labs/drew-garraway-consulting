'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Users,
  User,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, PresetCard } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { createClient } from '@/lib/supabase/client';
import { GAME_PRESETS, FUNNY_GAME_NAMES, DAYS_OF_WEEK, NICE_WORD_SUGGESTIONS } from '@/lib/constants/presets';
import { PresetType, GameMode, GameSettings } from '@/types/database';
import { cn } from '@/lib/utils/cn';

type Step = 'name' | 'preset' | 'custom' | 'mode' | 'teams' | 'invite';

export default function CreateGamePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('name');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form state
  const [gameName, setGameName] = useState('');
  const [preset, setPreset] = useState<PresetType>('friend_group');
  const [mode, setMode] = useState<GameMode>('ffa');
  const [settings, setSettings] = useState<GameSettings>(
    GAME_PRESETS.friend_group.settings
  );
  const [teams, setTeams] = useState<{ name: string; color: string }[]>([
    { name: 'Team 1', color: '#EF4444' },
    { name: 'Team 2', color: '#3B82F6' },
  ]);

  // Created game
  const [gameId, setGameId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const generateRandomName = () => {
    const randomName =
      FUNNY_GAME_NAMES[Math.floor(Math.random() * FUNNY_GAME_NAMES.length)];
    setGameName(randomName);
  };

  const handlePresetSelect = (presetKey: PresetType) => {
    setPreset(presetKey);
    setSettings(GAME_PRESETS[presetKey].settings);
  };

  const handleNext = () => {
    const steps: Step[] = ['name', 'preset', mode === 'teams' ? 'teams' : 'mode', 'invite'];
    const currentIndex = steps.indexOf(step);

    if (step === 'preset' && preset === 'custom') {
      setStep('custom');
    } else if (step === 'custom') {
      setStep('mode');
    } else if (step === 'mode' && mode === 'teams') {
      setStep('teams');
    } else if (step === 'mode' || step === 'teams') {
      createGame();
    } else if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepsMap: Record<Step, Step | null> = {
      name: null,
      preset: 'name',
      custom: 'preset',
      mode: preset === 'custom' ? 'custom' : 'preset',
      teams: 'mode',
      invite: mode === 'teams' ? 'teams' : 'mode',
    };

    const prevStep = stepsMap[step];
    if (prevStep) {
      setStep(prevStep);
    } else {
      router.push('/home');
    }
  };

  const createGame = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Create the game
      const { data: game, error: gameError } = await supabase
        .from('games')
        .insert({
          name: gameName || FUNNY_GAME_NAMES[Math.floor(Math.random() * FUNNY_GAME_NAMES.length)],
          creator_id: user.id,
          mode,
          preset_type: preset,
          settings,
          current_nice_word: settings.nice_word_enabled
            ? NICE_WORD_SUGGESTIONS[Math.floor(Math.random() * NICE_WORD_SUGGESTIONS.length)]
            : null,
        })
        .select()
        .single();

      if (gameError) throw gameError;

      // Create teams if teams mode
      if (mode === 'teams') {
        const teamInserts = teams.map((team) => ({
          game_id: game.id,
          name: team.name,
          color: team.color,
        }));

        const { error: teamsError } = await supabase
          .from('teams')
          .insert(teamInserts);

        if (teamsError) throw teamsError;
      }

      // Add creator as first player and admin
      const { error: playerError } = await supabase
        .from('game_players')
        .insert({
          game_id: game.id,
          user_id: user.id,
          is_admin: true,
        });

      if (playerError) throw playerError;

      setGameId(game.id);
      setInviteCode(game.invite_code);
      setStep('invite');
    } catch (error) {
      console.error('Failed to create game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteLink = async () => {
    const link = `${window.location.origin}/join?code=${inviteCode}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareInvite = async () => {
    const link = `${window.location.origin}/join?code=${inviteCode}`;
    if (navigator.share) {
      await navigator.share({
        title: `Join my F*** This App! game`,
        text: `Join "${gameName}" and let's see who can keep their mouth clean!`,
        url: link,
      });
    } else {
      copyInviteLink();
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <span className="text-sm text-gray-500">
          {step === 'name' && 'Step 1 of 4'}
          {step === 'preset' && 'Step 2 of 4'}
          {step === 'custom' && 'Step 2 of 4'}
          {step === 'mode' && 'Step 3 of 4'}
          {step === 'teams' && 'Step 4 of 4'}
          {step === 'invite' && 'Done!'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {/* Step: Name */}
          {step === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Name your game
                </h1>
                <p className="text-gray-400">
                  Give it a fun name or let us pick one for you.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Enter game name..."
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="text-lg"
                />
                <Button
                  onClick={generateRandomName}
                  variant="outline"
                  className="w-full"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Generate random name
                </Button>
              </div>

              {gameName && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <p className="text-gray-400 text-sm mb-2">Your game:</p>
                  <p className="text-2xl font-bold text-white">{gameName}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step: Preset */}
          {step === 'preset' && (
            <motion.div
              key="preset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Choose your rules
                </h1>
                <p className="text-gray-400">
                  Pick a preset or customize everything.
                </p>
              </div>

              <div className="space-y-3">
                {(Object.keys(GAME_PRESETS) as PresetType[]).map((key) => (
                  <PresetCard
                    key={key}
                    title={GAME_PRESETS[key].name}
                    description={GAME_PRESETS[key].description}
                    selected={preset === key}
                    onClick={() => handlePresetSelect(key)}
                    icon={
                      <span className="text-2xl">
                        {key === 'family_friendly' && '👨‍👩‍👧‍👦'}
                        {key === 'office_mode' && '💼'}
                        {key === 'friend_group' && '🍻'}
                        {key === 'hardcore' && '💀'}
                        {key === 'custom' && '⚙️'}
                      </span>
                    }
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Step: Custom Settings */}
          {step === 'custom' && (
            <motion.div
              key="custom"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Custom rules
                </h1>
                <p className="text-gray-400">
                  Configure exactly how you want to play.
                </p>
              </div>

              <div className="space-y-6">
                {/* 2x Days */}
                <Card>
                  <h3 className="font-semibold text-white mb-4">2x Point Days</h3>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        key={day.value}
                        onClick={() => {
                          const newDays = settings.multiplier_days.includes(day.value)
                            ? settings.multiplier_days.filter((d) => d !== day.value)
                            : [...settings.multiplier_days, day.value];
                          setSettings({ ...settings, multiplier_days: newDays });
                        }}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                          settings.multiplier_days.includes(day.value)
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        )}
                      >
                        {day.label.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Toggles */}
                <Card className="space-y-4">
                  <Toggle
                    enabled={settings.holidays_2x}
                    onChange={(v) => setSettings({ ...settings, holidays_2x: v })}
                    label="2x on Holidays"
                    description="Double points on major holidays"
                  />
                  <Toggle
                    enabled={settings.around_kids_enabled}
                    onChange={(v) => setSettings({ ...settings, around_kids_enabled: v })}
                    label="Around Kids Mode"
                    description="Allow players to enable 2x mode"
                  />
                  <Toggle
                    enabled={settings.streak_rewards}
                    onChange={(v) => setSettings({ ...settings, streak_rewards: v })}
                    label="Streak Rewards"
                    description="Bonus points for clean streaks"
                  />
                  <Toggle
                    enabled={settings.nice_word_enabled}
                    onChange={(v) => setSettings({ ...settings, nice_word_enabled: v })}
                    label="Nice Word of the Week"
                    description="Earn points for using the nice word"
                  />
                </Card>
              </div>
            </motion.div>
          )}

          {/* Step: Mode */}
          {step === 'mode' && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Game mode
                </h1>
                <p className="text-gray-400">
                  Play individually or form teams.
                </p>
              </div>

              <div className="space-y-4">
                <Card
                  onClick={() => setMode('ffa')}
                  hoverable
                  selected={mode === 'ffa'}
                  className="flex items-center gap-4"
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    mode === 'ffa' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-400'
                  )}>
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Free-for-All</h3>
                    <p className="text-sm text-gray-400">Every person for themselves</p>
                  </div>
                </Card>

                <Card
                  onClick={() => setMode('teams')}
                  hoverable
                  selected={mode === 'teams'}
                  className="flex items-center gap-4"
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    mode === 'teams' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-400'
                  )}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Teams</h3>
                    <p className="text-sm text-gray-400">Compete as groups</p>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Step: Teams Setup */}
          {step === 'teams' && (
            <motion.div
              key="teams"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Set up teams
                </h1>
                <p className="text-gray-400">
                  Name your teams. Players will join after.
                </p>
              </div>

              <div className="space-y-4">
                {teams.map((team, index) => (
                  <Card key={index} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg"
                      style={{ backgroundColor: team.color }}
                    />
                    <Input
                      value={team.name}
                      onChange={(e) => {
                        const newTeams = [...teams];
                        newTeams[index].name = e.target.value;
                        setTeams(newTeams);
                      }}
                      className="flex-1"
                    />
                  </Card>
                ))}

                <Button
                  onClick={() =>
                    setTeams([
                      ...teams,
                      {
                        name: `Team ${teams.length + 1}`,
                        color: ['#10B981', '#F59E0B', '#8B5CF6', '#EC4899'][
                          teams.length % 4
                        ],
                      },
                    ])
                  }
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step: Invite */}
          {step === 'invite' && (
            <motion.div
              key="invite"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div>
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Game created!
                </h1>
                <p className="text-gray-400">
                  Share this code with your friends to join.
                </p>
              </div>

              <Card className="py-8">
                <p className="text-sm text-gray-400 mb-2">Invite Code</p>
                <p className="text-4xl font-mono font-bold text-white tracking-widest">
                  {inviteCode}
                </p>
              </Card>

              <div className="space-y-3">
                <Button onClick={shareInvite} size="lg" className="w-full">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Invite Link
                </Button>
                <Button
                  onClick={copyInviteLink}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => router.push(`/game/${gameId}`)}
                  variant="ghost"
                  size="lg"
                  className="w-full"
                >
                  Go to Game
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer button */}
      {step !== 'invite' && (
        <div className="mt-8">
          <Button
            onClick={handleNext}
            size="lg"
            className="w-full"
            isLoading={isLoading}
            disabled={step === 'name' && !gameName}
          >
            {step === 'mode' || step === 'teams' ? 'Create Game' : 'Continue'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
