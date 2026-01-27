import { ChevronRight, AlertTriangle } from 'lucide-react';
import type { Order } from '../../types/ops';
import StatusBadge from './StatusBadge';
import { pickupSlots } from '../../data/mockOrders';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
  onMarkPacked?: () => void;
  showCheckbox?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function OrderCard({
  order,
  onClick,
  onMarkPacked,
  showCheckbox = false,
  isSelected = false,
  onSelect,
}: OrderCardProps) {
  const slot = pickupSlots.find(s => s.id === order.pickupSlotId);
  const hasIssues = order.items.some(item => item.status === 'unavailable');

  // Group items by vendor
  const vendorCounts = order.items.reduce((acc, item) => {
    acc[item.vendorName] = (acc[item.vendorName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const vendorList = Object.entries(vendorCounts);
  const displayedVendors = vendorList.slice(0, 2);
  const remainingVendors = vendorList.length - 2;

  const handleMarkPacked = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkPacked?.();
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
        hasIssues
          ? 'border-[#FFCDD2]'
          : order.status === 'packed'
          ? 'border-[#81C784]'
          : 'border-[#E3E2E0]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {showCheckbox && (
            <button
              onClick={handleSelect}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-[#4A7C28] border-[#4A7C28]'
                  : 'border-[#E3E2E0] hover:border-[#4A7C28]'
              }`}
            >
              {isSelected && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          )}
          <span className="font-bold text-[#37352F] font-['DM_Sans']">
            {order.orderNumber}
          </span>
          {hasIssues && (
            <AlertTriangle size={16} className="text-[#FF6B6B]" />
          )}
        </div>
        <StatusBadge status={order.status} size="sm" />
      </div>

      {/* Customer & Pickup */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className="font-medium text-[#37352F]">{order.customerName}</span>
        <span className="text-[#787774]">{slot?.label}</span>
      </div>

      {/* Vendors */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {displayedVendors.map(([vendor, count]) => (
            <span
              key={vendor}
              className="inline-flex items-center px-2 py-0.5 bg-[#F7F6F3] rounded text-xs text-[#787774]"
            >
              {vendor} ({count})
            </span>
          ))}
          {remainingVendors > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 bg-[#F7F6F3] rounded text-xs text-[#787774]">
              +{remainingVendors} more
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E3E2E0]">
        <span className="font-semibold text-[#37352F]">
          ${order.total.toFixed(2)}
        </span>
        <div className="flex items-center gap-2">
          {order.status === 'pending' && onMarkPacked && (
            <button
              onClick={handleMarkPacked}
              className="px-3 py-1.5 bg-[#4A7C28] text-white text-sm font-medium rounded-lg hover:bg-[#3A6A1F] transition-colors"
            >
              Mark Packed
            </button>
          )}
          <ChevronRight size={20} className="text-[#787774]" />
        </div>
      </div>
    </div>
  );
}
