'use client';

import { useState, FormEvent } from 'react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section
      id="newsletter"
      className="bg-wheat py-16 md:py-24"
      aria-labelledby="newsletter-heading"
    >
      <Container size="sm">
        <div className="text-center">
          <SectionHeading
            headline="Stay Connected"
            subheadline="Get updates on markets, events, and ways to support local businesses."
            className="mb-8"
          />

          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-md"
            aria-describedby={status !== 'idle' ? 'newsletter-status' : undefined}
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={status === 'loading'}
                className="flex-1 rounded-full border border-charcoal/20 bg-white px-5 py-3 text-charcoal placeholder:text-charcoal/50 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 disabled:opacity-50"
                aria-invalid={status === 'error' ? 'true' : undefined}
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={status === 'loading'}
                className="px-8"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>

            {/* Status Message */}
            {status !== 'idle' && (
              <p
                id="newsletter-status"
                className={`mt-4 text-sm ${
                  status === 'success' ? 'text-forest' : status === 'error' ? 'text-red-600' : 'text-charcoal/70'
                }`}
                role={status === 'error' ? 'alert' : 'status'}
                aria-live="polite"
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}
