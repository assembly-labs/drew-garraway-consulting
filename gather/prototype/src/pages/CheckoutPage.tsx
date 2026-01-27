import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Clock, MapPin, ChevronDown, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Available pickup times
const pickupSlots = [
  { id: 'slot1', time: '9:00am - 10:00am', available: 15 },
  { id: 'slot2', time: '10:00am - 11:00am', available: 12 },
  { id: 'slot3', time: '11:00am - 12:00pm', available: 8 },
  { id: 'slot4', time: '12:00pm - 1:00pm', available: 20 },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    getItemsWithDetails,
    getSubtotal,
    getServiceFee,
    getTotal,
    clearCart,
  } = useCart();

  const items = getItemsWithDetails();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    pickupSlot: '',
    specialInstructions: '',
    createAccount: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate order ID
    const orderId = `BFM-${Date.now().toString(36).toUpperCase()}`;

    // Clear cart and navigate to confirmation
    clearCart();
    navigate(`/confirmation/${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-dash-text mb-4">Your cart is empty</h1>
        <Link to="/browse" className="text-sage-600 hover:text-sage-700">
          Continue shopping
        </Link>
      </div>
    );
  }

  // Group items by vendor for display
  const itemsByVendor = items.reduce((acc, item) => {
    const vendorId = item.vendor.id;
    if (!acc[vendorId]) {
      acc[vendorId] = { vendor: item.vendor, items: [] };
    }
    acc[vendorId].items.push(item);
    return acc;
  }, {} as Record<string, { vendor: typeof items[0]['vendor']; items: typeof items }>);

  return (
    <div className="min-h-screen bg-dash-hover">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to cart
        </Link>

        <h1 className="text-3xl font-bold font-display text-dash-text mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h2 className="text-lg font-semibold text-dash-text mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-dash-text mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-dash-border rounded-lg focus:border-sage-500 focus:ring-1 focus:ring-sage-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-dash-text mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-dash-border rounded-lg focus:border-sage-500 focus:ring-1 focus:ring-sage-500"
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-dash-text mb-1">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-dash-border rounded-lg focus:border-sage-500 focus:ring-1 focus:ring-sage-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="createAccount"
                      checked={formData.createAccount}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-dash-border text-sage-500 focus:ring-sage-500"
                    />
                    <span className="text-sm text-dash-text">
                      Create account for faster checkout & exclusive offers
                    </span>
                  </label>
                </div>
              </div>

              {/* Pickup Details */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h2 className="text-lg font-semibold text-dash-text mb-4">
                  Pickup Details
                </h2>

                <div className="flex items-start gap-4 p-4 bg-sage-50 rounded-lg mb-6">
                  <MapPin className="w-5 h-5 text-sage-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-dash-text">Berwyn Farmers Market</p>
                    <p className="text-sm text-dash-muted">
                      Berwyn Train Station, Berwyn, PA
                    </p>
                    <p className="text-sm text-sage-600 mt-1">Saturday, next market day</p>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="pickupSlot" className="block text-sm font-medium text-dash-text mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Select Pickup Time *
                  </label>
                  <div className="relative">
                    <select
                      id="pickupSlot"
                      name="pickupSlot"
                      required
                      value={formData.pickupSlot}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-dash-border rounded-lg focus:border-sage-500 focus:ring-1 focus:ring-sage-500 appearance-none bg-white"
                    >
                      <option value="">Choose a time slot...</option>
                      {pickupSlots.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {slot.time} ({slot.available} slots available)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dash-muted pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label htmlFor="specialInstructions" className="block text-sm font-medium text-dash-text mb-1">
                    Special Instructions (optional)
                  </label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    rows={3}
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-dash-border rounded-lg focus:border-sage-500 focus:ring-1 focus:ring-sage-500"
                    placeholder="Any special requests or notes for your order..."
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h2 className="text-lg font-semibold text-dash-text mb-4">
                  Payment
                </h2>

                <div className="border border-dash-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-5 h-5 text-dash-muted" />
                    <span className="font-medium text-dash-text">Credit or Debit Card</span>
                  </div>

                  {/* Simulated card input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-dash-muted mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-4 py-2 border border-dash-border rounded-lg bg-dash-hover"
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-dash-muted mb-1">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-dash-border rounded-lg bg-dash-hover"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-dash-muted mb-1">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-2 border border-dash-border rounded-lg bg-dash-hover"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-dash-muted mt-4 text-center">
                    Demo mode - no real payment will be processed
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-dash-text mb-4">Order Summary</h2>

                {/* Items preview */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {Object.values(itemsByVendor).map(({ vendor, items: vendorItems }) => (
                    <div key={vendor.id}>
                      <p className="text-xs font-medium text-dash-muted mb-2">{vendor.name}</p>
                      {vendorItems.map((item) => (
                        <div key={item.productId} className="flex gap-3 mb-2">
                          <div className="w-12 h-12 product-placeholder rounded-lg shrink-0">
                            <Package className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-dash-text truncate">{item.product.name}</p>
                            <p className="text-xs text-dash-muted">
                              Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-dash-text">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="border-t border-dash-border pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-dash-text">
                    <span>Subtotal</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-dash-muted text-sm">
                    <span>Service fee</span>
                    <span>${getServiceFee().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-dash-border pt-3 flex justify-between font-semibold text-lg text-dash-text">
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-sage-500 text-white font-semibold rounded-lg hover:bg-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `Place Order • $${getTotal().toFixed(2)}`}
                </button>

                <p className="text-xs text-dash-muted text-center mt-4">
                  By placing this order, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
