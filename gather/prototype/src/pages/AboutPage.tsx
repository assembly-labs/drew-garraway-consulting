import { MapPin, Clock, Car, Sun, CloudRain, CreditCard, Dog, HelpCircle, Users, Heart, BookOpen, Megaphone, ShoppingBag } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-dash-text mb-4">
          About the Market
        </h1>
        <p className="text-lg text-dash-muted max-w-2xl mx-auto">
          Creating an immersive shopping and community experience for residents of the Main Line in the heart of Berwyn
        </p>
      </div>

      {/* Market Details Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-display text-dash-text mb-6 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-sage-500" />
          Market Details
        </h2>

        <div className="bg-sage-50 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Location */}
          <div>
            <h3 className="font-semibold text-dash-text mb-2">Location</h3>
            <p className="text-dash-muted">
              Bronze Plaza<br />
              511 Old Lancaster Road<br />
              Berwyn, PA 19312<br />
              <span className="text-sm italic">(Located in front of Handel's Ice Cream on Route 30)</span>
            </p>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-sage-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-dash-text mb-2">Operating Hours</h3>
              <ul className="text-dash-muted space-y-1">
                <li><strong>May - December:</strong> Sundays, 9:00 AM - 12:00 PM</li>
                <li><strong>January - April:</strong> 2nd and 4th Sundays, 9:00 AM - 12:00 PM</li>
              </ul>
            </div>
          </div>

          {/* Parking */}
          <div className="flex items-start gap-3">
            <Car className="w-5 h-5 text-sage-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-dash-text mb-2">Parking</h3>
              <p className="text-dash-muted">
                Free parking is available in the garage behind Handel's Ice Cream, accessible via the entrance between Barre3 studio and Kramer Drive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-display text-dash-text mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-sage-500" />
          Our Mission
        </h2>

        <p className="text-dash-muted mb-8">
          The Berwyn Farmers' Market aims to create an immersive shopping and community experience for residents of the Main Line through a curated network of local producers and farmers.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-dash-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-sage-600" />
              </div>
              <h3 className="font-semibold text-dash-text">Connect</h3>
            </div>
            <p className="text-sm text-dash-muted">
              Link Main Line residents with local farmers and artisans via weekly outdoor markets
            </p>
          </div>

          <div className="bg-white border border-dash-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-sage-600" />
              </div>
              <h3 className="font-semibold text-dash-text">Foster</h3>
            </div>
            <p className="text-sm text-dash-muted">
              Establish an enriching community event that brings residents together in Berwyn
            </p>
          </div>

          <div className="bg-white border border-dash-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-sage-600" />
              </div>
              <h3 className="font-semibold text-dash-text">Educate</h3>
            </div>
            <p className="text-sm text-dash-muted">
              Inform consumers about supporting local food systems and small businesses
            </p>
          </div>

          <div className="bg-white border border-dash-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-sage-600" />
              </div>
              <h3 className="font-semibold text-dash-text">Promote</h3>
            </div>
            <p className="text-sm text-dash-muted">
              Increase producer visibility through in-person interactions and social media
            </p>
          </div>

          <div className="bg-white border border-dash-border rounded-xl p-5 sm:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-sage-600" />
              </div>
              <h3 className="font-semibold text-dash-text">Satisfy</h3>
            </div>
            <p className="text-sm text-dash-muted">
              Provide convenient access to local produce and quality goods on the Main Line
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-display text-dash-text mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-sage-500" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="bg-white border border-dash-border rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Dog className="w-5 h-5 text-sage-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-dash-text mb-2">Can I bring my dog to the market?</h3>
                <p className="text-dash-muted text-sm">
                  No animals (except service animals) are allowed at the market. The market prioritizes safety due to its proximity to Route 30.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-dash-border rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Car className="w-5 h-5 text-sage-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-dash-text mb-2">Where can I park?</h3>
                <p className="text-dash-muted text-sm">
                  Free parking is available in the garage behind Handel's Ice Cream and Kramer Drive building, accessible via the entrance between Barre3 and Kramer Drive.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-dash-border rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-sage-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-dash-text mb-2">Is my favorite vendor attending this week?</h3>
                <p className="text-dash-muted text-sm">
                  Check social media and the weekly newsletter for vendor announcements made a few days before market day. Vendor attendance may change without notice.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-dash-border rounded-xl p-5">
            <div className="flex items-start gap-3">
              <CloudRain className="w-5 h-5 text-sage-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-dash-text mb-2">Is there still a market if it's raining?</h3>
                <p className="text-dash-muted text-sm">
                  Yes! The market operates rain or shine as an outdoor, all-weather event. Vendors will still be offering their goods.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-dash-border rounded-xl p-5">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-sage-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-dash-text mb-2">What payment options are accepted?</h3>
                <p className="text-dash-muted text-sm">
                  Most vendors accept cash, card, tap-to-pay, and/or Venmo.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-dash-border rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Sun className="w-5 h-5 text-sage-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-dash-text mb-2">How do I become a vendor?</h3>
                <p className="text-dash-muted text-sm">
                  Submit an application through the "Become A Vendor" section on the official Berwyn Farmers Market website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management */}
      <section className="bg-sage-900 text-white rounded-2xl p-6 sm:p-8 text-center">
        <p className="text-sage-200 text-sm mb-2">Curated and Managed by</p>
        <p className="text-xl font-semibold mb-4">Culinary Harvest</p>
        <p className="text-sage-300 text-sm">A Best of Main Line Organization</p>
      </section>
    </div>
  );
}
