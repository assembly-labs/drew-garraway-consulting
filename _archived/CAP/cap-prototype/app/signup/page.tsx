'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { UserRole } from '@/lib/mock-data';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '' as UserRole | '',
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleAgeVerification = () => {
    // Check if user is 18+
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const isAdult = age >= 18;

    if (isAdult && formData.acceptTerms) {
      setStep(3);
    } else {
      alert('You must be 18 or older and accept the terms to continue.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await signup(
      formData.email,
      formData.password,
      formData.role as UserRole,
      formData.name
    );

    if (success) {
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-cyan-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body">Back to home</span>
        </Link>

        {/* Signup Card */}
        <div className="bg-dark-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-5xl text-cyan-500 uppercase">CAP</h1>
            <p className="font-accent text-sm text-gray-300 uppercase tracking-wider mt-2">
              Championship Athletic Prospects
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-cyan-500 text-dark-900' : 'bg-dark-600 text-gray-500'
              }`}>
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-cyan-500' : 'bg-dark-600'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-cyan-500 text-dark-900' : 'bg-dark-600 text-gray-500'
              }`}>
                {step > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-cyan-500' : 'bg-dark-600'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-cyan-500 text-dark-900' : 'bg-dark-600 text-gray-500'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <>
              <h2 className="font-display text-3xl text-gray-100 uppercase text-center mb-4">
                Welcome to CAP
              </h2>
              <p className="font-body text-gray-300 text-center mb-8">
                Let's get started by selecting your role
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect('parent')}
                  className="p-6 border-2 border-dark-600 rounded-xl hover:border-cyan-500 hover:bg-dark-700 transition-all group"
                >
                  <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
                  <h3 className="font-display text-xl text-gray-100 uppercase mb-2">Parent</h3>
                  <p className="font-body text-sm text-gray-300">
                    Create cards for your young champions
                  </p>
                </button>

                <button
                  onClick={() => handleRoleSelect('coach')}
                  className="p-6 border-2 border-dark-600 rounded-xl hover:border-cyan-500 hover:bg-dark-700 transition-all group"
                >
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="font-display text-xl text-gray-100 uppercase mb-2">Coach</h3>
                  <p className="font-body text-sm text-gray-300">
                    Manage cards for your entire team
                  </p>
                </button>

                <button
                  onClick={() => handleRoleSelect('photographer')}
                  className="p-6 border-2 border-dark-600 rounded-xl hover:border-cyan-500 hover:bg-dark-700 transition-all group"
                >
                  <div className="text-4xl mb-3">📸</div>
                  <h3 className="font-display text-xl text-gray-100 uppercase mb-2">Photographer</h3>
                  <p className="font-body text-sm text-gray-300">
                    Professional team photography services
                  </p>
                </button>

                <button
                  onClick={() => handleRoleSelect('admin')}
                  className="p-6 border-2 border-dark-600 rounded-xl hover:border-cyan-500 hover:bg-dark-700 transition-all group"
                >
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="font-display text-xl text-gray-100 uppercase mb-2">Admin</h3>
                  <p className="font-body text-sm text-gray-300">
                    Platform administration access
                  </p>
                </button>
              </div>
            </>
          )}

          {/* Step 2: Age Verification */}
          {step === 2 && (
            <>
              <h2 className="font-display text-3xl text-gray-100 uppercase text-center mb-4">
                Age Verification
              </h2>
              <p className="font-body text-gray-300 text-center mb-8">
                CAP requires all users to be 18 years or older
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block font-body text-sm font-medium text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-dark-700 border-2 border-dark-600 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors text-gray-100"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                      className="mt-1 w-4 h-4 text-cyan-500 border-2 border-dark-600 rounded focus:ring-cyan-500"
                    />
                    <span className="font-body text-sm text-gray-300">
                      I confirm that I am 18 years or older and I accept the CAP{' '}
                      <Link href="/terms" className="text-cyan-500 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-cyan-500 hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  <div className="p-4 bg-dark-700 rounded-lg border border-dark-600">
                    <p className="font-body text-sm text-gray-300">
                      <strong>COPPA Compliance:</strong> CAP is committed to protecting children's privacy.
                      We only collect minimal information about children (first name, jersey number) and
                      all photos are automatically deleted after 30 days.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-ghost flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleAgeVerification}
                    disabled={!formData.dateOfBirth || !formData.acceptTerms}
                    className="btn-primary flex-1"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Account Details */}
          {step === 3 && (
            <>
              <h2 className="font-display text-3xl text-gray-100 uppercase text-center mb-4">
                Create Your Account
              </h2>
              <p className="font-body text-gray-300 text-center mb-8">
                Almost there! Enter your account details
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-body text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700 border-2 border-dark-600 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors text-gray-100"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block font-body text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700 border-2 border-dark-600 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors text-gray-100"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block font-body text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700 border-2 border-dark-600 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors text-gray-100"
                    placeholder="Create a strong password"
                    minLength={8}
                    required
                  />
                  <p className="mt-1 text-xs font-body text-gray-400">
                    Minimum 8 characters
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-ghost flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Start Creating Cards
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center font-body text-sm text-gray-300">
          Already have an account?{' '}
          <Link href="/login" className="text-cyan-500 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}