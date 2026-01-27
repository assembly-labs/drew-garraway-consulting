import { Link } from 'react-router-dom';
import { ChevronRight, Star, Clock, MapPin, Leaf, Beef, Egg, Croissant, UtensilsCrossed, Fish, Coffee, Package } from 'lucide-react';
import { categories } from '../data/categories';
import { getFeaturedVendors, vendors } from '../data/vendors';
import { getPopularProducts, getNewProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import VendorCard from '../components/VendorCard';

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf,
  Beef,
  Egg,
  Croissant,
  UtensilsCrossed,
  Jar: Package, // Fallback
  Fish,
  Coffee,
};

export default function HomePage() {
  const featuredVendors = getFeaturedVendors();
  const popularProducts = getPopularProducts().slice(0, 8);
  const newProducts = getNewProducts();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 via-white to-gold-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold font-display text-dash-text mb-4">
              Shop Local.{' '}
              <span className="bg-gradient-to-r from-sage-600 to-sage-500 bg-clip-text text-transparent">
                Pick Up Fresh.
              </span>
            </h1>
            <p className="text-lg text-dash-muted mb-8">
              Browse products from {vendors.length}+ local vendors. Order online, pick up at the Berwyn Farmers Market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/browse"
                className="inline-flex items-center justify-center px-6 py-3 bg-sage-500 text-white font-semibold rounded-full hover:bg-sage-600 transition-colors shadow-lg shadow-sage-500/25"
              >
                Start Shopping
                <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-sage-700 font-semibold rounded-full border-2 border-sage-500 hover:bg-sage-50 transition-colors"
              >
                Browse Vendors
              </Link>
            </div>
          </div>

          {/* Market Info Cards */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-soft">
              <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-sage-600" />
              </div>
              <div>
                <p className="font-semibold text-dash-text">Saturdays</p>
                <p className="text-sm text-dash-muted">9am - 1pm</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-soft">
              <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <p className="font-semibold text-dash-text">Berwyn, PA</p>
                <p className="text-sm text-dash-muted">Train Station</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-soft">
              <div className="w-10 h-10 bg-mint-500/20 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-mint-500" />
              </div>
              <div>
                <p className="font-semibold text-dash-text">{vendors.length}+ Vendors</p>
                <p className="text-sm text-dash-muted">Local & Fresh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display text-dash-text">Shop by Category</h2>
            <Link to="/browse" className="text-sage-600 font-medium hover:text-sage-700 flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon] || Leaf;
              return (
                <Link
                  key={category.id}
                  to={`/browse/${category.slug}`}
                  className="flex flex-col items-center p-4 bg-white rounded-xl border border-dash-border hover:border-sage-300 hover:shadow-card transition-all group"
                >
                  <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mb-2`}>
                    <IconComponent className="w-6 h-6 text-sage-600" />
                  </div>
                  <span className="text-sm font-medium text-dash-text text-center group-hover:text-sage-600">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-10 sm:py-12 bg-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold font-display text-dash-text">Featured Vendors</h2>
              <p className="text-dash-muted">Meet the farmers and makers behind your food</p>
            </div>
            <Link to="/browse" className="text-sage-600 font-medium hover:text-sage-700 flex items-center gap-1">
              All vendors <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVendors.slice(0, 4).map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold font-display text-dash-text">Popular This Week</h2>
              <p className="text-dash-muted">What your neighbors are buying</p>
            </div>
            <Link to="/browse" className="text-sage-600 font-medium hover:text-sage-700 flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="py-10 sm:py-12 bg-gold-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold font-display text-dash-text">New This Season</h2>
                <p className="text-dash-muted">Fresh additions to the market</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} isNew />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* More Featured Vendors */}
      <section className="py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display text-dash-text">More Vendors to Discover</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVendors.slice(4, 8).map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-sage-500 to-sage-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-display text-white mb-4">
            Ready to shop local?
          </h2>
          <p className="text-sage-100 mb-8">
            Order by Friday evening for Saturday pickup at the market.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-sage-700 font-semibold rounded-full hover:bg-sage-50 transition-colors shadow-lg"
          >
            Start Shopping
            <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
