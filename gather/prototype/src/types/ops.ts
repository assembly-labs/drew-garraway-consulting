// Operations Dashboard Types

// Order statuses
export type OrderStatus = 'pending' | 'packed' | 'picked_up' | 'cancelled';
export type ItemStatus = 'pending' | 'packed' | 'unavailable' | 'substituted';

// Pickup time slots
export interface PickupSlot {
  id: string;
  label: string;         // "9:00am - 10:00am"
  startTime: string;     // "09:00"
  endTime: string;       // "10:00"
  maxOrders: number;
}

// Order item (line item in an order)
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  vendorId: string;
  vendorName: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  lineTotal: number;
  status: ItemStatus;
  substitutedWith?: string;  // Product ID if substituted
  notes?: string;
}

// Full order
export interface Order {
  id: string;
  orderNumber: string;      // "BFM-2024-0047"
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  pickupSlotId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  qrCode: string;           // Unique token for scanning
  specialInstructions?: string;
  notes?: string;           // Internal staff notes
  createdAt: Date;
  packedAt?: Date;
  pickedUpAt?: Date;
}

// Dashboard stats
export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  packedOrders: number;
  pickedUpOrders: number;
  issueOrders: number;
  slotStats: SlotStats[];
}

export interface SlotStats {
  slotId: string;
  label: string;
  totalOrders: number;
  packedOrders: number;
  pickedUpOrders: number;
}

// Vendor pick list
export interface VendorPickList {
  vendorId: string;
  vendorName: string;
  items: PickListItem[];
  totalItems: number;
  packedItems: number;
}

export interface PickListItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  orderId: string;
  orderNumber: string;
  itemId: string;
  isPacked: boolean;
}

// Filter state for orders page
export type OrderFilterStatus = 'all' | OrderStatus | 'issues';

export interface OrderFilters {
  status: OrderFilterStatus;
  slotId: string | 'all';
  searchQuery: string;
}
