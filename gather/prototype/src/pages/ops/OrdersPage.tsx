import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOps } from '../../context/OpsContext';
import FilterBar from '../../components/ops/FilterBar';
import OrderCard from '../../components/ops/OrderCard';
import OrderDetailPanel from '../../components/ops/OrderDetailPanel';
import type { OrderFilterStatus, ItemStatus } from '../../types/ops';

export default function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    orders,
    getOrdersByStatus,
    markOrderPacked,
    markOrderPickedUp,
    updateItemStatus,
    getOrderById,
  } = useOps();

  // Filter state from URL params
  const [activeStatus, setActiveStatus] = useState<OrderFilterStatus>(
    (searchParams.get('status') as OrderFilterStatus) || 'all'
  );
  const [activeSlot, setActiveSlot] = useState(searchParams.get('slot') || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected order for detail panel
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    searchParams.get('order') || null
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeStatus !== 'all') params.set('status', activeStatus);
    if (activeSlot !== 'all') params.set('slot', activeSlot);
    if (selectedOrderId) params.set('order', selectedOrderId);
    setSearchParams(params, { replace: true });
  }, [activeStatus, activeSlot, selectedOrderId, setSearchParams]);

  // Filter counts
  const counts = useMemo(() => ({
    all: orders.filter(o => o.status !== 'cancelled').length,
    pending: orders.filter(o => o.status === 'pending').length,
    packed: orders.filter(o => o.status === 'packed').length,
    picked_up: orders.filter(o => o.status === 'picked_up').length,
    issues: orders.filter(o =>
      o.status !== 'cancelled' &&
      o.status !== 'picked_up' &&
      o.items.some(item => item.status === 'unavailable')
    ).length,
  }), [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = getOrdersByStatus(activeStatus);

    // Filter by slot
    if (activeSlot !== 'all') {
      result = result.filter(o => o.pickupSlotId === activeSlot);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(o =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        o.customerEmail.toLowerCase().includes(query)
      );
    }

    // Sort by pickup slot, then by order number
    result.sort((a, b) => {
      if (a.pickupSlotId !== b.pickupSlotId) {
        return a.pickupSlotId.localeCompare(b.pickupSlotId);
      }
      return a.orderNumber.localeCompare(b.orderNumber);
    });

    return result;
  }, [activeStatus, activeSlot, searchQuery, getOrdersByStatus]);

  // Selected order
  const selectedOrder = selectedOrderId ? getOrderById(selectedOrderId) : null;

  // Handlers
  const handleStatusChange = (status: OrderFilterStatus) => {
    setActiveStatus(status);
  };

  const handleSlotChange = (slot: string) => {
    setActiveSlot(slot);
  };

  const handleOrderClick = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleClosePanel = () => {
    setSelectedOrderId(null);
  };

  const handleMarkPacked = (orderId: string) => {
    markOrderPacked(orderId);
  };

  const handleMarkPickedUp = (orderId: string) => {
    markOrderPickedUp(orderId);
  };

  const handleItemStatusChange = (orderId: string, itemId: string, status: ItemStatus) => {
    updateItemStatus(orderId, itemId, status);
  };

  return (
    <div className="p-4">
      {/* Filters */}
      <FilterBar
        activeStatus={activeStatus}
        onStatusChange={handleStatusChange}
        activeSlot={activeSlot}
        onSlotChange={handleSlotChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
      />

      {/* Orders Grid */}
      <div className="mt-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#787774]">No orders found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm text-[#4A7C28] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => handleOrderClick(order.id)}
                onMarkPacked={() => handleMarkPacked(order.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Panel */}
      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={handleClosePanel}
          onMarkPacked={() => handleMarkPacked(selectedOrder.id)}
          onMarkPickedUp={() => handleMarkPickedUp(selectedOrder.id)}
          onItemStatusChange={(itemId, status) =>
            handleItemStatusChange(selectedOrder.id, itemId, status)
          }
        />
      )}
    </div>
  );
}
