import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, Package } from 'lucide-react';
import { getProductBySlug, getProductsByVendor } from '../data/products';
import { getVendorById } from '../data/vendors';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductPage() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  const product = slug ? getProductBySlug(slug) : null;
  const vendor = product ? getVendorById(product.vendorId) : null;
  const vendorProducts = vendor
    ? getProductsByVendor(vendor.id).filter(p => p.id !== product?.id).slice(0, 4)
    : [];

  if (!product || !vendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-dash-text mb-4">Product not found</h1>
        <Link to="/browse" className="text-sage-600 hover:text-sage-700">
          Back to browse
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-dash-muted mb-6">
          <Link to="/" className="hover:text-sage-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/browse" className="hover:text-sage-600">Browse</Link>
          <span className="mx-2">/</span>
          <Link to={`/browse/${product.categorySlug}`} className="hover:text-sage-600 capitalize">
            {product.categorySlug}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-dash-text">{product.name}</span>
        </nav>

        {/* Back link - mobile */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 mb-4 sm:hidden"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="aspect-square bg-sage-50 rounded-2xl overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sage-300">
                <Package className="w-24 h-24" />
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <Link
              to={`/vendor/${vendor.slug}`}
              className="text-sage-600 hover:text-sage-700 text-sm font-medium"
            >
              {vendor.name}
            </Link>
            <h1 className="text-3xl font-bold font-display text-dash-text mt-2 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-dash-text">${product.price.toFixed(2)}</span>
                <span className="text-dash-muted">/ {product.unit}</span>
              </div>
              {vendor.rating && (
                <div className="flex items-center gap-1 text-gold-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-medium">{vendor.rating}</span>
                  <span className="text-dash-muted text-sm">({vendor.reviewCount})</span>
                </div>
              )}
            </div>

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-sage-50 text-sage-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-dash-muted leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Add to Cart */}
            {product.inStock ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-dash-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-dash-hover transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-dash-hover transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 sm:flex-initial px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    addedToCart
                      ? 'bg-mint-500 text-white'
                      : 'bg-sage-500 text-white hover:bg-sage-600'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addedToCart ? 'Added!' : 'Add to Cart'}
                </button>
              </div>
            ) : (
              <div className="px-6 py-4 bg-dash-hover rounded-lg text-center">
                <p className="text-dash-muted font-medium">Currently out of stock</p>
              </div>
            )}

            {/* Vendor Info */}
            <div className="mt-8 pt-8 border-t border-dash-border">
              <h3 className="font-semibold text-dash-text mb-4">About the vendor</h3>
              <Link
                to={`/vendor/${vendor.slug}`}
                className="flex items-start gap-4 p-4 bg-sage-50 rounded-xl hover:bg-sage-100 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg shrink-0 overflow-hidden bg-white">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-dash-text">{vendor.name}</p>
                  <p className="text-sm text-dash-muted">{vendor.tagline}</p>
                  <p className="text-sm text-sage-600 mt-1">{vendor.location}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* More from this vendor */}
        {vendorProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-display text-dash-text">
                More from {vendor.name}
              </h2>
              <Link
                to={`/vendor/${vendor.slug}`}
                className="text-sage-600 font-medium hover:text-sage-700"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {vendorProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
