import { X, Phone, Mail, Clock, MapPin, CheckCircle2, AlertTriangle, Package } from 'lucide-react';
import type { Order, OrderItem, ItemStatus } from '../../types/ops';
import StatusBadge from './StatusBadge';
import { pickupSlots } from '../../data/mockOrders';

interface OrderDetailPanelProps {
  order: Order;
  onClose: () => void;
  onMarkPacked: () => void;
  onMarkPickedUp: () => void;
  onItemStatusChange: (itemId: string, status: ItemStatus) => void;
}

export default function OrderDetailPanel({
  order,
  onClose,
  onMarkPacked,
  onMarkPickedUp,
  onItemStatusChange,
}: OrderDetailPanelProps) {
  const slot = pickupSlots.find(s => s.id === order.pickupSlotId);

  // Group items by vendor
  const itemsByVendor = order.items.reduce((acc, item) => {
    if (!acc[item.vendorName]) {
      acc[item.vendorName] = [];
    }
    acc[item.vendorName].push(item);
    return acc;
  }, {} as Record<string, OrderItem[]>);

  const allItemsPacked = order.items.every(
    item => item.status === 'packed' || item.status === 'unavailable'
  );
  const hasUnavailableItems = order.items.some(item => item.status === 'unavailable');

  const toggleItemPacked = (item: OrderItem) => {
    if (item.status === 'unavailable') return;
    const newStatus: ItemStatus = item.status === 'packed' ? 'pending' : 'packed';
    onItemStatusChange(item.id, newStatus);
  };

  const markItemUnavailable = (item: OrderItem) => {
    onItemStatusChange(item.id, 'unavailable');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E3E2E0]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#F7F6F3] rounded-lg transition-colors"
            >
              <X size={20} className="text-[#787774]" />
            </button>
            <div>
              <h2 className="font-bold text-lg text-[#37352F] font-['DM_Sans']">
                {order.orderNumber}
              </h2>
              <StatusBadge status={order.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Customer Info */}
          <section>
            <h3 className="text-xs font-semibold text-[#787774] uppercase tracking-wide mb-2">
              Customer
            </h3>
            <div className="bg-[#F7F6F3] rounded-lg p-3 space-y-2">
              <p className="font-semibold text-[#37352F]">{order.customerName}</p>
              <div className="flex items-center gap-2 text-sm text-[#787774]">
                <Mail size={14} />
                <span>{order.customerEmail}</span>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-2 text-sm text-[#787774]">
                  <Phone size={14} />
                  <span>{order.customerPhone}</span>
                </div>
              )}
            </div>
          </section>

          {/* Pickup Info */}
          <section>
            <h3 className="text-xs font-semibold text-[#787774] uppercase tracking-wide mb-2">
              Pickup
            </h3>
            <div className="bg-[#E8F5E9] rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#2E7D32]">
                <Clock size={14} />
                <span className="font-medium">{slot?.label}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#2E7D32]">
                <MapPin size={14} />
                <span>Berwyn Farmers Market</span>
              </div>
            </div>
          </section>

          {/* Items by Vendor */}
          <section>
            <h3 className="text-xs font-semibold text-[#787774] uppercase tracking-wide mb-2">
              Items ({order.items.length})
            </h3>
            <div className="space-y-4">
              {Object.entries(itemsByVendor).map(([vendorName, items]) => (
                <div key={vendorName} className="bg-white border border-[#E3E2E0] rounded-lg overflow-hidden">
                  <div className="px-3 py-2 bg-[#F7F6F3] border-b border-[#E3E2E0]">
                    <span className="text-sm font-semibold text-[#37352F]">{vendorName}</span>
                  </div>
                  <div className="divide-y divide-[#E3E2E0]">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className={`p-3 flex items-center gap-3 ${
                          item.status === 'unavailable' ? 'bg-[#FFEBEE]' : ''
                        }`}
                      >
                        <button
                          onClick={() => toggleItemPacked(item)}
                          disabled={item.status === 'unavailable'}
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                            item.status === 'packed'
                              ? 'bg-[#4A7C28] border-[#4A7C28]'
                              : item.status === 'unavailable'
                              ? 'bg-[#FFCDD2] border-[#FF6B6B] cursor-not-allowed'
                              : 'border-[#E3E2E0] hover:border-[#4A7C28]'
                          }`}
                        >
                          {item.status === 'packed' && (
                            <CheckCircle2 size={16} className="text-white" />
                          )}
                          {item.status === 'unavailable' && (
                            <X size={14} className="text-[#FF6B6B]" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            item.status === 'unavailable' ? 'text-[#787774] line-through' : 'text-[#37352F]'
                          }`}>
                            {item.productName}
                          </p>
                          <p className="text-xs text-[#787774]">
                            x{item.quantity} @ ${item.unitPrice.toFixed(2)}/{item.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-[#37352F]">
                            ${item.lineTotal.toFixed(2)}
                          </p>
                          {item.status !== 'unavailable' && order.status === 'pending' && (
                            <button
                              onClick={() => markItemUnavailable(item)}
                              className="text-xs text-[#FF6B6B] hover:underline"
                            >
                              Mark unavailable
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <section>
              <h3 className="text-xs font-semibold text-[#787774] uppercase tracking-wide mb-2">
                Special Instructions
              </h3>
              <div className="bg-[#FFF9C4] rounded-lg p-3">
                <p className="text-sm text-[#37352F]">{order.specialInstructions}</p>
              </div>
            </section>
          )}

          {/* Staff Notes */}
          {order.notes && (
            <section>
              <h3 className="text-xs font-semibold text-[#787774] uppercase tracking-wide mb-2">
                Staff Notes
              </h3>
              <div className="bg-[#FFEBEE] rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle size={16} className="text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#37352F]">{order.notes}</p>
              </div>
            </section>
          )}

          {/* Order Total */}
          <section className="pt-4 border-t border-[#E3E2E0]">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#787774]">Subtotal</span>
                <span className="text-[#37352F]">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#787774]">Service Fee</span>
                <span className="text-[#37352F]">${order.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-[#37352F]">Total</span>
                <span className="text-[#37352F]">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Actions Footer */}
        <div className="p-4 border-t border-[#E3E2E0] space-y-2">
          {order.status === 'pending' && (
            <button
              onClick={onMarkPacked}
              disabled={!allItemsPacked && !hasUnavailableItems}
              className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                allItemsPacked || hasUnavailableItems
                  ? 'bg-[#4A7C28] text-white hover:bg-[#3A6A1F]'
                  : 'bg-[#E3E2E0] text-[#787774] cursor-not-allowed'
              }`}
            >
              <Package size={20} />
              Mark Order as Packed
            </button>
          )}
          {order.status === 'packed' && (
            <button
              onClick={onMarkPickedUp}
              className="w-full py-3 bg-gradient-to-r from-[#FFE082] via-[#81C784] to-[#4CAF50] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={20} />
              Complete Pickup
            </button>
          )}
          {order.status === 'picked_up' && (
            <div className="text-center py-3 bg-[#E8F5E9] rounded-xl">
              <p className="text-sm font-medium text-[#2E7D32]">
                Picked up at {order.pickedUpAt?.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
