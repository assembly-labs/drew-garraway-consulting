import type { ActionCard } from '../../game/types';
import { Card } from './Card';

interface ActionCardProps {
  card: ActionCard;
}

export function ActionCardDisplay({ card }: ActionCardProps) {
  return (
    <Card
      borderColor="#F59E0B"
      bgColor="#FFFBEB"
      className="w-64 sm:w-72 border-dashed"
    >
      <div className="mb-2 text-center text-2xl">
        <span aria-hidden="true">&#9889;</span>
      </div>

      <p className="text-center text-xs font-bold uppercase tracking-wider text-amber-600">
        ACTION
      </p>

      <p className="mt-3 text-center text-lg font-semibold leading-relaxed text-gray-900">
        {card.promptText}
      </p>

      {card.groupAction && (
        <p className="mt-2 text-center text-xs font-medium text-amber-500">
          Group activity
        </p>
      )}
    </Card>
  );
}
