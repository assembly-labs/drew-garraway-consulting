import { CheckCircle2 } from 'lucide-react';
import type { PickListItem as PickListItemType } from '../../types/ops';

interface PickListItemProps {
  item: PickListItemType;
  onToggle: () => void;
}

export default function PickListItem({ item, onToggle }: PickListItemProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
        item.isPacked
          ? 'bg-[#E8F5E9]'
          : 'bg-white hover:bg-[#F7F6F3]'
      }`}
    >
      <div
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
          item.isPacked
            ? 'bg-[#4A7C28] border-[#4A7C28]'
            : 'border-[#E3E2E0]'
        }`}
      >
        {item.isPacked && <CheckCircle2 size={16} className="text-white" />}
      </div>
      <div className="flex-1 text-left">
        <p className={`text-sm font-medium ${
          item.isPacked ? 'text-[#787774] line-through' : 'text-[#37352F]'
        }`}>
          x{item.quantity} {item.productName}
        </p>
        <p className="text-xs text-[#787774]">
          {item.unit} &middot; {item.orderNumber}
        </p>
      </div>
    </button>
  );
}
