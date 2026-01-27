import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const {
    getItemsWithDetails,
    updateQuantity,
    removeItem,
    getSubtotal,
    getServiceFee,
    getTotal,
    getItemCount,
  } = useCart();

  const items = getItemsWithDetails();
  const itemCount = getItemCount();

  // Group items by vendor
  const itemsByVendor = items.reduce((acc, item) => {
    const vendorId = item.vendor.id;
    if (!acc[vendorId]) {
      acc[vendorId] = {
        vendor: item.vendor,
        items: [],
      };
    }
    acc[vendorId].items.push(item);
    return acc;
  }, {} as Record<string, { vendor: typeof items[0]['vendor']; items: typeof items }>);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-24 h-24 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-sage-400" />
        </div>
        <h1 className="text-2xl font-bold font-display text-dash-text mb-4">
          Your cart is empty
        </h1>
        <p className="text-dash-muted mb-8">
          Start shopping to add items to your cart.
        </p>
        <Link
          to="/browse"
          className="inline-flex items-center justify-center px-6 py-3 bg-sage-500 text-white font-semibold rounded-full hover:bg-sage-600 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dash-hover">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold font-display text-dash-text mb-2">Your Cart</h1>
        <p className="text-dash-muted mb-8">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} from {Object.keys(itemsByVendor).length}{' '}
          {Object.keys(itemsByVendor).length === 1 ? 'vendor' : 'vendors'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.values(itemsByVendor).map(({ vendor, items: vendorItems }) => (
              <div key={vendor.id} className="bg-white rounded-xl shadow-soft overflow-hidden">
                <div className="px-6 py-4 bg-sage-50 border-b border-dash-border">
                  <Link
                    to={`/vendor/${vendor.slug}`}
                    className="font-semibold text-dash-text hover:text-sage-600"
                  >
                    {vendor.name}
                  </Link>
                </div>
                <div className="divide-y divide-dash-border">
                  {vendorItems.map((item) => (
                    <div key={item.productId} className="p-4 sm:p-6">
                      <div className="flex gap-4">
                        {/* Product Image Placeholder */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 product-placeholder rounded-lg shrink-0">
                          <Package className="w-8 h-8" />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product.slug}`}
                            className="font-semibold text-dash-text hover:text-sage-600 line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-dash-muted mt-1">
                            ${item.product.price.toFixed(2)} / {item.product.unit}
                          </p>

                          {/* Quantity & Remove - Mobile */}
                          <div className="flex items-center justify-between mt-3 sm:hidden">
                            <div className="flex items-center border border-dash-border rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity - 1)
                                }
                                className="p-2 hover:bg-dash-hover transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity + 1)
                                }
                                className="p-2 hover:bg-dash-hover transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="font-semibold text-dash-text">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Quantity & Total - Desktop */}
                        <div className="hidden sm:flex items-center gap-6">
                          <div className="flex items-center border border-dash-border rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              className="p-2 hover:bg-dash-hover transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              className="p-2 hover:bg-dash-hover transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="w-20 text-right font-semibold text-dash-text">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>

                          <button
                            onClick={() => removeItem(item.productId)}
                            className="p-2 text-dash-muted hover:text-coral-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Remove button - Mobile */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="mt-3 text-sm text-dash-muted hover:text-coral-500 sm:hidden"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-dash-text mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
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

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sage-500 text-white font-semibold rounded-lg hover:bg-sage-600 transition-colors"
              >
                Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/browse"
                className="block text-center mt-4 text-sage-600 hover:text-sage-700"
              >
                Continue Shopping
              </Link>

              <p className="text-xs text-dash-muted text-center mt-6">
                Pickup at Berwyn Farmers Market
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
