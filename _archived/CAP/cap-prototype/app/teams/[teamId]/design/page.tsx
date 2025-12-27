'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { CARD_TEMPLATES } from '@/lib/mock-data';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, ShoppingCart, Sparkles } from 'lucide-react';

export default function CardDesignerPage({ params }: { params: { teamId: string } }) {
  const router = useRouter();
  const { teams } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(CARD_TEMPLATES[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(0);

  const team = teams.find(t => t.id === params.teamId) || teams[0];
  if (!team) return null;

  const currentPlayer = team.players[selectedPlayer];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-300 hover:text-cyan-500 mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body">Back to Dashboard</span>
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-5xl text-gray-100 uppercase">Design Championship Cards</h1>
          <p className="font-body text-xl text-gray-300 mt-2">{team.name} • {team.players.length} Players</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Templates */}
          <div className="lg:col-span-1">
            <h2 className="font-display text-2xl text-gray-100 uppercase mb-4">CAP Templates</h2>
            <div className="space-y-3">
              {CARD_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    selectedTemplate.id === template.id
                      ? 'border-cyan-500 bg-dark-700'
                      : 'border-dark-600 hover:border-cyan-500'
                  }`}
                >
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="font-display text-lg text-gray-100">{template.name}</h3>
                  <p className="font-body text-xs text-gray-300">{template.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Card Preview */}
          <div className="lg:col-span-1">
            <h2 className="font-display text-2xl text-gray-100 uppercase mb-4">Card Preview</h2>
            <div className="relative">
              <div className={`preserve-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front of card */}
                <div className="w-full aspect-[3/4] rounded-xl shadow-2xl overflow-hidden backface-hidden">
                  <div className="h-full bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 flex flex-col">
                    <div className="text-center text-dark-900">
                      <p className="font-accent text-xs uppercase tracking-widest mb-2">Championship Athletic Prospects</p>
                      <div className="bg-dark-900/20 rounded-lg p-4 mb-4">
                        <img
                          src={currentPlayer?.enhancedPhotoUrl}
                          alt={currentPlayer?.firstName}
                          className="w-full h-48 object-cover rounded"
                        />
                      </div>
                      <div className="font-mono text-5xl font-bold mb-2">#{currentPlayer?.jerseyNumber}</div>
                      <h3 className="font-display text-3xl uppercase mb-1">{currentPlayer?.firstName}</h3>
                      <p className="font-body text-sm">{currentPlayer?.position}</p>
                      <div className="mt-4 pt-4 border-t border-dark-900/30">
                        <p className="font-body text-xs">{team.name}</p>
                        <p className="font-accent text-xs uppercase tracking-wider mt-1">{team.season}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back of card (hidden for simplicity) */}
              </div>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="absolute top-4 right-4 p-2 bg-dark-800 rounded-full shadow-md hover:shadow-lg"
              >
                <RefreshCw className="w-5 h-5 text-gray-100" />
              </button>
            </div>

            {/* Player selector */}
            <div className="mt-6">
              <p className="font-body text-sm text-gray-300 mb-2">Select Player:</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {team.players.map((player, index) => (
                  <button
                    key={player.id}
                    onClick={() => setSelectedPlayer(index)}
                    className={`px-3 py-2 rounded-lg whitespace-nowrap font-body text-sm ${
                      selectedPlayer === index
                        ? 'bg-cyan-500 text-dark-900'
                        : 'bg-dark-800 text-gray-100 hover:bg-dark-700'
                    }`}
                  >
                    #{player.jerseyNumber} {player.firstName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customization */}
          <div className="lg:col-span-1">
            <h2 className="font-display text-2xl text-gray-100 uppercase mb-4">Customize</h2>
            <div className="bg-dark-800 rounded-xl p-6 space-y-4">
              <div>
                <label className="block font-body text-sm font-medium text-gray-300 mb-2">Card Font</label>
                <select className="w-full px-4 py-2 bg-dark-700 border-2 border-dark-600 rounded-lg text-gray-100">
                  <option>Championship Style</option>
                  <option>Classic</option>
                  <option>Modern</option>
                </select>
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-gray-300 mb-2">Team Colors</label>
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-cyan-500 rounded-lg border-2 border-dark-600"></div>
                  <div className="w-12 h-12 bg-dark-900 rounded-lg border-2 border-dark-600"></div>
                </div>
              </div>

              <button className="w-full p-3 bg-cyan-500 text-dark-900 rounded-lg hover:bg-cyan-400 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate AI Bio
              </button>

              <div className="pt-4 border-t border-dark-600">
                <button className="w-full btn-secondary">Apply to All Champions</button>
              </div>
            </div>

            <div className="mt-6 bg-dark-800 rounded-xl p-6 border border-dark-600">
              <h3 className="font-display text-xl text-gray-100 uppercase mb-3">Order Summary</h3>
              <div className="space-y-2 font-body text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>{team.players.length} Champions × 8 cards</span>
                  <span className="font-mono font-bold text-gray-100">{team.players.length * 8}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Template: {selectedTemplate.name}</span>
                  <span className="text-cyan-400">Included</span>
                </div>
                <div className="pt-2 border-t border-dark-600 flex justify-between">
                  <span className="font-semibold text-gray-100">Total Cards:</span>
                  <span className="font-mono text-xl font-bold text-cyan-500">{team.players.length * 8}</span>
                </div>
              </div>

              <button
                onClick={() => router.push(`/teams/${team.id}/checkout`)}
                className="w-full btn-primary mt-6 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Order Cards → $28
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}