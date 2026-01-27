import { useParams, Link } from 'react-router-dom';
import { CheckCircle, MapPin, Clock, QrCode, Calendar, ArrowRight } from 'lucide-react';

export default function ConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();

  // Generate a simple QR code-like display (in production, use a real QR library)
  const qrCodeData = orderId || 'ORDER';

  return (
    <div className="min-h-screen bg-dash-hover">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-sage-500" />
          </div>
          <h1 className="text-3xl font-bold font-display text-dash-text mb-2">
            Order Confirmed!
          </h1>
          <p className="text-dash-muted">
            Thank you for supporting local farmers and makers
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-dash-border">
            <div>
              <p className="text-sm text-dash-muted mb-1">Order Number</p>
              <p className="text-xl font-bold font-display text-dash-text">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-dash-muted mb-1">Status</p>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-sage-500 rounded-full"></span>
                Confirmed
              </span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="text-center mb-6 pb-6 border-b border-dash-border">
            <p className="text-sm text-dash-muted mb-4">Show this QR code at pickup</p>
            <div className="inline-flex flex-col items-center">
              {/* Simulated QR Code */}
              <div className="w-48 h-48 bg-white border-2 border-dash-border rounded-xl p-4 flex items-center justify-center">
                <div className="w-full h-full relative">
                  {/* QR Code Pattern (simplified visual representation) */}
                  <div className="absolute inset-0 grid grid-cols-7 grid-rows-7 gap-1">
                    {Array.from({ length: 49 }).map((_, i) => {
                      // Create a pseudo-random pattern based on order ID
                      const seed = (qrCodeData.charCodeAt(i % qrCodeData.length) + i) % 3;
                      const isCorner =
                        (i < 3 || (i >= 4 && i < 7)) && (i % 7 < 3) || // top-left
                        (i < 7 && i % 7 >= 4) || // top-right
                        (i >= 42 && i % 7 < 3); // bottom-left

                      return (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            isCorner || seed === 0
                              ? 'bg-dash-text'
                              : seed === 1
                                ? 'bg-dash-border'
                                : 'bg-white'
                          }`}
                        />
                      );
                    })}
                  </div>
                  {/* Center logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-sage-500" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-dash-muted mt-3 font-mono">{orderId}</p>
            </div>
          </div>

          {/* Pickup Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-dash-text">Pickup Details</h3>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-sage-50 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-sage-600" />
              </div>
              <div>
                <p className="font-medium text-dash-text">Berwyn Farmers Market</p>
                <p className="text-sm text-dash-muted">Berwyn Train Station, Berwyn, PA</p>
                <a
                  href="https://maps.google.com/?q=Berwyn+Train+Station+Berwyn+PA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sage-600 hover:text-sage-700"
                >
                  Get directions
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-sage-50 rounded-lg flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-sage-600" />
              </div>
              <div>
                <p className="font-medium text-dash-text">Saturday, Next Market Day</p>
                <p className="text-sm text-dash-muted">May through November</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-sage-50 rounded-lg flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-sage-600" />
              </div>
              <div>
                <p className="font-medium text-dash-text">Pickup Time Selected</p>
                <p className="text-sm text-dash-muted">Your order will be ready at the Gather pickup tent</p>
              </div>
            </div>
          </div>
        </div>

        {/* What to Expect */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <h3 className="font-semibold text-dash-text mb-4">What to Expect</h3>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-sage-100 text-sage-700 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                1
              </span>
              <p className="text-sm text-dash-muted">
                <span className="text-dash-text font-medium">Arrive at the market</span> and head to the Gather pickup tent near the main entrance
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-sage-100 text-sage-700 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                2
              </span>
              <p className="text-sm text-dash-muted">
                <span className="text-dash-text font-medium">Show your QR code</span> to our staff at the pickup tent
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-sage-100 text-sage-700 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                3
              </span>
              <p className="text-sm text-dash-muted">
                <span className="text-dash-text font-medium">Receive your order</span> - all items from multiple vendors packed and ready!
              </p>
            </li>
          </ol>
        </div>

        {/* Email Confirmation Notice */}
        <div className="bg-sage-50 rounded-xl p-4 mb-8">
          <p className="text-sm text-sage-700 text-center">
            A confirmation email has been sent with your order details and QR code
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/browse"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-sage-500 text-white font-semibold rounded-lg hover:bg-sage-600 transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="flex-1 py-3 border border-dash-border text-dash-text font-semibold rounded-lg hover:bg-dash-hover transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-dash-muted">
            Questions about your order?{' '}
            <a href="mailto:support@gatherfarmersmarket.com" className="text-sage-600 hover:text-sage-700">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
