import { Search } from 'lucide-react';
import type { OrderFilterStatus } from '../../types/ops';
import { pickupSlots } from '../../data/mockOrders';

interface FilterBarProps {
  activeStatus: OrderFilterStatus;
  onStatusChange: (status: OrderFilterStatus) => void;
  activeSlot: string;
  onSlotChange: (slot: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    pending: number;
    packed: number;
    picked_up: number;
    issues: number;
  };
}

const statusFilters: Array<{ value: OrderFilterStatus; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'packed', label: 'Packed' },
  { value: 'picked_up', label: 'Done' },
  { value: 'issues', label: 'Issues' },
];

export default function FilterBar({
  activeStatus,
  onStatusChange,
  activeSlot,
  onSlotChange,
  searchQuery,
  onSearchChange,
  counts,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Status Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {statusFilters.map(({ value, label }) => {
          const count = counts[value as keyof typeof counts];
          const isActive = activeStatus === value;
          return (
            <button
              key={value}
              onClick={() => onStatusChange(value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#4A7C28] text-white'
                  : 'bg-white text-[#787774] hover:text-[#37352F] hover:bg-[#F7F6F3] border border-[#E3E2E0]'
              }`}
            >
              {label}
              <span
                className={`px-1.5 py-0.5 rounded text-xs ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F7F6F3] text-[#787774]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slot Filter & Search */}
      <div className="flex gap-2">
        <select
          value={activeSlot}
          onChange={(e) => onSlotChange(e.target.value)}
          className="px-3 py-2 bg-white border border-[#E3E2E0] rounded-lg text-sm text-[#37352F] focus:outline-none focus:border-[#4A7C28]"
        >
          <option value="all">All Slots</option>
          {pickupSlots.map(slot => (
            <option key={slot.id} value={slot.id}>
              {slot.label}
            </option>
          ))}
        </select>

        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#787774]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#E3E2E0] rounded-lg text-sm text-[#37352F] placeholder-[#787774] focus:outline-none focus:border-[#4A7C28]"
          />
        </div>
      </div>
    </div>
  );
}
