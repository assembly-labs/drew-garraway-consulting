import type { OrderStatus, ItemStatus } from '../../types/ops';

interface StatusBadgeProps {
  status: OrderStatus | ItemStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<OrderStatus | ItemStatus, { label: string; bgColor: string; textColor: string; dotColor: string }> = {
  pending: {
    label: 'Pending',
    bgColor: 'bg-[#FFF9C4]',
    textColor: 'text-[#E65100]',
    dotColor: 'bg-[#FFA726]',
  },
  packed: {
    label: 'Packed',
    bgColor: 'bg-[#E8F5E9]',
    textColor: 'text-[#2E7D32]',
    dotColor: 'bg-[#3DDC97]',
  },
  picked_up: {
    label: 'Picked Up',
    bgColor: 'bg-[#E8F5E9]',
    textColor: 'text-[#4A7C28]',
    dotColor: 'bg-[#4A7C28]',
  },
  cancelled: {
    label: 'Cancelled',
    bgColor: 'bg-[#F7F6F3]',
    textColor: 'text-[#787774]',
    dotColor: 'bg-[#787774]',
  },
  unavailable: {
    label: 'Unavailable',
    bgColor: 'bg-[#FFEBEE]',
    textColor: 'text-[#C62828]',
    dotColor: 'bg-[#FF6B6B]',
  },
  substituted: {
    label: 'Substituted',
    bgColor: 'bg-[#E3F2FD]',
    textColor: 'text-[#1565C0]',
    dotColor: 'bg-[#4ECDC4]',
  },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5'
    : 'text-sm px-3 py-1';

  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses}`}
    >
      <span className={`${dotSize} rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
