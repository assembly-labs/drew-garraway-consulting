'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';
import { generateTeam, Sport } from '@/lib/mock-data';

export default function NewTeamPage() {
  const router = useRouter();
  const { user, addTeam } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    sport: '' as Sport | '',
    season: '2024 Spring',
    colors: ['#FFD700', '#0A1F44'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.sport) return;

    const newTeam = generateTeam(formData.sport as Sport, user.id);
    newTeam.name = formData.name || newTeam.name;
    newTeam.season = formData.season;
    newTeam.colors = formData.colors;

    addTeam(newTeam);
    router.push(`/teams/${newTeam.id}/roster`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-300 hover:text-cyan-500 mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body">Back to Dashboard</span>
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="bg-dark-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
              <h1 className="font-display text-4xl text-gray-100 uppercase">Register Your Champions</h1>
              <p className="font-body text-gray-300 mt-2">Let's create your team profile</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-body text-sm font-medium text-gray-300 mb-2">Team Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-700 border-2 border-dark-600 rounded-lg focus:border-cyan-500 focus:outline-none text-gray-100"
                  placeholder="e.g., Thunder Warriors"
                  required
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-gray-300 mb-2">Sport</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(['hockey', 'football', 'baseball', 'soccer', 'lacrosse', 'basketball'] as Sport[]).map(sport => (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => setFormData({ ...formData, sport })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.sport === sport
                          ? 'border-cyan-500 bg-dark-700'
                          : 'border-dark-600 hover:border-cyan-500'
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {sport === 'hockey' && '🏒'}
                        {sport === 'football' && '🏈'}
                        {sport === 'baseball' && '⚾'}
                        {sport === 'soccer' && '⚽'}
                        {sport === 'lacrosse' && '🥍'}
                        {sport === 'basketball' && '🏀'}
                      </div>
                      <p className="font-body text-sm capitalize text-gray-100">{sport}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-gray-300 mb-2">Season</label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-700 border-2 border-dark-600 rounded-lg focus:border-cyan-500 focus:outline-none text-gray-100"
                >
                  <option value="2024 Spring">2024 Spring</option>
                  <option value="2024 Summer">2024 Summer</option>
                  <option value="2024 Fall">2024 Fall</option>
                  <option value="2024 Winter">2024 Winter</option>
                </select>
              </div>

              <div className="p-4 bg-dark-700 rounded-lg border border-dark-600">
                <h3 className="font-body font-semibold text-gray-100 mb-2">Privacy Settings</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="font-body text-sm text-gray-300">Keep team private</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="font-body text-sm text-gray-300">Auto-delete photos after 30 days</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                Register Champions →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}