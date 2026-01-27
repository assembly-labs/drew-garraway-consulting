import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { categories, getCategoryBySlug } from '../data/categories';
import { products, getProductsByCategory } from '../data/products';
import { vendors } from '../data/vendors';
import ProductCard from '../components/ProductCard';

type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'name';

export default function BrowsePage() {
  const { category: categorySlug } = useParams();
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showFilters, setShowFilters] = useState(false);

  const currentCategory = categorySlug ? getCategoryBySlug(categorySlug) : null;

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = categorySlug ? getProductsByCategory(categorySlug) : products;

    // Filter by vendors
    if (selectedVendors.length > 0) {
      result = result.filter(p => selectedVendors.includes(p.vendorId));
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter(p => p.tags.some(t => selectedTags.includes(t)));
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
      default:
        result = [...result].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return result;
  }, [categorySlug, selectedVendors, selectedTags, sortBy]);

  const toggleVendor = (vendorId: string) => {
    setSelectedVendors(prev =>
      prev.includes(vendorId) ? prev.filter(v => v !== vendorId) : [...prev, vendorId]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedVendors([]);
    setSelectedTags([]);
  };

  const hasActiveFilters = selectedVendors.length > 0 || selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-sage-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-dash-muted mb-4">
            <Link to="/" className="hover:text-sage-600">Home</Link>
            <span className="mx-2">/</span>
            {currentCategory ? (
              <>
                <Link to="/browse" className="hover:text-sage-600">Browse</Link>
                <span className="mx-2">/</span>
                <span className="text-dash-text">{currentCategory.name}</span>
              </>
            ) : (
              <span className="text-dash-text">All Products</span>
            )}
          </nav>

          <h1 className="text-3xl font-bold font-display text-dash-text">
            {currentCategory ? currentCategory.name : 'All Products'}
          </h1>
          {currentCategory && (
            <p className="text-dash-muted mt-2">{currentCategory.description}</p>
          )}
        </div>
      </div>

      {/* Category Pills (when showing all) */}
      {!currentCategory && (
        <div className="border-b border-dash-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/browse/${cat.slug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-dash-border rounded-full whitespace-nowrap hover:border-sage-300 hover:bg-sage-50 transition-colors"
                >
                  <span>{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-dash-border rounded-lg hover:border-sage-300 transition-colors lg:hidden"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-sage-500 text-white text-xs rounded-full flex items-center justify-center">
                  {selectedVendors.length + selectedTags.length}
                </span>
              )}
            </button>
            <p className="text-sm text-dash-muted">
              {filteredProducts.length} products
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-dash-muted">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-dash-border rounded-lg text-sm focus:border-sage-500 focus:ring-0"
            >
              <option value="popular">Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-sage-600 hover:text-sage-700 mb-4"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              )}

              {/* Vendor Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-dash-text mb-3">Vendor</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {vendors.map((vendor) => (
                    <label key={vendor.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={() => toggleVendor(vendor.id)}
                        className="w-4 h-4 rounded border-dash-border text-sage-500 focus:ring-sage-500"
                      />
                      <span className="text-sm text-dash-text">{vendor.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <h3 className="font-semibold text-dash-text mb-3">Dietary</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-sage-500 text-white'
                          : 'bg-sage-50 text-sage-700 hover:bg-sage-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm text-sage-600 hover:text-sage-700 mb-4"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                )}

                {/* Vendor Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-dash-text mb-3">Vendor</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {vendors.map((vendor) => (
                      <label key={vendor.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedVendors.includes(vendor.id)}
                          onChange={() => toggleVendor(vendor.id)}
                          className="w-4 h-4 rounded border-dash-border text-sage-500 focus:ring-sage-500"
                        />
                        <span className="text-sm text-dash-text">{vendor.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-dash-text mb-3">Dietary</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-sage-500 text-white'
                            : 'bg-sage-50 text-sage-700 hover:bg-sage-100'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 bg-sage-500 text-white font-semibold rounded-lg"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-dash-muted mb-4">No products found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="text-sage-600 font-medium hover:text-sage-700"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
