'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LogOut, Users, Calendar, Trophy, TrendingUp } from 'lucide-react';

export default function CoachDashboard() {
  const { user, teams, logout } = useAuth();
  const coachTeams = teams.slice(0, 5); // Show more teams for coaches

  return (
    <div>
      <header className="bg-dark-800 text-white border-b border-dark-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-display text-3xl text-cyan-500 uppercase">CAP</Link>
              <span className="font-body text-sm text-gray-300">Coach Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-body text-sm text-gray-300">Coach {user?.name}</span>
              <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-cyan-500">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-dark-800 to-dark-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-5xl uppercase mb-4 text-gray-100">Coach Command Center</h1>
          <p className="font-body text-xl text-gray-300">Manage all your teams and champions in one place</p>

          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <div className="bg-dark-700 rounded-lg p-4">
              <Users className="w-8 h-8 text-cyan-500 mb-2" />
              <div className="font-mono text-3xl font-bold text-cyan-500">{coachTeams.length}</div>
              <p className="font-body text-sm text-gray-300">Active Teams</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <Trophy className="w-8 h-8 text-cyan-500 mb-2" />
              <div className="font-mono text-3xl font-bold text-cyan-500">
                {coachTeams.reduce((sum, team) => sum + team.players.length, 0)}
              </div>
              <p className="font-body text-sm text-gray-300">Total Athletes</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <Calendar className="w-8 h-8 text-cyan-500 mb-2" />
              <div className="font-mono text-3xl font-bold text-cyan-500">3</div>
              <p className="font-body text-sm text-gray-300">Active Seasons</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <TrendingUp className="w-8 h-8 text-cyan-500 mb-2" />
              <div className="font-mono text-3xl font-bold text-cyan-500">94%</div>
              <p className="font-body text-sm text-gray-300">Parent Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-3xl text-gray-100 uppercase mb-6">Your Teams</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coachTeams.map((team) => (
            <div key={team.id} className="bg-dark-800 rounded-xl shadow-lg overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-cyan-500 to-cyan-600"></div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-gray-100 uppercase mb-2">{team.name}</h3>
                <p className="font-body text-gray-300 mb-4">{team.season} • {team.sport}</p>
                <div className="flex justify-between text-sm mb-4">
                  <span className="font-body text-gray-400">Athletes: {team.players.length}</span>
                  <span className="font-body text-gray-400">Cards: 0</span>
                </div>
                <Link href={`/teams/${team.id}/manage`} className="btn-primary w-full text-center">
                  Manage Team
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}