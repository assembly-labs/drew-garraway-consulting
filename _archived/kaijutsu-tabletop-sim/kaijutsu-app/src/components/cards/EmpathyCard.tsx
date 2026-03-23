import type { FeelingsCard } from '../../game/types';
import { EMOTION_EMOJI, EMOTION_COLORS } from '../../game/constants';
import { Card } from './Card';

interface EmpathyCardProps {
  card: FeelingsCard;
  onClick?: () => void;
  compact?: boolean;
}

export function EmpathyCardDisplay({ card, onClick, compact = false }: EmpathyCardProps) {
  const colors = EMOTION_COLORS[card.emotion];
  const emoji = EMOTION_EMOJI[card.emotion];

  if (compact) {
    return (
      <Card
        borderColor={colors?.primary || '#E5E7EB'}
        bgColor={colors?.bg || '#FFFFFF'}
        onClick={onClick}
        className="w-28 min-w-28"
      >
        <div className="text-center">
          <span className="text-xl">{emoji}</span>
          <p className="mt-1 text-xs font-medium capitalize" style={{ color: colors?.primary }}>
            {card.emotion}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      borderColor={colors?.primary || '#E5E7EB'}
      bgColor={colors?.bg || '#FFFFFF'}
      onClick={onClick}
      className="w-64 sm:w-72"
    >
      {/* Emotion label */}
      <div className="mb-2 text-center">
        <span className="text-3xl">{emoji}</span>
        <p
          className="mt-1 text-lg font-bold capitalize"
          style={{ color: colors?.primary }}
        >
          {card.emotion}
        </p>
      </div>

      {/* Event text */}
      <p className="text-center text-base leading-relaxed text-gray-800">
        {card.event}
      </p>

      {/* Card type label */}
      <p className="mt-3 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
        Empathy Card
      </p>
    </Card>
  );
}
