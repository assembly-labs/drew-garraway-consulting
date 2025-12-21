/**
 * Mock Payment Data
 * Subscription plans, test cards, and transaction history
 */

export type PlanTier = 'free' | 'practitioner' | 'coach' | 'gym';
export type BillingCycle = 'monthly' | 'yearly';
export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded' | 'cancelled';
export type PaymentMethod = 'card' | 'bank' | 'paypal';
export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover';

export interface SubscriptionPlan {
  id: string;
  tier: PlanTier;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlySavings: number;
  features: PlanFeature[];
  limits: PlanLimits;
  isPopular?: boolean;
  trialDays?: number;
}

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

export interface PlanLimits {
  journalEntries: number | 'unlimited';
  techniqueLibrary: 'basic' | 'full' | 'custom';
  videoAccess: 'none' | 'limited' | 'full';
  coachFeedback: boolean;
  analytics: 'basic' | 'advanced' | 'full';
  exportData: boolean;
  customGoals: number | 'unlimited';
  students?: number | 'unlimited';
  coaches?: number;
  apiAccess?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  planTier: PlanTier;
  billingCycle: BillingCycle;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'paused';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodInfo {
  id: string;
  userId: string;
  type: PaymentMethod;
  isDefault: boolean;
  card?: {
    brand: CardBrand;
    last4: string;
    expMonth: number;
    expYear: number;
    country: string;
  };
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  paymentMethodId?: string;
  invoiceId?: string;
  receiptUrl?: string;
  createdAt: string;
  refundedAt?: string;
  failureReason?: string;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  paidAt?: string;
  pdfUrl?: string;
  lineItems: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ===========================================
// SUBSCRIPTION PLANS
// ===========================================

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan-free',
    tier: 'free',
    name: 'Free',
    description: 'Get started with basic training logging',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlySavings: 0,
    features: [
      { name: 'Training Journal', included: true, limit: '10 entries/month' },
      { name: 'Basic Technique Library', included: true },
      { name: 'Progress Overview', included: true },
      { name: 'Belt Tracking', included: true },
      { name: 'Coach Feedback', included: false },
      { name: 'Instructional Videos', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'Data Export', included: false },
      { name: 'AI Note Parsing', included: false },
    ],
    limits: {
      journalEntries: 10,
      techniqueLibrary: 'basic',
      videoAccess: 'none',
      coachFeedback: false,
      analytics: 'basic',
      exportData: false,
      customGoals: 1,
    },
  },
  {
    id: 'plan-practitioner',
    tier: 'practitioner',
    name: 'Practitioner',
    description: 'Everything you need to track your BJJ journey',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    yearlySavings: 20,
    trialDays: 14,
    isPopular: true,
    features: [
      { name: 'Unlimited Training Journal', included: true },
      { name: 'Full Technique Library', included: true },
      { name: 'All Instructional Videos', included: true },
      { name: 'Coach Feedback', included: true },
      { name: 'AI Note Parsing', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Goal Tracking', included: true, limit: 'Unlimited' },
      { name: 'Data Export', included: true },
      { name: 'Competition Tracking', included: true },
      { name: 'Position Mastery Heat Map', included: true },
    ],
    limits: {
      journalEntries: 'unlimited',
      techniqueLibrary: 'full',
      videoAccess: 'full',
      coachFeedback: true,
      analytics: 'advanced',
      exportData: true,
      customGoals: 'unlimited',
    },
  },
  {
    id: 'plan-coach',
    tier: 'coach',
    name: 'Coach',
    description: 'Tools to develop your students effectively',
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
    yearlySavings: 60,
    trialDays: 14,
    features: [
      { name: 'Everything in Practitioner', included: true },
      { name: 'Student Management', included: true, limit: 'Up to 50 students' },
      { name: 'Batch Feedback Tools', included: true },
      { name: 'Voice-to-Feedback AI', included: true },
      { name: 'Periodic Review Templates', included: true },
      { name: 'Curriculum Customization', included: true },
      { name: 'Student Progress Dashboard', included: true },
      { name: 'Focus Area Assignment', included: true },
      { name: 'Promotion Tracking', included: true },
    ],
    limits: {
      journalEntries: 'unlimited',
      techniqueLibrary: 'custom',
      videoAccess: 'full',
      coachFeedback: true,
      analytics: 'full',
      exportData: true,
      customGoals: 'unlimited',
      students: 50,
    },
  },
  {
    id: 'plan-gym',
    tier: 'gym',
    name: 'Gym',
    description: 'Complete solution for gym management',
    monthlyPrice: 99.99,
    yearlyPrice: 999.99,
    yearlySavings: 200,
    trialDays: 30,
    features: [
      { name: 'Everything in Coach', included: true },
      { name: 'Unlimited Students', included: true },
      { name: 'Multiple Coaches', included: true, limit: 'Up to 10' },
      { name: 'Gym Analytics Dashboard', included: true },
      { name: 'Retention Metrics', included: true },
      { name: 'Roster Management', included: true },
      { name: 'Promotion Pipeline', included: true },
      { name: 'Attendance Tracking', included: true },
      { name: 'White-label Options', included: true },
      { name: 'API Access', included: true },
      { name: 'Priority Support', included: true },
    ],
    limits: {
      journalEntries: 'unlimited',
      techniqueLibrary: 'custom',
      videoAccess: 'full',
      coachFeedback: true,
      analytics: 'full',
      exportData: true,
      customGoals: 'unlimited',
      students: 'unlimited',
      coaches: 10,
      apiAccess: true,
    },
  },
];

// ===========================================
// TEST CARDS (Stripe-style test cards)
// ===========================================

export interface TestCard {
  number: string;
  brand: CardBrand;
  description: string;
  behavior: 'success' | 'decline' | '3ds_required' | 'insufficient_funds' | 'expired';
  last4: string;
  cvc: string;
  expMonth: number;
  expYear: number;
}

export const testCards: TestCard[] = [
  {
    number: '4242424242424242',
    brand: 'visa',
    description: 'Successful payment',
    behavior: 'success',
    last4: '4242',
    cvc: '123',
    expMonth: 12,
    expYear: 2028,
  },
  {
    number: '4000056655665556',
    brand: 'visa',
    description: 'Successful payment (debit)',
    behavior: 'success',
    last4: '5556',
    cvc: '123',
    expMonth: 12,
    expYear: 2028,
  },
  {
    number: '5555555555554444',
    brand: 'mastercard',
    description: 'Successful payment',
    behavior: 'success',
    last4: '4444',
    cvc: '123',
    expMonth: 12,
    expYear: 2028,
  },
  {
    number: '378282246310005',
    brand: 'amex',
    description: 'Successful payment',
    behavior: 'success',
    last4: '0005',
    cvc: '1234',
    expMonth: 12,
    expYear: 2028,
  },
  {
    number: '4000000000000002',
    brand: 'visa',
    description: 'Card declined',
    behavior: 'decline',
    last4: '0002',
    cvc: '123',
    expMonth: 12,
    expYear: 2028,
  },
  {
    number: '4000000000009995',
    brand: 'visa',
    description: 'Insufficient funds',
    behavior: 'insufficient_funds',
    last4: '9995',
    cvc: '123',
    expMonth: 12,
    expYear: 2028,
  },
  {
    number: '4000002500003155',
    brand: 'visa',
    description: '3D Secure authentication required',
    behavior: '3ds_required',
    last4: '3155',
    cvc: '123',
    expMonth: 12,
    expYear: 2028,
  },
  {
    number: '4000000000000069',
    brand: 'visa',
    description: 'Expired card',
    behavior: 'expired',
    last4: '0069',
    cvc: '123',
    expMonth: 1,
    expYear: 2020,
  },
];

// ===========================================
// MOCK USER SUBSCRIPTIONS
// ===========================================

export const mockUserSubscriptions: UserSubscription[] = [
  {
    id: 'sub-001',
    userId: 'user-001',
    planId: 'plan-practitioner',
    planTier: 'practitioner',
    billingCycle: 'yearly',
    status: 'active',
    currentPeriodStart: '2024-09-15',
    currentPeriodEnd: '2025-09-15',
    cancelAtPeriodEnd: false,
    createdAt: '2023-09-15',
    updatedAt: '2024-09-15',
  },
  {
    id: 'sub-002',
    userId: 'coach-001',
    planId: 'plan-coach',
    planTier: 'coach',
    billingCycle: 'monthly',
    status: 'active',
    currentPeriodStart: '2024-12-01',
    currentPeriodEnd: '2025-01-01',
    cancelAtPeriodEnd: false,
    createdAt: '2022-06-15',
    updatedAt: '2024-12-01',
  },
  {
    id: 'sub-003',
    userId: 'owner-001',
    planId: 'plan-gym',
    planTier: 'gym',
    billingCycle: 'yearly',
    status: 'active',
    currentPeriodStart: '2024-01-01',
    currentPeriodEnd: '2025-01-01',
    cancelAtPeriodEnd: false,
    createdAt: '2020-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'sub-004',
    userId: 'user-002',
    planId: 'plan-practitioner',
    planTier: 'practitioner',
    billingCycle: 'monthly',
    status: 'trialing',
    currentPeriodStart: '2024-12-10',
    currentPeriodEnd: '2024-12-24',
    trialEnd: '2024-12-24',
    cancelAtPeriodEnd: false,
    createdAt: '2024-12-10',
    updatedAt: '2024-12-10',
  },
];

// ===========================================
// MOCK PAYMENT METHODS
// ===========================================

export const mockPaymentMethods: PaymentMethodInfo[] = [
  {
    id: 'pm-001',
    userId: 'user-001',
    type: 'card',
    isDefault: true,
    card: {
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2028,
      country: 'US',
    },
    billingAddress: {
      line1: '123 Training Street',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'US',
    },
    createdAt: '2023-09-15',
  },
  {
    id: 'pm-002',
    userId: 'user-001',
    type: 'card',
    isDefault: false,
    card: {
      brand: 'mastercard',
      last4: '4444',
      expMonth: 6,
      expYear: 2026,
      country: 'US',
    },
    createdAt: '2024-03-20',
  },
  {
    id: 'pm-003',
    userId: 'coach-001',
    type: 'card',
    isDefault: true,
    card: {
      brand: 'visa',
      last4: '1234',
      expMonth: 3,
      expYear: 2027,
      country: 'US',
    },
    createdAt: '2022-06-15',
  },
  {
    id: 'pm-004',
    userId: 'owner-001',
    type: 'card',
    isDefault: true,
    card: {
      brand: 'amex',
      last4: '0005',
      expMonth: 9,
      expYear: 2029,
      country: 'US',
    },
    billingAddress: {
      line1: '1234 Martial Arts Blvd',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'US',
    },
    createdAt: '2020-01-01',
  },
];

// ===========================================
// MOCK TRANSACTIONS
// ===========================================

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    userId: 'user-001',
    subscriptionId: 'sub-001',
    amount: 99.99,
    currency: 'USD',
    status: 'succeeded',
    description: 'Practitioner Plan - Yearly Subscription',
    paymentMethodId: 'pm-001',
    invoiceId: 'inv-001',
    receiptUrl: '/receipts/txn-001.pdf',
    createdAt: '2024-09-15T10:00:00Z',
  },
  {
    id: 'txn-002',
    userId: 'user-001',
    subscriptionId: 'sub-001',
    amount: 99.99,
    currency: 'USD',
    status: 'succeeded',
    description: 'Practitioner Plan - Yearly Subscription Renewal',
    paymentMethodId: 'pm-001',
    invoiceId: 'inv-002',
    receiptUrl: '/receipts/txn-002.pdf',
    createdAt: '2023-09-15T10:00:00Z',
  },
  {
    id: 'txn-003',
    userId: 'coach-001',
    subscriptionId: 'sub-002',
    amount: 29.99,
    currency: 'USD',
    status: 'succeeded',
    description: 'Coach Plan - Monthly Subscription',
    paymentMethodId: 'pm-003',
    invoiceId: 'inv-003',
    receiptUrl: '/receipts/txn-003.pdf',
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    id: 'txn-004',
    userId: 'coach-001',
    subscriptionId: 'sub-002',
    amount: 29.99,
    currency: 'USD',
    status: 'succeeded',
    description: 'Coach Plan - Monthly Subscription',
    paymentMethodId: 'pm-003',
    invoiceId: 'inv-004',
    createdAt: '2024-11-01T10:00:00Z',
  },
  {
    id: 'txn-005',
    userId: 'owner-001',
    subscriptionId: 'sub-003',
    amount: 999.99,
    currency: 'USD',
    status: 'succeeded',
    description: 'Gym Plan - Yearly Subscription',
    paymentMethodId: 'pm-004',
    invoiceId: 'inv-005',
    receiptUrl: '/receipts/txn-005.pdf',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'txn-006',
    userId: 'user-003',
    amount: 9.99,
    currency: 'USD',
    status: 'failed',
    description: 'Practitioner Plan - Monthly Subscription',
    failureReason: 'Your card was declined.',
    createdAt: '2024-12-15T10:00:00Z',
  },
];

