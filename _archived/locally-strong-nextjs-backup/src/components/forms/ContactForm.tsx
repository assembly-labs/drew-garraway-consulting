'use client';

import { useState, FormEvent } from 'react';
import FormField from '@/components/forms/FormField';
import FormSuccess from '@/components/forms/FormSuccess';
import FormError from '@/components/forms/FormError';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const subjectOptions = [
  'General Inquiry',
  'Vendor Support',
  'Partnership Opportunity',
  'Volunteer Interest',
  'Media/Press',
  'Other',
];

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setErrors({});
    setStatus('idle');
    setErrorMessage('');
  };

  if (status === 'success') {
    return (
      <FormSuccess
        message="Thank you for your message! We'll get back to you within 2 business days."
        ctaLabel="Send another message"
        onCtaClick={handleReset}
      />
    );
  }

  if (status === 'error') {
    return (
      <FormError
        message={errorMessage}
        onRetry={() => setStatus('idle')}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          label="Your Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          placeholder="Jane Smith"
          required
          disabled={status === 'loading'}
          error={errors.name}
        />

        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          placeholder="jane@example.com"
          required
          disabled={status === 'loading'}
          error={errors.email}
        />
      </div>

      {/* Subject Dropdown */}
      <div className="space-y-2">
        <label htmlFor="subject" className="block text-sm font-medium text-charcoal">
          Subject
          <span className="ml-1 text-red-500" aria-hidden="true">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          disabled={status === 'loading'}
          className={cn(
            'w-full rounded-lg border bg-white px-4 py-3 text-charcoal',
            'focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20',
            'disabled:cursor-not-allowed disabled:bg-charcoal/5 disabled:opacity-50',
            errors.subject ? 'border-red-500' : 'border-charcoal/20'
          )}
          aria-invalid={errors.subject ? 'true' : undefined}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
        >
          <option value="">Select a subject...</option>
          {subjectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.subject && (
          <p id="subject-error" className="text-sm text-red-600" role="alert">
            {errors.subject}
          </p>
        )}
      </div>

      <FormField
        label="Message"
        name="message"
        type="textarea"
        value={formData.message}
        onChange={(value) => setFormData({ ...formData, message: value })}
        placeholder="How can we help you?"
        required
        disabled={status === 'loading'}
        error={errors.message}
        rows={5}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === 'loading'}
        className="w-full md:w-auto"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
