import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, ArrowLeft } from 'lucide-react';
import { getVendorBySlug } from '../data/vendors';
import { getProductsByVendor } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function VendorPage() {
  const { slug } = useParams();
  const vendor = slug ? getVendorBySlug(slug) : null;
  const products = vendor ? getProductsByVendor(vendor.id) : [];

  if (!vendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-dash-text mb-4">Vendor not found</h1>
        <Link to="/browse" className="text-sage-600 hover:text-sage-700">
          Back to browse
        </Link>
      </div>
    );
  }

  const frequencyLabel = {
    weekly: 'Every week',
    biweekly: 'Every other week',
    monthly: 'Once a month',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-sage-50 via-white to-gold-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back link */}
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to browse
          </Link>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Vendor Image */}
            <div className="w-full md:w-64 h-48 md:h-64 rounded-2xl shrink-0 overflow-hidden bg-sage-50">
              <img
                src={vendor.image}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Vendor Info */}
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <h1 className="text-3xl font-bold font-display text-dash-text">
                  {vendor.name}
                </h1>
                {vendor.featured && (
                  <span className="px-3 py-1 bg-gold-100 text-gold-700 text-sm font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-lg text-dash-muted mb-4">{vendor.tagline}</p>

              <div className="flex flex-wrap gap-4 text-sm mb-6">
                <div className="flex items-center gap-2 text-dash-muted">
                  <MapPin className="w-4 h-4" />
                  {vendor.location}
                </div>
                <div className="flex items-center gap-2 text-gold-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{vendor.rating}</span>
                  <span className="text-dash-muted">({vendor.reviewCount} reviews)</span>
                </div>
                <span className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full">
                  {frequencyLabel[vendor.frequency]}
                </span>
              </div>

              <p className="text-dash-text leading-relaxed">{vendor.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold font-display text-dash-text mb-6">
          Products ({products.length})
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-dash-muted py-8">
            No products available from this vendor right now.
          </p>
        )}
      </div>
    </div>
  );
}
