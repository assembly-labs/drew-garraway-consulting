'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { PLATFORM_STATS } from '@/lib/mock-data';
import { LogOut, Users, DollarSign, TrendingUp, Package, BarChart3, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="bg-dark-800 text-white border-b border-dark-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-display text-3xl text-cyan-500 uppercase">CAP</Link>
              <span className="font-body text-sm text-gray-300">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-body text-sm text-gray-300">Admin: {user?.name}</span>
              <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 rounded">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-dark-900 min-h-screen">
        <section className="bg-gradient-to-r from-dark-800 to-dark-900 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-5xl uppercase mb-4 text-gray-100">Platform Analytics</h1>
            <p className="font-body text-xl text-gray-300">Real-time CAP platform performance metrics</p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-dark-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-10 h-10 text-gray-100" />
                <span className="text-xs font-body text-green-400">+18.5%</span>
              </div>
              <div className="font-mono text-3xl font-bold text-gray-100">{PLATFORM_STATS.totalUsers.toLocaleString()}</div>
              <p className="font-body text-sm text-gray-300 mt-2">Total Users</p>
            </div>

            <div className="bg-dark-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-10 h-10 text-cyan-500" />
                <span className="text-xs font-body text-green-400">+24.3%</span>
              </div>
              <div className="font-mono text-3xl font-bold text-cyan-500">
                ${PLATFORM_STATS.totalRevenue.toLocaleString()}
              </div>
              <p className="font-body text-sm text-gray-300 mt-2">Total Revenue</p>
            </div>

            <div className="bg-dark-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-10 h-10 text-cyan-500" />
                <span className="text-xs font-body text-yellow-400">Active</span>
              </div>
              <div className="font-mono text-3xl font-bold text-cyan-500">{PLATFORM_STATS.activeOrders}</div>
              <p className="font-body text-sm text-gray-300 mt-2">Active Orders</p>
            </div>

            <div className="bg-dark-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-10 h-10 text-green-400" />
                <span className="text-xs font-body text-green-400">↑</span>
              </div>
              <div className="font-mono text-3xl font-bold text-green-400">{PLATFORM_STATS.conversionRate}%</div>
              <p className="font-body text-sm text-gray-300 mt-2">Conversion Rate</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-dark-800 rounded-xl shadow-md p-6">
              <h2 className="font-display text-2xl text-gray-100 uppercase mb-4">Platform Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-dark-600">
                  <span className="font-body text-gray-300">Total Teams</span>
                  <span className="font-mono font-bold text-gray-100">{PLATFORM_STATS.totalTeams}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-dark-600">
                  <span className="font-body text-gray-300">Total Cards Created</span>
                  <span className="font-mono font-bold text-gray-100">{PLATFORM_STATS.totalCards.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-dark-600">
                  <span className="font-body text-gray-300">Average Team Size</span>
                  <span className="font-mono font-bold text-gray-100">{PLATFORM_STATS.averageTeamSize} players</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-dark-600">
                  <span className="font-body text-gray-300">Top Sport</span>
                  <span className="font-body font-bold text-gray-100 capitalize">{PLATFORM_STATS.topSport}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-gray-300">Customer Satisfaction</span>
                  <span className="font-mono font-bold text-cyan-500">{PLATFORM_STATS.customerSatisfaction}/5.0</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl shadow-md p-6">
              <h2 className="font-display text-2xl text-gray-100 uppercase mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors">
                  <BarChart3 className="w-6 h-6 text-gray-100 mb-2" />
                  <p className="font-body text-sm text-gray-100">View Reports</p>
                </button>
                <button className="p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors">
                  <Users className="w-6 h-6 text-cyan-500 mb-2" />
                  <p className="font-body text-sm text-gray-100">Manage Users</p>
                </button>
                <button className="p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors">
                  <Package className="w-6 h-6 text-cyan-500 mb-2" />
                  <p className="font-body text-sm text-gray-100">Order Queue</p>
                </button>
                <button className="p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors">
                  <Settings className="w-6 h-6 text-cyan-500 mb-2" />
                  <p className="font-body text-sm text-gray-100">Settings</p>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          <div className="bg-dark-800 rounded-xl shadow-md p-6">
            <h2 className="font-display text-2xl text-gray-100 uppercase mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { user: 'Sarah J.', action: 'Created new team', time: '2 minutes ago', type: 'team' },
                { user: 'Mike T.', action: 'Ordered 120 cards', time: '15 minutes ago', type: 'order' },
                { user: 'Alex C.', action: 'Uploaded 24 photos', time: '1 hour ago', type: 'photo' },
                { user: 'Parent User', action: 'Completed signup', time: '2 hours ago', type: 'user' },
                { user: 'Coach Demo', action: 'Updated team roster', time: '3 hours ago', type: 'team' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-dark-700 rounded">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'order' ? 'bg-cyan-500' :
                      activity.type === 'team' ? 'bg-cyan-500' :
                      activity.type === 'photo' ? 'bg-green-400' :
                      'bg-gray-400'
                    }`} />
                    <div>
                      <p className="font-body text-sm text-gray-100">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                    </div>
                  </div>
                  <span className="font-body text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}