import { Card } from './Card';

interface CardBackProps {
  count: number;
  onClick?: () => void;
  label?: string;
}

export function CardBack({ count, onClick, label = 'Draw' }: CardBackProps) {
  return (
    <Card
      borderColor="#6B7280"
      bgColor="#1F2937"
      onClick={onClick}
      className="w-36 sm:w-40"
    >
      <div className="flex flex-col items-center justify-center py-4 text-white">
        <p className="text-3xl font-bold">{count}</p>
        <p className="mt-1 text-sm font-medium text-gray-300">cards</p>
        {onClick && (
          <p className="mt-3 rounded-full bg-white/20 px-4 py-1 text-sm font-semibold">
            {label}
          </p>
        )}
      </div>
    </Card>
  );
}
