import { useState, useMemo } from 'react';
import { ScanLine, Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useOps } from '../../context/OpsContext';
import ScanResult from '../../components/ops/ScanResult';
import type { Order } from '../../types/ops';
import { pickupSlots } from '../../data/mockOrders';

type ScanError = 'not_found' | 'already_picked_up' | 'wrong_day' | 'not_packed' | 'cancelled';

interface CheckInRecord {
  order: Order;
  time: Date;
}

export default function CheckInPage() {
  const { orders, getOrderById, markOrderPickedUp } = useOps();

  const [scanMode, setScanMode] = useState<'idle' | 'result' | 'manual'>('idle');
  const [scannedOrder, setScannedOrder] = useState<Order | null>(null);
  const [scanError, setScanError] = useState<ScanError | undefined>();
  const [recentCheckIns, setRecentCheckIns] = useState<CheckInRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate QR selection (for prototype)
  const [selectedQROrder, setSelectedQROrder] = useState<string>('');

  // Get packed orders for simulation dropdown
  const packedOrders = useMemo(() =>
    orders.filter(o => o.status === 'packed'),
    [orders]
  );

  // Get orders for manual lookup (packed + pending)
  const availableOrders = useMemo(() =>
    orders.filter(o => o.status === 'packed' || o.status === 'pending'),
    [orders]
  );

  // Filtered orders for manual search
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return availableOrders.slice(0, 10);
    const query = searchQuery.toLowerCase();
    return availableOrders.filter(o =>
      o.orderNumber.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query) ||
      o.customerEmail.toLowerCase().includes(query)
    );
  }, [searchQuery, availableOrders]);

  const handleSimulateScan = () => {
    if (!selectedQROrder) return;

    const order = getOrderById(selectedQROrder);
    if (!order) {
      setScanError('not_found');
      setScannedOrder(null);
      setScanMode('result');
      return;
    }

    // Check for various error conditions
    if (order.status === 'picked_up') {
      setScanError('already_picked_up');
      setScannedOrder(order);
    } else if (order.status === 'cancelled') {
      setScanError('cancelled');
      setScannedOrder(null);
    } else if (order.status === 'pending') {
      setScanError('not_packed');
      setScannedOrder(order);
    } else {
      setScanError(undefined);
      setScannedOrder(order);
    }

    setScanMode('result');
  };

  const handleManualSelect = (order: Order) => {
    if (order.status === 'picked_up') {
      setScanError('already_picked_up');
      setScannedOrder(order);
    } else if (order.status === 'pending') {
      setScanError('not_packed');
      setScannedOrder(order);
    } else {
      setScanError(undefined);
      setScannedOrder(order);
    }
    setScanMode('result');
  };

  const handleComplete = () => {
    if (!scannedOrder) return;

    markOrderPickedUp(scannedOrder.id);

    // Add to recent check-ins
    setRecentCheckIns(prev => [
      { order: scannedOrder, time: new Date() },
      ...prev.slice(0, 9),
    ]);

    // Reset state
    setScannedOrder(null);
    setScanError(undefined);
    setScanMode('idle');
    setSelectedQROrder('');
  };

  const handleCancel = () => {
    setScannedOrder(null);
    setScanError(undefined);
    setScanMode('idle');
    setSelectedQROrder('');
    setSearchQuery('');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Main Scanner Area */}
      {scanMode === 'idle' && (
        <>
          {/* Scanner Simulation */}
          <div className="bg-white rounded-2xl border-2 border-[#E3E2E0] p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[#E8F5E9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ScanLine size={40} className="text-[#4A7C28]" />
              </div>
              <h2 className="text-lg font-bold text-[#37352F]">Scan QR Code</h2>
              <p className="text-sm text-[#787774] mt-1">
                Point camera at customer's QR code
              </p>
            </div>

            {/* Camera Placeholder */}
            <div className="aspect-square max-w-xs mx-auto bg-[#37352F] rounded-xl flex items-center justify-center mb-6 relative overflow-hidden">
              <div className="absolute inset-4 border-2 border-white/30 rounded-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-1 bg-[#3DDC97] animate-pulse" />
              </div>
              <p className="text-white/50 text-sm absolute bottom-4">Camera preview</p>
            </div>

            {/* Prototype Testing */}
            <div className="border-t border-dashed border-[#E3E2E0] pt-4 mt-4">
              <p className="text-xs text-[#787774] uppercase tracking-wide mb-3 text-center">
                Prototype Testing
              </p>
              <div className="flex gap-2">
                <select
                  value={selectedQROrder}
                  onChange={(e) => setSelectedQROrder(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#F7F6F3] border border-[#E3E2E0] rounded-lg text-sm"
                >
                  <option value="">Select order to scan...</option>
                  {orders.filter(o => o.status !== 'cancelled').map(order => (
                    <option key={order.id} value={order.id}>
                      {order.orderNumber} - {order.customerName} ({order.status})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSimulateScan}
                  disabled={!selectedQROrder}
                  className="px-4 py-2 bg-[#4A7C28] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Simulate Scan
                </button>
              </div>
            </div>

            {/* Manual Lookup */}
            <button
              onClick={() => setScanMode('manual')}
              className="w-full mt-4 py-3 border-2 border-[#E3E2E0] rounded-xl font-medium text-[#787774] hover:text-[#37352F] hover:bg-[#F7F6F3] transition-colors flex items-center justify-center gap-2"
            >
              <Search size={18} />
              Look Up Order Manually
            </button>
          </div>

          {/* Recent Check-ins */}
          {recentCheckIns.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-[#787774] uppercase tracking-wide mb-3">
                Recent Check-ins
              </h3>
              <div className="space-y-2">
                {recentCheckIns.map((record, index) => (
                  <div
                    key={`${record.order.id}-${index}`}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E3E2E0]"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-[#3DDC97]" />
                      <div>
                        <p className="text-sm font-medium text-[#37352F]">
                          {record.order.orderNumber}
                        </p>
                        <p className="text-xs text-[#787774]">{record.order.customerName}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#787774]">
                      {record.time.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Packed Orders Ready */}
          <section>
            <h3 className="text-sm font-semibold text-[#787774] uppercase tracking-wide mb-3">
              Ready for Pickup ({packedOrders.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {packedOrders.slice(0, 10).map(order => {
                const slot = pickupSlots.find(s => s.id === order.pickupSlotId);
                const hasIssues = order.items.some(i => i.status === 'unavailable');
                return (
                  <button
                    key={order.id}
                    onClick={() => handleManualSelect(order)}
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-[#E3E2E0] hover:border-[#4A7C28] transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#37352F]">
                          {order.orderNumber}
                          {hasIssues && (
                            <AlertTriangle size={12} className="inline ml-1 text-[#FF6B6B]" />
                          )}
                        </p>
                        <p className="text-xs text-[#787774]">{order.customerName}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#787774]">{slot?.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* Manual Lookup Mode */}
      {scanMode === 'manual' && (
        <div className="bg-white rounded-2xl border-2 border-[#E3E2E0] p-6">
          <h2 className="text-lg font-bold text-[#37352F] mb-4">Find Order</h2>

          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#787774]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, name, or email..."
              className="w-full pl-10 pr-4 py-3 border-2 border-[#E3E2E0] rounded-xl text-[#37352F] placeholder-[#787774] focus:outline-none focus:border-[#4A7C28]"
              autoFocus
            />
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredOrders.map(order => {
              const slot = pickupSlots.find(s => s.id === order.pickupSlotId);
              return (
                <button
                  key={order.id}
                  onClick={() => handleManualSelect(order)}
                  className="w-full flex items-center justify-between p-3 bg-[#F7F6F3] rounded-lg hover:bg-[#E8F5E9] transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-[#37352F]">
                      {order.orderNumber} - {order.customerName}
                    </p>
                    <p className="text-xs text-[#787774]">
                      {order.status === 'packed' ? 'Ready' : 'Pending'} &middot; {slot?.label}
                    </p>
                  </div>
                </button>
              );
            })}
            {filteredOrders.length === 0 && (
              <p className="text-center py-4 text-[#787774]">No orders found</p>
            )}
          </div>

          <button
            onClick={handleCancel}
            className="w-full mt-4 py-3 border-2 border-[#E3E2E0] rounded-xl font-medium text-[#787774] hover:text-[#37352F] hover:bg-[#F7F6F3] transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Scan Result */}
      {scanMode === 'result' && (
        <ScanResult
          order={scannedOrder}
          error={scanError}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