// ===========================================
// MOCK INVOICES
// ===========================================

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    userId: 'user-001',
    subscriptionId: 'sub-001',
    number: 'INV-2024-0915-001',
    amount: 99.99,
    currency: 'USD',
    status: 'paid',
    periodStart: '2024-09-15',
    periodEnd: '2025-09-15',
    dueDate: '2024-09-15',
    paidAt: '2024-09-15T10:00:00Z',
    pdfUrl: '/invoices/inv-001.pdf',
    lineItems: [
      {
        description: 'BJJ Progress Tracker - Practitioner Plan (Yearly)',
        quantity: 1,
        unitPrice: 99.99,
        total: 99.99,
      },
    ],
  },
  {
    id: 'inv-003',
    userId: 'coach-001',
    subscriptionId: 'sub-002',
    number: 'INV-2024-1201-003',
    amount: 29.99,
    currency: 'USD',
    status: 'paid',
    periodStart: '2024-12-01',
    periodEnd: '2025-01-01',
    dueDate: '2024-12-01',
    paidAt: '2024-12-01T10:00:00Z',
    pdfUrl: '/invoices/inv-003.pdf',
    lineItems: [
      {
        description: 'BJJ Progress Tracker - Coach Plan (Monthly)',
        quantity: 1,
        unitPrice: 29.99,
        total: 29.99,
      },
    ],
  },
  {
    id: 'inv-005',
    userId: 'owner-001',
    subscriptionId: 'sub-003',
    number: 'INV-2024-0101-005',
    amount: 999.99,
    currency: 'USD',
    status: 'paid',
    periodStart: '2024-01-01',
    periodEnd: '2025-01-01',
    dueDate: '2024-01-01',
    paidAt: '2024-01-01T10:00:00Z',
    pdfUrl: '/invoices/inv-005.pdf',
    lineItems: [
      {
        description: 'BJJ Progress Tracker - Gym Plan (Yearly)',
        quantity: 1,
        unitPrice: 999.99,
        total: 999.99,
      },
    ],
  },
];

