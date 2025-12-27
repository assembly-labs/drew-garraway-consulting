"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { capConfig } from '@/lib/cap-config';

interface AgeVerificationProps {
  isOpen: boolean;
  onVerify: (verified: boolean) => void;
}

export function AgeVerification({ isOpen, onVerify }: AgeVerificationProps) {
  const [birthYear, setBirthYear] = useState('');

  if (!isOpen) return null;

  const handleVerify = () => {
    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (age >= capConfig.limits.minAge) {
      onVerify(true);
    } else {
      onVerify(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-cap-secondary">Age Verification</h2>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            {capConfig.messages.ageVerification}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Please enter your birth year to confirm you are 18 or older.
          </p>

          <input
            type="number"
            placeholder="YYYY"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="w-full p-3 border rounded-md"
            min="1900"
            max={new Date().getFullYear()}
            required
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => onVerify(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            variant="cap"
            className="flex-1"
            disabled={!birthYear || birthYear.length !== 4}
          >
            Verify Age
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          We take privacy seriously. This information is only used for age verification
          and is not stored or shared.
        </p>
      </div>
    </div>
  );
}