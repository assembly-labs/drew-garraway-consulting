import { Link } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import type { Product } from '../data/products';
import { getVendorById } from '../data/vendors';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
}

export default function ProductCard({ product, isNew }: ProductCardProps) {
  const vendor = getVendorById(product.vendorId);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id);
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white rounded-xl border border-dash-border overflow-hidden hover:border-sage-300 hover:shadow-card transition-all"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-sage-50 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sage-300">
            <Package className="w-12 h-12" />
          </div>
        )}
        {isNew && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-gold-400 text-white text-xs font-semibold rounded-full">
            New
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="px-3 py-1 bg-dash-text text-white text-sm font-medium rounded-full">
              Out of Stock
            </span>
          </div>
        )}
        {/* Quick Add Button */}
        {product.inStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 w-10 h-10 bg-sage-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sage-600 shadow-lg"
            aria-label="Add to cart"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <p className="text-xs text-dash-muted mb-1 truncate">{vendor?.name}</p>
        <h3 className="font-semibold text-dash-text text-sm sm:text-base mb-1 line-clamp-2 group-hover:text-sage-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-dash-text">${product.price.toFixed(2)}</span>
          <span className="text-xs text-dash-muted">/ {product.unit}</span>
        </div>
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-sage-50 text-sage-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
