import type { SlotStats } from '../../types/ops';

interface SlotHealthBarProps {
  slot: SlotStats;
  onClick?: () => void;
}

export default function SlotHealthBar({ slot, onClick }: SlotHealthBarProps) {
  const progress = slot.totalOrders > 0
    ? (slot.packedOrders / slot.totalOrders) * 100
    : 0;

  // Determine status color
  const getProgressColor = () => {
    if (progress === 100) return 'bg-[#3DDC97]'; // Complete - mint
    if (progress >= 50) return 'bg-[#4A7C28]'; // Good progress - sage
    return 'bg-[#FFA726]'; // Needs work - gold
  };

  const getStatusIcon = () => {
    if (progress === 100) return '✓';
    if (progress >= 50) return '◐';
    return '○';
  };

  return (
    <button
      onClick={onClick}
      className="w-full p-3 bg-white rounded-lg border border-[#E3E2E0] hover:border-[#81C784] hover:shadow-sm transition-all text-left"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[#37352F]">{slot.label}</span>
        <span className="text-xs text-[#787774]">
          {getStatusIcon()} {slot.packedOrders}/{slot.totalOrders} packed
        </span>
      </div>
      <div className="h-2 bg-[#F7F6F3] rounded-full overflow-hidden">
        <div
          className={`h-full ${getProgressColor()} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {slot.pickedUpOrders > 0 && (
        <p className="text-xs text-[#787774] mt-1">
          {slot.pickedUpOrders} picked up
        </p>
      )}
    </button>
  );
}
