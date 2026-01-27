import { vendors } from '../data/vendors';
import VendorCard from '../components/VendorCard';

export default function VendorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-dash-text mb-4">
          Our Vendors
        </h1>
        <p className="text-lg text-dash-muted max-w-2xl mx-auto">
          Meet the local farmers, producers, and artisans who make the Berwyn Farmers Market special
        </p>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>

      {/* Become a Vendor CTA */}
      <div className="mt-12 bg-sage-50 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold font-display text-dash-text mb-2">
          Interested in becoming a vendor?
        </h2>
        <p className="text-dash-muted mb-4">
          Join our curated network of local producers and artisans
        </p>
        <a
          href="https://www.berwynfarmersmarket.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-sage-500 text-white font-semibold rounded-full hover:bg-sage-600 transition-colors"
        >
          Apply on Official Website
        </a>
      </div>
    </div>
  );
}
