import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, Package, Store } from 'lucide-react';
import { useState, useMemo } from 'react';
import { searchProducts } from '../data/products';
import { vendors } from '../data/vendors';
import ProductCard from '../components/ProductCard';
import VendorCard from '../components/VendorCard';

type SearchTab = 'all' | 'products' | 'vendors';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [localQuery, setLocalQuery] = useState(query);
  const [activeTab, setActiveTab] = useState<SearchTab>('all');

  // Search products
  const matchedProducts = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(query);
  }, [query]);

  // Search vendors
  const matchedVendors = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(lowerQuery) ||
        v.tagline.toLowerCase().includes(lowerQuery) ||
        v.description.toLowerCase().includes(lowerQuery) ||
        v.category.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    }
  };

  const clearSearch = () => {
    setLocalQuery('');
    setSearchParams({});
  };

  const totalResults = matchedProducts.length + matchedVendors.length;

  // Filter results based on active tab
  const displayProducts = activeTab === 'vendors' ? [] : matchedProducts;
  const displayVendors = activeTab === 'products' ? [] : matchedVendors;

  return (
    <div className="min-h-screen bg-dash-hover">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dash-muted" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search products, vendors..."
                className="w-full pl-12 pr-12 py-4 text-lg border border-dash-border rounded-xl bg-white focus:border-sage-500 focus:ring-1 focus:ring-sage-500"
                autoFocus
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-dash-hover rounded-full"
                >
                  <X className="w-5 h-5 text-dash-muted" />
                </button>
              )}
            </div>
          </form>
        </div>

        {query ? (
          <>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold font-display text-dash-text">
                  {totalResults > 0
                    ? `${totalResults} result${totalResults !== 1 ? 's' : ''} for "${query}"`
                    : `No results for "${query}"`}
                </h1>
                {totalResults > 0 && (
                  <p className="text-dash-muted mt-1">
                    {matchedProducts.length} product{matchedProducts.length !== 1 ? 's' : ''},{' '}
                    {matchedVendors.length} vendor{matchedVendors.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Tabs */}
              {totalResults > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'all'
                        ? 'bg-sage-500 text-white'
                        : 'bg-white text-dash-text hover:bg-dash-hover border border-dash-border'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab('products')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeTab === 'products'
                        ? 'bg-sage-500 text-white'
                        : 'bg-white text-dash-text hover:bg-dash-hover border border-dash-border'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    Products ({matchedProducts.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('vendors')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeTab === 'vendors'
                        ? 'bg-sage-500 text-white'
                        : 'bg-white text-dash-text hover:bg-dash-hover border border-dash-border'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    Vendors ({matchedVendors.length})
                  </button>
                </div>
              )}
            </div>

            {totalResults > 0 ? (
              <div className="space-y-8">
                {/* Vendors Section */}
                {displayVendors.length > 0 && (
                  <section>
                    {activeTab === 'all' && (
                      <h2 className="text-lg font-semibold text-dash-text mb-4 flex items-center gap-2">
                        <Store className="w-5 h-5 text-sage-600" />
                        Vendors
                      </h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayVendors.map((vendor) => (
                        <VendorCard key={vendor.id} vendor={vendor} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Products Section */}
                {displayProducts.length > 0 && (
                  <section>
                    {activeTab === 'all' && (
                      <h2 className="text-lg font-semibold text-dash-text mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-sage-600" />
                        Products
                      </h2>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {displayProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-dash-hover rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-dash-muted" />
                </div>
                <h2 className="text-xl font-semibold text-dash-text mb-2">No results found</h2>
                <p className="text-dash-muted mb-6 max-w-md mx-auto">
                  We couldn't find any products or vendors matching "{query}". Try adjusting your
                  search terms or browse our categories.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/browse"
                    className="px-6 py-3 bg-sage-500 text-white font-semibold rounded-lg hover:bg-sage-600 transition-colors"
                  >
                    Browse All Products
                  </Link>
                  <button
                    onClick={() => {
                      setLocalQuery('');
                      document.querySelector('input')?.focus();
                    }}
                    className="px-6 py-3 border border-dash-border text-dash-text font-semibold rounded-lg hover:bg-white transition-colors"
                  >
                    Try Another Search
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State - No Query */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-sage-500" />
            </div>
            <h2 className="text-xl font-semibold text-dash-text mb-2">Search the market</h2>
            <p className="text-dash-muted mb-8 max-w-md mx-auto">
              Find products, vendors, and more from Berwyn Farmers Market
            </p>

            {/* Popular Searches */}
            <div>
              <p className="text-sm text-dash-muted mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['tomatoes', 'cheese', 'bread', 'honey', 'eggs', 'mushrooms', 'pasta'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setLocalQuery(term);
                        setSearchParams({ q: term });
                      }}
                      className="px-4 py-2 bg-white border border-dash-border rounded-full text-sm text-dash-text hover:border-sage-500 hover:text-sage-600 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