// ===========================================
// PAYMENT STATS
// ===========================================

export const mockPaymentStats = {
  monthlyRecurringRevenue: 1159.96, // 99.99 + 29.99 + (999.99/12) + etc
  totalActiveSubscriptions: 4,
  totalFreeUsers: 156,
  conversionRate: 2.5, // % of free users who convert
  churnRate: 3.2, // % monthly
  averageRevenuePerUser: 28.99,
  planDistribution: {
    free: 156,
    practitioner: 89,
    coach: 12,
    gym: 3,
  },
  paymentMethodDistribution: {
    visa: 65,
    mastercard: 25,
    amex: 8,
    discover: 2,
  },
};

// ===========================================
// PROMO CODES
// ===========================================

export interface PromoCode {
  code: string;
  discount: number; // percentage
  type: 'percent' | 'fixed';
  applicablePlans: PlanTier[];
  validFrom: string;
  validUntil: string;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
}

export const mockPromoCodes: PromoCode[] = [
  {
    code: 'NEWYEAR25',
    discount: 25,
    type: 'percent',
    applicablePlans: ['practitioner', 'coach'],
    validFrom: '2025-01-01',
    validUntil: '2025-01-31',
    maxUses: 500,
    currentUses: 0,
    isActive: true,
  },
  {
    code: 'FIRSTMONTH',
    discount: 50,
    type: 'percent',
    applicablePlans: ['practitioner'],
    validFrom: '2024-01-01',
    validUntil: '2025-12-31',
    currentUses: 234,
    isActive: true,
  },
  {
    code: 'COACH10OFF',
    discount: 10,
    type: 'fixed',
    applicablePlans: ['coach'],
    validFrom: '2024-01-01',
    validUntil: '2025-12-31',
    currentUses: 45,
    isActive: true,
  },
  {
    code: 'BLACKFRIDAY',
    discount: 40,
    type: 'percent',
    applicablePlans: ['practitioner', 'coach', 'gym'],
    validFrom: '2024-11-25',
    validUntil: '2024-12-02',
    currentUses: 312,
    isActive: false,
  },
];

