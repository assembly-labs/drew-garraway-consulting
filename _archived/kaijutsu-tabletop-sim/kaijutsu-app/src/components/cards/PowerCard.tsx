import type { PowerCard as PowerCardType } from '../../game/types';
import { CHARACTER_COLORS, EMOTION_EMOJI, EMOTION_COLORS } from '../../game/constants';
import { Card } from './Card';

interface PowerCardProps {
  card: PowerCardType;
  onClick?: () => void;
  selected?: boolean;
  dimmed?: boolean;
  glowing?: boolean;
  showDescription?: boolean;
}

export function PowerCardDisplay({
  card,
  onClick,
  selected,
  dimmed,
  glowing,
  showDescription = false,
}: PowerCardProps) {
  const charColor = CHARACTER_COLORS[card.character] || '#666';

  return (
    <Card
      borderColor={charColor}
      onClick={onClick}
      selected={selected}
      dimmed={dimmed}
      glowing={glowing}
      className="w-44 min-w-44 sm:w-48"
    >
      {/* Character band */}
      <div
        className="mb-2 rounded-lg px-3 py-1 text-center text-sm font-bold text-white"
        style={{ backgroundColor: charColor }}
      >
        {card.character}
      </div>

      {/* Technique name */}
      <h3 className="mb-1 text-center text-base font-bold text-gray-900">
        {card.techniqueName}
      </h3>

      {/* Technique description — shown only when expanded */}
      {showDescription && (
        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          {card.techniqueDescription}
        </p>
      )}

      {/* Emotion badges */}
      <div className="mt-2 flex flex-wrap justify-center gap-1">
        {card.emotionTypes.map(emotion => (
          <span
            key={emotion}
            className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: EMOTION_COLORS[emotion]?.bg || '#f3f4f6',
              color: EMOTION_COLORS[emotion]?.primary || '#666',
            }}
          >
            {EMOTION_EMOJI[emotion]} {emotion}
          </span>
        ))}
      </div>
    </Card>
  );
}
