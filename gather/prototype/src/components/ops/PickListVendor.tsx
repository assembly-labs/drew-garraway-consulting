import { ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import type { VendorPickList } from '../../types/ops';
import PickListItem from './PickListItem';

interface PickListVendorProps {
  vendorPickList: VendorPickList;
  isExpanded: boolean;
  onToggle: () => void;
  onItemToggle: (orderId: string, itemId: string) => void;
}

export default function PickListVendor({
  vendorPickList,
  isExpanded,
  onToggle,
  onItemToggle,
}: PickListVendorProps) {
  const progress = vendorPickList.totalItems > 0
    ? (vendorPickList.packedItems / vendorPickList.totalItems) * 100
    : 0;

  const isComplete = progress === 100;
  const hasStarted = progress > 0;

  // Group items by product
  const itemsByProduct = vendorPickList.items.reduce((acc, item) => {
    const key = item.productId;
    if (!acc[key]) {
      acc[key] = {
        productName: item.productName,
        unit: item.unit,
        items: [],
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {} as Record<string, { productName: string; unit: string; items: typeof vendorPickList.items }>);

  return (
    <div className="bg-white rounded-xl border-2 border-[#E3E2E0] overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-[#F7F6F3] transition-colors"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown size={20} className="text-[#787774]" />
          ) : (
            <ChevronRight size={20} className="text-[#787774]" />
          )}
          <div className="text-left">
            <h3 className="font-semibold text-[#37352F]">{vendorPickList.vendorName}</h3>
            <p className="text-xs text-[#787774]">
              {vendorPickList.totalItems} items
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="flex items-center gap-1 text-sm font-medium text-[#2E7D32]">
              <CheckCircle2 size={16} className="text-[#3DDC97]" />
              Complete
            </span>
          ) : hasStarted ? (
            <span className="flex items-center gap-1 text-sm font-medium text-[#E65100]">
              <Circle size={16} className="text-[#FFA726]" fill="#FFA726" strokeWidth={0} />
              In Progress
            </span>
          ) : (
            <span className="flex items-center gap-1 text-sm font-medium text-[#787774]">
              <Circle size={16} className="text-[#E3E2E0]" />
              Not Started
            </span>
          )}
        </div>
      </button>

      {/* Progress Bar */}
      <div className="px-4 pb-2">
        <div className="h-1.5 bg-[#F7F6F3] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isComplete ? 'bg-[#3DDC97]' : 'bg-[#4A7C28]'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-[#E3E2E0]">
          {Object.entries(itemsByProduct).map(([productId, { productName, items }]) => (
            <div key={productId} className="border-b border-[#E3E2E0] last:border-b-0">
              <div className="px-4 py-2 bg-[#F7F6F3]">
                <h4 className="text-sm font-medium text-[#37352F]">{productName}</h4>
              </div>
              <div className="divide-y divide-[#E3E2E0]">
                {items.map(item => (
                  <div key={item.itemId} className="px-4">
                    <PickListItem
                      item={item}
                      onToggle={() => onItemToggle(item.orderId, item.itemId)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
