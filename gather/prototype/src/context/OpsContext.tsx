import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  Order,
  OrderStatus,
  ItemStatus,
  PickupSlot,
  DashboardStats,
  SlotStats,
  VendorPickList,
  PickListItem,
} from '../types/ops';
import { initialMockOrders, pickupSlots } from '../data/mockOrders';
import { getVendorById } from '../data/vendors';

const OPS_STORAGE_KEY = 'gather_ops_orders';

interface OpsContextType {
  // Data
  orders: Order[];
  pickupSlots: PickupSlot[];

  // Order Management
  getOrderById: (id: string) => Order | undefined;
  getOrderByQR: (qrCode: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateItemStatus: (orderId: string, itemId: string, status: ItemStatus) => void;
  markOrderPacked: (orderId: string) => void;
  markOrderPickedUp: (orderId: string) => void;
  addOrderNote: (orderId: string, note: string) => void;

  // Stats & Aggregations
  getDashboardStats: () => DashboardStats;
  getOrdersByStatus: (status: OrderStatus | 'all' | 'issues') => Order[];
  getOrdersBySlot: (slotId: string) => Order[];
  getPickListByVendor: () => VendorPickList[];

  // Actions
  addOrder: (order: Order) => void;
  resetOrders: () => void;
}

const OpsContext = createContext<OpsContextType | undefined>(undefined);

export function OpsProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem(OPS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Rehydrate Date objects
        return parsed.map((order: Order) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          packedAt: order.packedAt ? new Date(order.packedAt) : undefined,
          pickedUpAt: order.pickedUpAt ? new Date(order.pickedUpAt) : undefined,
        }));
      } catch {
        return initialMockOrders;
      }
    }
    return initialMockOrders;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(OPS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  // Get order by ID
  const getOrderById = useCallback((id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  }, [orders]);

  // Get order by QR code
  const getOrderByQR = useCallback((qrCode: string): Order | undefined => {
    return orders.find(order => order.qrCode === qrCode);
  }, [orders]);

  // Update order status
  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        status,
        packedAt: status === 'packed' ? new Date() : order.packedAt,
        pickedUpAt: status === 'picked_up' ? new Date() : order.pickedUpAt,
      };
    }));
  }, []);

  // Update item status
  const updateItemStatus = useCallback((orderId: string, itemId: string, status: ItemStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        items: order.items.map(item =>
          item.id === itemId ? { ...item, status } : item
        ),
      };
    }));
  }, []);

  // Mark order as packed
  const markOrderPacked = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        status: 'packed',
        packedAt: new Date(),
        items: order.items.map(item => ({
          ...item,
          status: item.status === 'unavailable' ? 'unavailable' : 'packed',
        })),
      };
    }));
  }, []);

  // Mark order as picked up
  const markOrderPickedUp = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        status: 'picked_up',
        pickedUpAt: new Date(),
      };
    }));
  }, []);

  // Add note to order
  const addOrderNote = useCallback((orderId: string, note: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      const existingNotes = order.notes ? order.notes + '\n' : '';
      return {
        ...order,
        notes: existingNotes + note,
      };
    }));
  }, []);

  // Get dashboard stats
  const getDashboardStats = useCallback((): DashboardStats => {
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const packedOrders = orders.filter(o => o.status === 'packed').length;
    const pickedUpOrders = orders.filter(o => o.status === 'picked_up').length;
    const issueOrders = orders.filter(o =>
      o.status !== 'cancelled' &&
      o.status !== 'picked_up' &&
      o.items.some(item => item.status === 'unavailable')
    ).length;

    const slotStats: SlotStats[] = pickupSlots.map(slot => {
      const slotOrders = orders.filter(o => o.pickupSlotId === slot.id);
      return {
        slotId: slot.id,
        label: slot.label,
        totalOrders: slotOrders.filter(o => o.status !== 'cancelled').length,
        packedOrders: slotOrders.filter(o => o.status === 'packed' || o.status === 'picked_up').length,
        pickedUpOrders: slotOrders.filter(o => o.status === 'picked_up').length,
      };
    });

    return {
      totalOrders: orders.filter(o => o.status !== 'cancelled').length,
      pendingOrders,
      packedOrders,
      pickedUpOrders,
      issueOrders,
      slotStats,
    };
  }, [orders]);

  // Get orders by status
  const getOrdersByStatus = useCallback((status: OrderStatus | 'all' | 'issues'): Order[] => {
    if (status === 'all') {
      return orders.filter(o => o.status !== 'cancelled');
    }
    if (status === 'issues') {
      return orders.filter(o =>
        o.status !== 'cancelled' &&
        o.status !== 'picked_up' &&
        o.items.some(item => item.status === 'unavailable')
      );
    }
    return orders.filter(o => o.status === status);
  }, [orders]);

  // Get orders by slot
  const getOrdersBySlot = useCallback((slotId: string): Order[] => {
    return orders.filter(o => o.pickupSlotId === slotId && o.status !== 'cancelled');
  }, [orders]);

  // Get pick lists grouped by vendor
  const getPickListByVendor = useCallback((): VendorPickList[] => {
    const vendorMap = new Map<string, VendorPickList>();

    // Only include pending/partially packed orders
    const activeOrders = orders.filter(o =>
      o.status === 'pending' || o.status === 'packed'
    );

    for (const order of activeOrders) {
      for (const item of order.items) {
        // Skip already packed items and unavailable items
        if (item.status === 'packed' || item.status === 'unavailable') continue;

        let vendorList = vendorMap.get(item.vendorId);
        if (!vendorList) {
          const vendor = getVendorById(item.vendorId);
          vendorList = {
            vendorId: item.vendorId,
            vendorName: vendor?.name || 'Unknown Vendor',
            items: [],
            totalItems: 0,
            packedItems: 0,
          };
          vendorMap.set(item.vendorId, vendorList);
        }

        const pickListItem: PickListItem = {
          productId: item.productId,
          productName: item.productName,
          unit: item.unit,
          quantity: item.quantity,
          orderId: order.id,
          orderNumber: order.orderNumber,
          itemId: item.id,
          isPacked: false, // Items in this loop are pending (we filtered out packed above)
        };

        vendorList.items.push(pickListItem);
        vendorList.totalItems += item.quantity;
      }
    }

    // Also count already packed items for progress
    for (const order of activeOrders) {
      for (const item of order.items) {
        if (item.status === 'packed') {
          let vendorList = vendorMap.get(item.vendorId);
          if (!vendorList) {
            const vendor = getVendorById(item.vendorId);
            vendorList = {
              vendorId: item.vendorId,
              vendorName: vendor?.name || 'Unknown Vendor',
              items: [],
              totalItems: 0,
              packedItems: 0,
            };
            vendorMap.set(item.vendorId, vendorList);
          }
          vendorList.totalItems += item.quantity;
          vendorList.packedItems += item.quantity;
        }
      }
    }

    return Array.from(vendorMap.values()).sort((a, b) =>
      a.vendorName.localeCompare(b.vendorName)
    );
  }, [orders]);

  // Add a new order (from customer checkout)
  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [...prev, order]);
  }, []);

  // Reset to initial mock data
  const resetOrders = useCallback(() => {
    setOrders(initialMockOrders);
  }, []);

  return (
    <OpsContext.Provider
      value={{
        orders,
        pickupSlots,
        getOrderById,
        getOrderByQR,
        updateOrderStatus,
        updateItemStatus,
        markOrderPacked,
        markOrderPickedUp,
        addOrderNote,
        getDashboardStats,
        getOrdersByStatus,
        getOrdersBySlot,
        getPickListByVendor,
        addOrder,
        resetOrders,
      }}
    >
      {children}
    </OpsContext.Provider>
  );
}

export function useOps() {
  const context = useContext(OpsContext);
  if (!context) {
    throw new Error('useOps must be used within an OpsProvider');
  }
  return context;
}
