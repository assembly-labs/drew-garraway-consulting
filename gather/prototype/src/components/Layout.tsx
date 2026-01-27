import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-dash-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold font-display bg-gradient-to-r from-sage-600 to-sage-500 bg-clip-text text-transparent">
                Gather
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/browse"
                className="text-dash-text hover:text-sage-600 font-medium transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/vendors"
                className="text-dash-text hover:text-sage-600 font-medium transition-colors"
              >
                Vendors
              </Link>
              <Link
                to="/about"
                className="text-dash-text hover:text-sage-600 font-medium transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dash-muted" />
                <input
                  type="text"
                  placeholder="Search products, vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-dash-border rounded-full bg-dash-hover focus:bg-white focus:border-sage-500 transition-colors"
                />
              </div>
            </form>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 hover:bg-dash-hover rounded-full transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-dash-text" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-sage-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-dash-hover rounded-full transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-dash-text" />
                ) : (
                  <Menu className="w-6 h-6 text-dash-text" />
                )}
              </button>
            </div>
          </div>

          {/* Search - Mobile */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dash-muted" />
                <input
                  type="text"
                  placeholder="Search products, vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-dash-border rounded-full bg-dash-hover focus:bg-white focus:border-sage-500 transition-colors"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-dash-border bg-white">
            <nav className="px-4 py-4 space-y-2">
              <Link
                to="/browse"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-dash-text hover:bg-dash-hover rounded-lg font-medium"
              >
                Shop
              </Link>
              <Link
                to="/vendors"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-dash-text hover:bg-dash-hover rounded-lg font-medium"
              >
                Vendors
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-dash-text hover:bg-dash-hover rounded-lg font-medium"
              >
                About
              </Link>
              <div className="border-t border-dash-border my-2 pt-2">
                <p className="px-4 py-1 text-xs text-dash-muted uppercase tracking-wide">Categories</p>
              </div>
              <Link
                to="/browse/produce"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-dash-muted hover:bg-dash-hover rounded-lg"
              >
                Produce
              </Link>
              <Link
                to="/browse/meat"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-dash-muted hover:bg-dash-hover rounded-lg"
              >
                Meat & Poultry
              </Link>
              <Link
                to="/browse/dairy"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-dash-muted hover:bg-dash-hover rounded-lg"
              >
                Dairy & Eggs
              </Link>
              <Link
                to="/browse/baked"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-dash-muted hover:bg-dash-hover rounded-lg"
              >
                Baked Goods
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-sage-900 text-sage-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold font-display text-white mb-2">Gather</h3>
              <p className="text-sage-200 text-sm italic mb-4">Good things from good people</p>
              <p className="text-sage-300 text-sm">
                Shop the Berwyn Farmers Market online. Pick up fresh at the market.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Market Info</h4>
              <p className="text-sage-300 text-sm mb-2">
                Bronze Plaza, 511 Old Lancaster Road
              </p>
              <p className="text-sage-300 text-sm mb-2">
                Sundays, 9am - 12pm
              </p>
              <p className="text-sage-300 text-sm">
                May - December (weekly)<br />
                January - April (2nd & 4th Sundays)
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <p className="text-sage-300 text-sm">
                info@berwynfarmersmarket.com
              </p>
            </div>
          </div>
          <div className="border-t border-sage-700 mt-8 pt-8 text-center">
            <p className="text-sage-400 text-sm">
              &copy; 2025 Gather. Building infrastructure for local food commerce.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
