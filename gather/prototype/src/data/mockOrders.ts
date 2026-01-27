import type { Order, OrderItem, PickupSlot, ItemStatus } from '../types/ops';
import { getProductById } from './products';
import { getVendorById } from './vendors';

// Pickup slots for the market
export const pickupSlots: PickupSlot[] = [
  { id: 'slot-1', label: '9:00am - 10:00am', startTime: '09:00', endTime: '10:00', maxOrders: 20 },
  { id: 'slot-2', label: '10:00am - 11:00am', startTime: '10:00', endTime: '11:00', maxOrders: 25 },
  { id: 'slot-3', label: '11:00am - 12:00pm', startTime: '11:00', endTime: '12:00', maxOrders: 25 },
  { id: 'slot-4', label: '12:00pm - 1:00pm', startTime: '12:00', endTime: '13:00', maxOrders: 20 },
];

// Helper to generate order number
const generateOrderNumber = (index: number): string => {
  return `BFM-${String(index).padStart(3, '0')}`;
};

// Helper to generate QR code
const generateQRCode = (orderId: string): string => {
  return `gather-${orderId}-${Math.random().toString(36).substring(2, 10)}`;
};

// Helper to create order item from product
const createOrderItem = (
  productId: string,
  quantity: number,
  status: ItemStatus = 'pending'
): OrderItem | null => {
  const product = getProductById(productId);
  if (!product) return null;
  const vendor = getVendorById(product.vendorId);
  if (!vendor) return null;

  return {
    id: `item-${productId}-${Math.random().toString(36).substring(2, 8)}`,
    productId,
    productName: product.name,
    vendorId: vendor.id,
    vendorName: vendor.name,
    quantity,
    unitPrice: product.price,
    unit: product.unit,
    lineTotal: product.price * quantity,
    status,
  };
};

// Customer names pool (used for reference when adding orders manually)
const _customerNames = [
  'Catherine Miller', 'James Wilson', 'Sarah Chen', 'Michael Brown', 'Emily Davis',
  'David Garcia', 'Jessica Martinez', 'Robert Taylor', 'Amanda Anderson', 'Christopher Lee',
  'Jennifer Thomas', 'Matthew Jackson', 'Ashley White', 'Daniel Harris', 'Nicole Clark',
  'Andrew Lewis', 'Stephanie Robinson', 'Joshua Walker', 'Michelle Hall', 'Ryan Young',
  'Elizabeth Allen', 'Brandon King', 'Megan Wright', 'Kevin Scott', 'Rachel Green',
  'Justin Hill', 'Lauren Adams', 'Tyler Baker', 'Samantha Nelson', 'Nathan Carter',
];
void _customerNames; // Suppress unused warning

