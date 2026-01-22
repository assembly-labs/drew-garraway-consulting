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
  phone: string;
  storyTitle: string;
  story: string;
  consent: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  storyTitle?: string;
  story?: string;
  consent?: string;
}

export default function StorySubmitForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    storyTitle: '',
    story: '',
    consent: false,
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

    if (!formData.storyTitle.trim()) {
      newErrors.storyTitle = 'Story title is required';
    }

    if (!formData.story.trim()) {
      newErrors.story = 'Your story is required';
    } else if (formData.story.trim().length < 100) {
      newErrors.story = 'Please write at least 100 characters';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to allow publication';
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
      const response = await fetch('/api/stories', {
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
      phone: '',
      storyTitle: '',
      story: '',
      consent: false,
    });
    setErrors({});
    setStatus('idle');
    setErrorMessage('');
  };

  if (status === 'success') {
    return (
      <FormSuccess
        message="Thank you for sharing your story! We'll review it and reach out if we have any questions."
        ctaLabel="Submit another story"
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

      <FormField
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(value) => setFormData({ ...formData, phone: value })}
        placeholder="(555) 123-4567"
        disabled={status === 'loading'}
      />

      <FormField
        label="Story Title"
        name="storyTitle"
        type="text"
        value={formData.storyTitle}
        onChange={(value) => setFormData({ ...formData, storyTitle: value })}
        placeholder="Give your story a title"
        required
        disabled={status === 'loading'}
        error={errors.storyTitle}
      />

      <FormField
        label="Your Story"
        name="story"
        type="textarea"
        value={formData.story}
        onChange={(value) => setFormData({ ...formData, story: value })}
        placeholder="Tell us your story. How has local food, farmers markets, or the Locally Strong community impacted your life? What do you want others to know?"
        required
        disabled={status === 'loading'}
        error={errors.story}
        rows={8}
        minLength={100}
      />

      <p className="text-sm text-charcoal/60">
        {formData.story.length} / 100 minimum characters
      </p>

      {/* Consent Checkbox */}
      <div className="space-y-2">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            disabled={status === 'loading'}
            className={cn(
              'mt-1 h-5 w-5 rounded border-charcoal/30 text-forest',
              'focus:ring-2 focus:ring-forest/20 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              errors.consent && 'border-red-500'
            )}
            aria-invalid={errors.consent ? 'true' : undefined}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span className="text-sm text-charcoal">
            I agree to allow Locally Strong to publish this story on their website and in promotional materials. I understand that my story may be edited for clarity and length.
            <span className="ml-1 text-red-500" aria-hidden="true">*</span>
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="text-sm text-red-600" role="alert">
            {errors.consent}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === 'loading'}
        className="w-full md:w-auto"
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Your Story'}
      </Button>
    </form>
  );
}
