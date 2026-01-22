'use client';

import { useState, FormEvent } from 'react';
import FormField from '@/components/forms/FormField';
import FormSuccess from '@/components/forms/FormSuccess';
import FormError from '@/components/forms/FormError';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  interestAreas: string[];
  message: string;
}

interface FormErrors {
  companyName?: string;
  contactName?: string;
  email?: string;
  interestAreas?: string;
  message?: string;
}

const interestOptions = [
  'Community Champion ($10,000+)',
  'Market Sustainer ($5,000-$9,999)',
  'Vendor Supporter ($1,000-$4,999)',
  'Community Friend (Under $1,000)',
  'Targeted Sponsorship Program',
  'In-Kind Support',
  'Employee Volunteer Opportunities',
];

export default function PartnerInquiryForm() {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    interestAreas: [],
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.interestAreas.length === 0) {
      newErrors.interestAreas = 'Please select at least one area of interest';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please tell us about your organization';
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
      const response = await fetch('/api/partners', {
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
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      interestAreas: [],
      message: '',
    });
    setErrors({});
    setStatus('idle');
    setErrorMessage('');
  };

  const handleInterestChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      interestAreas: prev.interestAreas.includes(option)
        ? prev.interestAreas.filter(i => i !== option)
        : [...prev.interestAreas, option],
    }));
  };

  if (status === 'success') {
    return (
      <FormSuccess
        message="Thank you for your interest in partnering with Locally Strong! We'll be in touch soon."
        ctaLabel="Submit another inquiry"
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
          label="Company/Organization Name"
          name="companyName"
          type="text"
          value={formData.companyName}
          onChange={(value) => setFormData({ ...formData, companyName: value })}
          placeholder="Acme Corporation"
          required
          disabled={status === 'loading'}
          error={errors.companyName}
        />

        <FormField
          label="Contact Name"
          name="contactName"
          type="text"
          value={formData.contactName}
          onChange={(value) => setFormData({ ...formData, contactName: value })}
          placeholder="Jane Smith"
          required
          disabled={status === 'loading'}
          error={errors.contactName}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          placeholder="jane@company.com"
          required
          disabled={status === 'loading'}
          error={errors.email}
        />

        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value })}
          placeholder="(555) 123-4567"
          disabled={status === 'loading'}
        />
      </div>

      {/* Interest Areas Checkboxes */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-charcoal">
          Areas of Interest
          <span className="ml-1 text-red-500" aria-hidden="true">*</span>
        </label>
        <div className="grid gap-2 md:grid-cols-2">
          {interestOptions.map((option) => (
            <label key={option} className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.interestAreas.includes(option)}
                onChange={() => handleInterestChange(option)}
                disabled={status === 'loading'}
                className={cn(
                  'mt-1 h-4 w-4 rounded border-charcoal/30 text-forest',
                  'focus:ring-2 focus:ring-forest/20 focus:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              />
              <span className="text-sm text-charcoal/80">{option}</span>
            </label>
          ))}
        </div>
        {errors.interestAreas && (
          <p className="text-sm text-red-600" role="alert">
            {errors.interestAreas}
          </p>
        )}
      </div>

      <FormField
        label="Tell us about your organization and goals"
        name="message"
        type="textarea"
        value={formData.message}
        onChange={(value) => setFormData({ ...formData, message: value })}
        placeholder="What interests you about partnering with Locally Strong? What are you hoping to achieve?"
        required
        disabled={status === 'loading'}
        error={errors.message}
        rows={4}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === 'loading'}
        className="w-full md:w-auto"
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
      </Button>
    </form>
  );
}
