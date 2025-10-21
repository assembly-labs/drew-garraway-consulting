'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LogOut, Camera, Upload, Calendar, DollarSign, Image, CheckCircle } from 'lucide-react';

export default function PhotographerDashboard() {
  const { user, teams, logout } = useAuth();

  const upcomingShoots = [
    { team: 'Lightning Baseball', date: 'Tomorrow 2:00 PM', location: 'Central Park Field 3', players: 18 },
    { team: 'Thunder FC', date: 'Dec 28, 10:00 AM', location: 'Sports Complex A', players: 22 },
    { team: 'Warriors Basketball', date: 'Dec 30, 3:00 PM', location: 'Community Gym', players: 15 },
  ];

  return (
    <div>
      <header className="bg-dark-800 text-white border-b border-dark-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-display text-3xl text-cyan-500 uppercase">CAP</Link>
              <span className="font-body text-sm text-gray-300">Photographer Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-body text-sm text-gray-300">📸 {user?.name}</span>
              <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 rounded">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-dark-800 to-dark-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-5xl uppercase mb-4 text-gray-100">Photographer Dashboard</h1>
          <p className="font-body text-xl text-gray-300">Capture champions, deliver memories</p>

          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <div className="bg-dark-700 rounded-lg p-4">
              <Camera className="w-8 h-8 text-cyan-500 mb-2" />
              <div className="font-mono text-3xl font-bold text-gray-100">3</div>
              <p className="font-body text-sm text-gray-300">Upcoming Shoots</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <Image className="w-8 h-8 text-cyan-500 mb-2" />
              <div className="font-mono text-3xl font-bold text-gray-100">2,847</div>
              <p className="font-body text-sm text-gray-300">Photos Uploaded</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <CheckCircle className="w-8 h-8 text-cyan-500 mb-2" />
              <div className="font-mono text-3xl font-bold text-gray-100">186</div>
              <p className="font-body text-sm text-gray-300">Teams Completed</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <DollarSign className="w-8 h-8 text-cyan-500 mb-2" />
              <div className="font-mono text-3xl font-bold text-gray-100">$4,250</div>
              <p className="font-body text-sm text-gray-300">This Month</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Shoots */}
          <div>
            <h2 className="font-display text-3xl text-gray-100 uppercase mb-6">Upcoming Shoots</h2>
            <div className="space-y-4">
              {upcomingShoots.map((shoot, i) => (
                <div key={i} className="bg-dark-800 rounded-xl shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display text-xl text-gray-100 uppercase">{shoot.team}</h3>
                      <p className="font-body text-sm text-gray-300 mt-1">
                        <Calendar className="inline w-4 h-4 mr-1" />
                        {shoot.date}
                      </p>
                      <p className="font-body text-sm text-gray-300">
                        📍 {shoot.location}
                      </p>
                    </div>
                    <span className="font-mono text-2xl font-bold text-cyan-500">{shoot.players}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-cyan-500 text-dark-900 rounded-lg font-body text-sm hover:bg-cyan-400">
                      View Details
                    </button>
                    <button className="flex-1 px-3 py-2 bg-dark-700 text-gray-100 rounded-lg font-body text-sm hover:bg-dark-600">
                      Contact Coach
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Upload */}
          <div>
            <h2 className="font-display text-3xl text-gray-100 uppercase mb-6">Quick Upload</h2>
            <div className="bg-dark-800 rounded-xl shadow-md p-8">
              <div className="border-4 border-dashed border-dark-600 rounded-lg p-12 text-center hover:border-cyan-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="font-display text-xl text-gray-100 uppercase mb-2">Drop Photos Here</p>
                <p className="font-body text-sm text-gray-300 mb-4">or click to browse</p>
                <button className="btn-primary">
                  Select Photos
                </button>
              </div>

              <div className="mt-6 p-4 bg-dark-700 rounded-lg border border-dark-600">
                <p className="font-body text-sm text-gray-100">
                  <strong>Pro Tips:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-sm font-body text-gray-300">
                  <li>• Upload RAW or high-res JPEG files</li>
                  <li>• Name files with player jersey numbers</li>
                  <li>• Batch upload by team for faster processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="mt-12">
          <h2 className="font-display text-3xl text-gray-100 uppercase mb-6">Recent Uploads</h2>
          <div className="bg-dark-800 rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left font-body text-sm font-medium text-gray-100">Team</th>
                  <th className="px-6 py-3 text-left font-body text-sm font-medium text-gray-100">Photos</th>
                  <th className="px-6 py-3 text-left font-body text-sm font-medium text-gray-100">Upload Date</th>
                  <th className="px-6 py-3 text-left font-body text-sm font-medium text-gray-100">Status</th>
                  <th className="px-6 py-3 text-left font-body text-sm font-medium text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.slice(0, 5).map((team, i) => (
                  <tr key={team.id} className="border-t border-dark-600">
                    <td className="px-6 py-4 font-body text-sm text-gray-100">{team.name}</td>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-gray-100">{team.players.length * 3}</td>
                    <td className="px-6 py-4 font-body text-sm text-gray-300">Dec {20 + i}, 2024</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-body rounded-full bg-green-500/20 text-green-400">
                        Processed
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="font-body text-sm text-cyan-500 hover:underline">
                        View Gallery
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}