// Generate initial mock orders
const generateMockOrders = (): Order[] => {
  const orders: Order[] = [];
  let orderIndex = 47; // Start at 047 for realistic feel

  // Helper to add an order
  const addOrder = (
    customerName: string,
    email: string,
    slotId: string,
    status: 'pending' | 'packed' | 'picked_up' | 'cancelled',
    itemSpecs: Array<{ productId: string; quantity: number; status?: ItemStatus }>,
    options?: {
      phone?: string;
      specialInstructions?: string;
      notes?: string;
      packedAt?: Date;
      pickedUpAt?: Date;
    }
  ) => {
    const items = itemSpecs
      .map(spec => createOrderItem(spec.productId, spec.quantity, spec.status || 'pending'))
      .filter((item): item is OrderItem => item !== null);

    if (items.length === 0) return;

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const serviceFee = Math.max(subtotal * 0.05, 2);
    const orderId = `order-${orderIndex}`;

    orders.push({
      id: orderId,
      orderNumber: generateOrderNumber(orderIndex),
      customerName,
      customerEmail: email,
      customerPhone: options?.phone,
      pickupSlotId: slotId,
      status,
      items,
      subtotal,
      serviceFee,
      total: subtotal + serviceFee,
      qrCode: generateQRCode(orderId),
      specialInstructions: options?.specialInstructions,
      notes: options?.notes,
      createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000), // Random within last 3 days
      packedAt: options?.packedAt,
      pickedUpAt: options?.pickedUpAt,
    });

    orderIndex++;
  };

  // ============================================
  // SLOT 1: 9:00am - 10:00am (12 orders)
  // 3 picked up, 5 packed, 4 pending
  // ============================================

  // Picked up orders
  addOrder('James Wilson', 'james.wilson@email.com', 'slot-1', 'picked_up',
    [{ productId: 'p1', quantity: 2, status: 'packed' }, { productId: 'p23', quantity: 1, status: 'packed' }],
    { phone: '(610) 555-0101', packedAt: new Date(), pickedUpAt: new Date() }
  );

  addOrder('Sarah Chen', 'sarah.chen@email.com', 'slot-1', 'picked_up',
    [{ productId: 'p7', quantity: 2, status: 'packed' }, { productId: 'p16', quantity: 1, status: 'packed' }, { productId: 'p24', quantity: 2, status: 'packed' }],
    { packedAt: new Date(), pickedUpAt: new Date() }
  );

  addOrder('Michael Brown', 'michael.b@email.com', 'slot-1', 'picked_up',
    [{ productId: 'p19', quantity: 1, status: 'packed' }, { productId: 'p22', quantity: 1, status: 'packed' }],
    { phone: '(610) 555-0103', packedAt: new Date(), pickedUpAt: new Date() }
  );

  // Packed orders (ready for pickup)
  addOrder('Emily Davis', 'emily.davis@email.com', 'slot-1', 'packed',
    [{ productId: 'p8', quantity: 2, status: 'packed' }, { productId: 'p36', quantity: 1, status: 'packed' }, { productId: 'p23', quantity: 1, status: 'packed' }],
    { phone: '(610) 555-0104', packedAt: new Date() }
  );

  addOrder('David Garcia', 'd.garcia@email.com', 'slot-1', 'packed',
    [{ productId: 'p12', quantity: 1, status: 'packed' }, { productId: 'p13', quantity: 1, status: 'packed' }],
    { packedAt: new Date(), specialInstructions: 'Please use paper bags only' }
  );

  addOrder('Jessica Martinez', 'jess.m@email.com', 'slot-1', 'packed',
    [{ productId: 'p29', quantity: 2, status: 'packed' }, { productId: 'p30', quantity: 1, status: 'packed' }, { productId: 'p31', quantity: 1, status: 'packed' }],
    { phone: '(610) 555-0106', packedAt: new Date() }
  );

  addOrder('Robert Taylor', 'rob.taylor@email.com', 'slot-1', 'packed',
    [{ productId: 'p46', quantity: 1, status: 'packed' }, { productId: 'p37', quantity: 1, status: 'packed' }],
    { packedAt: new Date() }
  );

  addOrder('Amanda Anderson', 'amanda.a@email.com', 'slot-1', 'packed',
    [{ productId: 'p4', quantity: 1, status: 'packed' }, { productId: 'p5', quantity: 2, status: 'packed' }, { productId: 'p38', quantity: 1, status: 'packed' }],
    { packedAt: new Date(), specialInstructions: 'I will bring my own bags' }
  );

  // Pending orders
  addOrder('Christopher Lee', 'chris.lee@email.com', 'slot-1', 'pending',
    [{ productId: 'p9', quantity: 1 }, { productId: 'p11', quantity: 1 }, { productId: 'p7', quantity: 1 }],
    { phone: '(610) 555-0109' }
  );

  addOrder('Jennifer Thomas', 'j.thomas@email.com', 'slot-1', 'pending',
    [{ productId: 'p32', quantity: 1 }, { productId: 'p45', quantity: 2 }],
    {}
  );

  addOrder('Matthew Jackson', 'matt.j@email.com', 'slot-1', 'pending',
    [{ productId: 'p1', quantity: 3 }, { productId: 'p3', quantity: 1 }, { productId: 'p6', quantity: 2 }],
    { specialInstructions: 'Please select the ripest tomatoes' }
  );

  addOrder('Ashley White', 'ashley.w@email.com', 'slot-1', 'pending',
    [{ productId: 'p17', quantity: 1 }, { productId: 'p34', quantity: 1 }],
    { phone: '(610) 555-0112' }
  );

  // ============================================
  // SLOT 2: 10:00am - 11:00am (15 orders)
  // 0 picked up, 6 packed, 9 pending (including 2 with issues)
  // ============================================

  // Packed orders
  addOrder('Daniel Harris', 'dan.harris@email.com', 'slot-2', 'packed',
    [{ productId: 'p20', quantity: 2, status: 'packed' }, { productId: 'p19', quantity: 1, status: 'packed' }, { productId: 'p22', quantity: 1, status: 'packed' }],
    { phone: '(610) 555-0113', packedAt: new Date() }
  );

  addOrder('Nicole Clark', 'nicole.c@email.com', 'slot-2', 'packed',
    [{ productId: 'p14', quantity: 1, status: 'packed' }, { productId: 'p43', quantity: 1, status: 'packed' }, { productId: 'p44', quantity: 1, status: 'packed' }],
    { packedAt: new Date() }
  );

  addOrder('Andrew Lewis', 'a.lewis@email.com', 'slot-2', 'packed',
    [{ productId: 'p8', quantity: 1, status: 'packed' }, { productId: 'p10', quantity: 1, status: 'packed' }],
    { phone: '(610) 555-0115', packedAt: new Date(), specialInstructions: 'Chicken for roasting please' }
  );

  addOrder('Stephanie Robinson', 'steph.r@email.com', 'slot-2', 'packed',
    [{ productId: 'p23', quantity: 2, status: 'packed' }, { productId: 'p24', quantity: 3, status: 'packed' }, { productId: 'p26', quantity: 1, status: 'packed' }],
    { packedAt: new Date() }
  );

  addOrder('Joshua Walker', 'josh.w@email.com', 'slot-2', 'packed',
    [{ productId: 'p47', quantity: 1, status: 'packed' }, { productId: 'p48', quantity: 1, status: 'packed' }],
    { phone: '(610) 555-0117', packedAt: new Date() }
  );

  addOrder('Michelle Hall', 'michelle.h@email.com', 'slot-2', 'packed',
    [{ productId: 'p41', quantity: 2, status: 'packed' }, { productId: 'p42', quantity: 1, status: 'packed' }, { productId: 'p39', quantity: 1, status: 'packed' }],
    { packedAt: new Date() }
  );

  // Pending orders (normal)
  addOrder('Ryan Young', 'ryan.y@email.com', 'slot-2', 'pending',
    [{ productId: 'p1', quantity: 2 }, { productId: 'p2', quantity: 1 }, { productId: 'p4', quantity: 1 }],
    { phone: '(610) 555-0119' }
  );

  addOrder('Elizabeth Allen', 'liz.allen@email.com', 'slot-2', 'pending',
    [{ productId: 'p16', quantity: 2 }, { productId: 'p18', quantity: 1 }],
    {}
  );

  addOrder('Brandon King', 'b.king@email.com', 'slot-2', 'pending',
    [{ productId: 'p7', quantity: 3 }, { productId: 'p11', quantity: 2 }, { productId: 'p9', quantity: 1 }],
    { specialInstructions: 'Large eggs preferred' }
  );

  addOrder('Megan Wright', 'megan.w@email.com', 'slot-2', 'pending',
    [{ productId: 'p33', quantity: 1 }, { productId: 'p32', quantity: 1 }],
    { phone: '(610) 555-0122' }
  );

  addOrder('Kevin Scott', 'kevin.s@email.com', 'slot-2', 'pending',
    [{ productId: 'p49', quantity: 2 }, { productId: 'p50', quantity: 1 }],
    {}
  );

  addOrder('Rachel Green', 'r.green@email.com', 'slot-2', 'pending',
    [{ productId: 'p12', quantity: 1 }, { productId: 'p15', quantity: 1 }, { productId: 'p14', quantity: 1 }],
    { phone: '(610) 555-0124' }
  );

  addOrder('Justin Hill', 'justin.h@email.com', 'slot-2', 'pending',
    [{ productId: 'p27', quantity: 1 }, { productId: 'p28', quantity: 1 }],
    {}
  );

  // Orders WITH ISSUES (pending with unavailable items)
  addOrder('Catherine Miller', 'catherine.m@email.com', 'slot-2', 'pending',
    [
      { productId: 'p1', quantity: 2, status: 'packed' },
      { productId: 'p5', quantity: 1, status: 'unavailable' }, // Cherry tomatoes unavailable
      { productId: 'p37', quantity: 1 },
      { productId: 'p23', quantity: 1 }
    ],
    { phone: '(610) 555-0126', notes: 'Cherry tomatoes sold out - needs customer notification' }
  );

  addOrder('Lauren Adams', 'lauren.a@email.com', 'slot-2', 'pending',
    [
      { productId: 'p46', quantity: 1, status: 'unavailable' }, // Salmon unavailable
      { productId: 'p36', quantity: 1 },
      { productId: 'p38', quantity: 1 }
    ],
    { phone: '(610) 555-0127', notes: 'Wild salmon not available this week - offered substitution' }
  );

  // ============================================
  // SLOT 3: 11:00am - 12:00pm (10 orders)
  // 0 picked up, 4 packed, 6 pending
  // ============================================

  // Packed orders
  addOrder('Tyler Baker', 'tyler.b@email.com', 'slot-3', 'packed',
    [{ productId: 'p3', quantity: 2, status: 'packed' }, { productId: 'p1', quantity: 1, status: 'packed' }],
    { phone: '(610) 555-0128', packedAt: new Date() }
  );

  addOrder('Samantha Nelson', 'sam.nelson@email.com', 'slot-3', 'packed',
    [{ productId: 'p20', quantity: 1, status: 'packed' }, { productId: 'p21', quantity: 1, status: 'packed' }, { productId: 'p22', quantity: 2, status: 'packed' }],
    { packedAt: new Date() }
  );

  addOrder('Nathan Carter', 'n.carter@email.com', 'slot-3', 'packed',
    [{ productId: 'p7', quantity: 2, status: 'packed' }, { productId: 'p8', quantity: 1, status: 'packed' }],
    { packedAt: new Date(), specialInstructions: 'Brown eggs if available' }
  );

  addOrder('Maria Lopez', 'maria.l@email.com', 'slot-3', 'packed',
    [{ productId: 'p29', quantity: 3, status: 'packed' }, { productId: 'p31', quantity: 2, status: 'packed' }],
    { phone: '(610) 555-0131', packedAt: new Date() }
  );

  // Pending orders
  addOrder('Thomas Moore', 'tom.moore@email.com', 'slot-3', 'pending',
    [{ productId: 'p24', quantity: 4 }, { productId: 'p25', quantity: 1 }, { productId: 'p26', quantity: 2 }],
    {}
  );

  addOrder('Patricia Evans', 'p.evans@email.com', 'slot-3', 'pending',
    [{ productId: 'p34', quantity: 1 }, { productId: 'p35', quantity: 1 }],
    { phone: '(610) 555-0133' }
  );

  addOrder('William Turner', 'will.t@email.com', 'slot-3', 'pending',
    [{ productId: 'p10', quantity: 1 }, { productId: 'p7', quantity: 2 }, { productId: 'p11', quantity: 1 }],
    { specialInstructions: 'Whole chicken around 4lbs please' }
  );

  addOrder('Linda Phillips', 'linda.p@email.com', 'slot-3', 'pending',
    [{ productId: 'p17', quantity: 1 }, { productId: 'p16', quantity: 1 }],
    { phone: '(610) 555-0135' }
  );

  addOrder('George Campbell', 'george.c@email.com', 'slot-3', 'pending',
    [{ productId: 'p40', quantity: 2 }, { productId: 'p39', quantity: 2 }, { productId: 'p43', quantity: 1 }],
    {}
  );

  addOrder('Barbara Parker', 'b.parker@email.com', 'slot-3', 'pending',
    [{ productId: 'p12', quantity: 2 }, { productId: 'p13', quantity: 1 }, { productId: 'p14', quantity: 1 }, { productId: 'p15', quantity: 1 }],
    { phone: '(610) 555-0137', specialInstructions: 'Birthday gift - can you add a nice note?' }
  );

  // ============================================
  // SLOT 4: 12:00pm - 1:00pm (8 orders)
  // 0 picked up, 0 packed, 8 pending (1 with issue)
  // ============================================

  addOrder('Edward Collins', 'ed.collins@email.com', 'slot-4', 'pending',
    [{ productId: 'p1', quantity: 2 }, { productId: 'p4', quantity: 1 }, { productId: 'p6', quantity: 1 }],
    { phone: '(610) 555-0138' }
  );

  addOrder('Susan Stewart', 'susan.s@email.com', 'slot-4', 'pending',
    [{ productId: 'p23', quantity: 1 }, { productId: 'p24', quantity: 2 }, { productId: 'p45', quantity: 1 }],
    {}
  );

  addOrder('Charles Morris', 'c.morris@email.com', 'slot-4', 'pending',
    [{ productId: 'p8', quantity: 2 }, { productId: 'p9', quantity: 1 }],
    { specialInstructions: 'Premium cuts if available' }
  );

  addOrder('Margaret Rogers', 'meg.rogers@email.com', 'slot-4', 'pending',
    [{ productId: 'p19', quantity: 2 }, { productId: 'p20', quantity: 1 }, { productId: 'p21', quantity: 1 }, { productId: 'p22', quantity: 1 }],
    { phone: '(610) 555-0141' }
  );

  addOrder('Joseph Reed', 'joe.reed@email.com', 'slot-4', 'pending',
    [{ productId: 'p7', quantity: 2 }, { productId: 'p36', quantity: 1 }, { productId: 'p37', quantity: 1 }],
    {}
  );

  addOrder('Dorothy Cook', 'dorothy.c@email.com', 'slot-4', 'pending',
    [{ productId: 'p32', quantity: 2 }, { productId: 'p33', quantity: 1 }],
    { phone: '(610) 555-0143' }
  );

  addOrder('Richard Murphy', 'rich.m@email.com', 'slot-4', 'pending',
    [{ productId: 'p16', quantity: 2 }, { productId: 'p17', quantity: 1 }, { productId: 'p18', quantity: 1 }],
    { specialInstructions: 'Extra ground coffee if you have it' }
  );

  // Order with issue
  addOrder('Helen Bailey', 'helen.b@email.com', 'slot-4', 'pending',
    [
      { productId: 'p47', quantity: 1, status: 'unavailable' }, // King salmon unavailable
      { productId: 'p48', quantity: 2 }
    ],
    { phone: '(610) 555-0145', notes: 'King salmon sold out - customer wants refund for that item' }
  );

  return orders;
};

// Export the generated orders
export const initialMockOrders: Order[] = generateMockOrders();

// Helper functions
export const getPickupSlotById = (id: string): PickupSlot | undefined =>
  pickupSlots.find(slot => slot.id === id);

export const getOrdersBySlot = (orders: Order[], slotId: string): Order[] =>
  orders.filter(order => order.pickupSlotId === slotId);

export const getOrdersWithIssues = (orders: Order[]): Order[] =>
  orders.filter(order => order.items.some(item => item.status === 'unavailable'));
