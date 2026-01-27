import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import type { Vendor } from '../data/vendors';
import { getProductsByVendor } from '../data/products';

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const products = getProductsByVendor(vendor.id);

  return (
    <Link
      to={`/vendor/${vendor.slug}`}
      className="group bg-white rounded-xl border border-dash-border overflow-hidden hover:border-sage-300 hover:shadow-card transition-all"
    >
      {/* Vendor Image */}
      <div className="aspect-[4/3] bg-sage-50 overflow-hidden">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-dash-text group-hover:text-sage-600 transition-colors">
            {vendor.name}
          </h3>
          {vendor.featured && (
            <span className="shrink-0 px-2 py-0.5 bg-gold-100 text-gold-700 text-xs font-medium rounded-full">
              Featured
            </span>
          )}
        </div>
        <p className="text-sm text-dash-muted mb-3 line-clamp-2">{vendor.tagline}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-dash-muted">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{vendor.location}</span>
          </div>
          <div className="flex items-center gap-1 text-gold-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">{vendor.rating}</span>
          </div>
        </div>
        <p className="text-xs text-dash-muted mt-2">
          {products.length} products
        </p>
      </div>
    </Link>
  );
}