// ===========================================
// PAYMENT HELPERS
// ===========================================

export const getPlanById = (planId: string): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.id === planId);
};

export const getPlanByTier = (tier: PlanTier): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.tier === tier);
};

export const getUserSubscription = (userId: string): UserSubscription | undefined => {
  return mockUserSubscriptions.find(sub => sub.userId === userId);
};

export const getUserPaymentMethods = (userId: string): PaymentMethodInfo[] => {
  return mockPaymentMethods.filter(pm => pm.userId === userId);
};

export const getUserTransactions = (userId: string): Transaction[] => {
  return mockTransactions.filter(txn => txn.userId === userId);
};

export const getUserInvoices = (userId: string): Invoice[] => {
  return mockInvoices.filter(inv => inv.userId === userId);
};

export const calculatePrice = (
  plan: SubscriptionPlan,
  billingCycle: BillingCycle,
  promoCode?: string
): { original: number; discount: number; final: number } => {
  const basePrice = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

  if (!promoCode) {
    return { original: basePrice, discount: 0, final: basePrice };
  }

  const promo = mockPromoCodes.find(
    p => p.code === promoCode && p.isActive && p.applicablePlans.includes(plan.tier)
  );

  if (!promo) {
    return { original: basePrice, discount: 0, final: basePrice };
  }

  const discountAmount = promo.type === 'percent'
    ? basePrice * (promo.discount / 100)
    : promo.discount;

  return {
    original: basePrice,
    discount: discountAmount,
    final: Math.max(0, basePrice - discountAmount),
  };
};

export const formatCardBrand = (brand: CardBrand): string => {
  const brandNames: Record<CardBrand, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
  };
  return brandNames[brand];
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
