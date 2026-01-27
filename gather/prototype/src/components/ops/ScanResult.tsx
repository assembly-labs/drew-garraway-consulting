import { CheckCircle2, XCircle, AlertTriangle, Clock, Package } from 'lucide-react';
import type { Order } from '../../types/ops';
import { pickupSlots } from '../../data/mockOrders';

type ScanError = 'not_found' | 'already_picked_up' | 'wrong_day' | 'not_packed' | 'cancelled';

interface ScanResultProps {
  order: Order | null;
  error?: ScanError;
  onComplete: () => void;
  onCancel: () => void;
}

const errorMessages: Record<ScanError, { title: string; message: string; icon: React.ReactNode }> = {
  not_found: {
    title: 'Order Not Found',
    message: 'This QR code is not recognized. Try manual lookup.',
    icon: <XCircle size={48} className="text-[#FF6B6B]" />,
  },
  already_picked_up: {
    title: 'Already Picked Up',
    message: 'This order has already been collected.',
    icon: <CheckCircle2 size={48} className="text-[#4A7C28]" />,
  },
  wrong_day: {
    title: 'Wrong Pickup Day',
    message: 'This order is scheduled for a different day.',
    icon: <Clock size={48} className="text-[#FFA726]" />,
  },
  not_packed: {
    title: 'Order Not Ready',
    message: 'This order has not been fully packed yet.',
    icon: <Package size={48} className="text-[#FFA726]" />,
  },
  cancelled: {
    title: 'Order Cancelled',
    message: 'This order has been cancelled.',
    icon: <XCircle size={48} className="text-[#787774]" />,
  },
};

export default function ScanResult({ order, error, onComplete, onCancel }: ScanResultProps) {
  // Error state
  if (error) {
    const errorInfo = errorMessages[error];
    return (
      <div className="bg-white rounded-2xl border-2 border-[#E3E2E0] p-6 text-center">
        <div className="flex justify-center mb-4">
          {errorInfo.icon}
        </div>
        <h2 className="text-xl font-bold text-[#37352F] mb-2">{errorInfo.title}</h2>
        <p className="text-[#787774] mb-6">{errorInfo.message}</p>
        {error === 'already_picked_up' && order && (
          <p className="text-sm text-[#787774] mb-6">
            Picked up at {order.pickedUpAt?.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </p>
        )}
        <button
          onClick={onCancel}
          className="w-full py-3 border-2 border-[#E3E2E0] rounded-xl font-semibold text-[#37352F] hover:bg-[#F7F6F3] transition-colors"
        >
          Scan Another
        </button>
      </div>
    );
  }

  // Success state - order found
  if (order) {
    const slot = pickupSlots.find(s => s.id === order.pickupSlotId);
    const hasIssues = order.items.some(i => i.status === 'unavailable');

    return (
      <div className="bg-white rounded-2xl border-2 border-[#81C784] p-6">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} className="text-[#3DDC97]" />
            </div>
          </div>
          <p className="text-sm font-medium text-[#3DDC97] uppercase tracking-wide">Order Found</p>
          <h2 className="text-2xl font-bold text-[#37352F] mt-1">{order.orderNumber}</h2>
          <p className="text-lg text-[#37352F] mt-1">{order.customerName}</p>
        </div>

        {/* Order Summary */}
        <div className="border-t border-[#E3E2E0] pt-4 mb-6">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-[#787774]">Pickup Slot</span>
            <span className="font-medium text-[#37352F]">{slot?.label}</span>
          </div>
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-[#787774]">Items</span>
            <span className="font-medium text-[#37352F]">{order.items.length} items</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#787774]">Total</span>
            <span className="font-bold text-[#37352F]">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-[#F7F6F3] rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
          <h3 className="text-xs font-semibold text-[#787774] uppercase tracking-wide mb-2">Items</h3>
          <ul className="space-y-2">
            {order.items.map(item => (
              <li
                key={item.id}
                className={`flex items-center justify-between text-sm ${
                  item.status === 'unavailable' ? 'text-[#787774] line-through' : 'text-[#37352F]'
                }`}
              >
                <span>{item.productName}</span>
                <span>x{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Issue Warning */}
        {hasIssues && (
          <div className="bg-[#FFF9C4] rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle size={20} className="text-[#E65100] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#E65100]">Some items unavailable</p>
              <p className="text-xs text-[#787774] mt-1">
                Customer has been notified. Refund may be pending.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onComplete}
            className="w-full py-4 bg-gradient-to-r from-[#FFE082] via-[#81C784] to-[#4CAF50] text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={24} />
            Complete Pickup
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 text-[#787774] hover:text-[#37352F] transition-colors"
          >
            Cancel - Scan Another
          </button>
        </div>
      </div>
    );
  }

  return null;
}
