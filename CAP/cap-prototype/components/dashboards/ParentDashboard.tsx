'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Plus, Trophy, Camera, Package, LogOut, Users, CreditCard, Star } from 'lucide-react';
import { generateOrder } from '@/lib/mock-data';

export default function ParentDashboard() {
  const { user, teams, logout } = useAuth();
  const [orders] = useState(() => teams.slice(0, 2).map(team => generateOrder(team.id)));

  const userTeams = teams.filter(team => team.ownerId === user?.id || team.ownerId === 'demo-user').slice(0, 3);

  return (
    <div>
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-display text-3xl text-cyan-500 uppercase">
                CAP
              </Link>
              <span className="font-body text-sm text-gray-300">Parent Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-body text-sm text-gray-300">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-body text-gray-300 hover:text-cyan-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-dark-800 to-dark-900 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-5xl text-gray-100 uppercase mb-4">
            Welcome Back, Champion Maker!
          </h1>
          <p className="font-body text-xl text-gray-300">
            Create championship moments for your young athletes
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/teams/new"
            className="p-6 bg-dark-800 rounded-xl border-2 border-dark-600 hover:border-cyan-500 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-cyan-500 group-hover:scale-110 transition-transform" />
              <Plus className="w-5 h-5 text-gray-500" />
            </div>
            <h3 className="font-display text-xl text-gray-100 uppercase mb-2">
              New Champion Cards
            </h3>
            <p className="font-body text-sm text-gray-300">
              Start creating cards for your team
            </p>
          </Link>

          <Link
            href="/teams"
            className="p-6 bg-dark-800 rounded-xl border-2 border-dark-600 hover:border-cyan-500 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-gray-100 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-mono font-bold text-cyan-500">{userTeams.length}</span>
            </div>
            <h3 className="font-display text-xl text-gray-100 uppercase mb-2">
              My Teams
            </h3>
            <p className="font-body text-sm text-gray-300">
              Manage your existing teams
            </p>
          </Link>

          <Link
            href="/orders"
            className="p-6 bg-dark-800 rounded-xl border-2 border-dark-600 hover:border-cyan-500 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-cyan-500 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-mono font-bold text-cyan-500">{orders.length}</span>
            </div>
            <h3 className="font-display text-xl text-gray-100 uppercase mb-2">
              Card Orders
            </h3>
            <p className="font-body text-sm text-gray-300">
              Track your card shipments
            </p>
          </Link>
        </div>
      </section>

      {/* My Teams */}
      {userTeams.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl text-gray-100 uppercase">Your Teams</h2>
            <Link href="/teams/new" className="btn-primary">
              Create New Team
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {userTeams.map((team) => (
              <div key={team.id} className="bg-dark-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-2 bg-gradient-to-r from-cyan-500 to-cyan-600"></div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl">
                        {team.sport === 'hockey' && '🏒'}
                        {team.sport === 'football' && '🏈'}
                        {team.sport === 'baseball' && '⚾'}
                        {team.sport === 'soccer' && '⚽'}
                        {team.sport === 'lacrosse' && '🥍'}
                        {team.sport === 'basketball' && '🏀'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-gray-100 uppercase">{team.name}</h3>
                      <p className="font-body text-sm text-gray-300">{team.season}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-body text-gray-400">Champions:</span>
                      <p className="font-mono text-lg font-bold text-gray-100">{team.players.length}</p>
                    </div>
                    <div>
                      <span className="font-body text-gray-400">Sport:</span>
                      <p className="font-body text-lg font-semibold text-gray-100 capitalize">{team.sport}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/teams/${team.id}/roster`}
                      className="flex-1 px-3 py-2 bg-dark-700 text-gray-100 rounded-lg text-center font-body text-sm hover:bg-dark-600 transition-colors"
                    >
                      Roster
                    </Link>
                    <Link
                      href={`/teams/${team.id}/photos`}
                      className="flex-1 px-3 py-2 bg-dark-700 text-gray-100 rounded-lg text-center font-body text-sm hover:bg-dark-600 transition-colors"
                    >
                      Photos
                    </Link>
                    <Link
                      href={`/teams/${team.id}/design`}
                      className="flex-1 px-3 py-2 bg-cyan-500 text-dark-900 rounded-lg text-center font-body text-sm font-semibold hover:bg-cyan-400 transition-colors"
                    >
                      Design
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Orders */}
      {orders.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="font-display text-3xl text-gray-100 uppercase mb-6">Recent Orders</h2>
          <div className="bg-dark-800 rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left font-body text-sm font-medium text-gray-100">Order ID</th>
                  <th className="px-6 py-3 text-left font-body text-sm font-medium text-gray-100">Status</th>
                  <th className="px-6 py-3 text-left font-body text-sm font-medium text-gray-100">Items</th>
                  <th className="px-6 py-3 text-left font-body text-sm font-medium text-gray-100">Total</th>
                  <th className="px-6 py-3 text-left font-body text-sm font-medium text-gray-100">Tracking</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-dark-600">
                    <td className="px-6 py-4 font-mono text-sm text-gray-100">{order.id}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-body rounded-full ${
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'shipped' ? 'bg-cyan-500/20 text-cyan-400' :
                        order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-gray-100">{order.items} cards</td>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-cyan-500">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {order.trackingNumber ? (
                        <Link href="#" className="font-body text-sm text-cyan-500 hover:underline">
                          {order.trackingNumber}
                        </Link>
                      ) : (
                        <span className="font-body text-sm text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="bg-dark-800 text-white py-12 mt-12 border-t border-dark-600">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-mono text-4xl font-bold text-cyan-500 mb-2">
                {userTeams.reduce((sum, team) => sum + team.players.length, 0)}
              </div>
              <p className="font-body text-sm text-gray-300">Total Champions</p>
            </div>
            <div>
              <div className="font-mono text-4xl font-bold text-cyan-500 mb-2">
                {userTeams.length}
              </div>
              <p className="font-body text-sm text-gray-300">Teams Created</p>
            </div>
            <div>
              <div className="font-mono text-4xl font-bold text-cyan-500 mb-2">
                {orders.length * 120}
              </div>
              <p className="font-body text-sm text-gray-300">Cards Ordered</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-6 h-6 ${i < 5 ? 'text-cyan-500 fill-cyan-500' : 'text-dark-600'}`} />
                ))}
              </div>
              <p className="font-body text-sm text-gray-300">Your Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}