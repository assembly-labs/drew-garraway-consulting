import { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import { CHARACTER_COLORS, EMOTION_EMOJI, EMOTION_COLORS } from '../../game/constants';
import cardData from '../../assets/cards.json';
import type { PowerCard, FeelingsCard } from '../../game/types';

type Tab = 'power' | 'feelings';

export function FacilitatorSetup() {
  const { state, exitFacilitatorSetup, toggleFavoritePower, toggleFavoriteFeelings } = useGame();
  const [activeTab, setActiveTab] = useState<Tab>('power');

  const powerCards = cardData.powerCards as PowerCard[];
  const feelingsCards = cardData.feelingsCards as FeelingsCard[];

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Facilitator Setup</h2>
            <p className="text-sm text-gray-500">
              Tap cards to prioritize them in the deck
            </p>
          </div>
          <button
            onClick={exitFacilitatorSetup}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-95"
          >
            Done
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setActiveTab('power')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'power'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Power Cards ({state.favoritedPowerCardIds.size})
          </button>
          <button
            onClick={() => setActiveTab('feelings')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'feelings'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Feelings Cards ({state.favoritedFeelingsCardIds.size})
          </button>
        </div>
      </header>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'power' && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {powerCards.map(card => {
              const isFavorited = state.favoritedPowerCardIds.has(card.id);
              const charColor = CHARACTER_COLORS[card.character] || '#666';
              return (
                <button
                  key={card.id}
                  onClick={() => toggleFavoritePower(card.id)}
                  className={`rounded-2xl border-2 p-3 text-left transition-all active:scale-[0.98] ${
                    isFavorited
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: charColor }}
                    />
                    <span className="text-xs font-bold text-gray-500">{card.character}</span>
                    {isFavorited && <span className="ml-auto text-green-600 text-sm">&#10003;</span>}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {card.techniqueName}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {card.emotionTypes.map(emotion => (
                      <span
                        key={emotion}
                        className="text-xs"
                        style={{ color: EMOTION_COLORS[emotion]?.primary }}
                      >
                        {EMOTION_EMOJI[emotion]}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'feelings' && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {feelingsCards.map(card => {
              const isFavorited = state.favoritedFeelingsCardIds.has(card.id);
              const colors = EMOTION_COLORS[card.emotion];
              return (
                <button
                  key={card.id}
                  onClick={() => toggleFavoriteFeelings(card.id)}
                  className={`rounded-2xl border-2 p-3 text-left transition-all active:scale-[0.98] ${
                    isFavorited
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{EMOTION_EMOJI[card.emotion]}</span>
                    <span
                      className="text-xs font-bold capitalize"
                      style={{ color: colors?.primary }}
                    >
                      {card.emotion}
                    </span>
                    {isFavorited && <span className="ml-auto text-green-600 text-sm">&#10003;</span>}
                  </div>
                  <p className="mt-1 text-sm text-gray-700">
                    {card.event}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer summary */}
      <div className="bg-white px-4 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
        <p className="text-center text-sm text-gray-500">
          {state.favoritedPowerCardIds.size + state.favoritedFeelingsCardIds.size} cards selected — these will appear more often
        </p>
      </div>
    </div>
  );
}
