'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill demo credentials
  const fillDemoCredentials = (role: string) => {
    setEmail(`${role}@test.com`);
    setPassword('demo123');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);

    if (success) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password. Try demo123 as password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body">Back to home</span>
        </Link>

        {/* Login Card */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="font-display text-5xl text-cyan-500 uppercase">CAP</h1>
            <p className="font-accent text-sm text-gray-400 uppercase tracking-wider mt-2">
              Championship Athletic Prospects
            </p>
          </div>

          {/* Welcome Text */}
          <h2 className="font-display text-3xl text-gray-100 uppercase text-center mb-2">
            Welcome Back
          </h2>
          <p className="font-body text-gray-400 text-center mb-8">
            Sign in to continue creating champions
          </p>

          {/* Quick Demo Buttons */}
          <div className="mb-6 p-4 bg-dark-700 border border-dark-600 rounded-lg">
            <p className="font-body text-sm text-gray-300 mb-2">Quick demo login:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('parent')}
                className="text-xs px-2 py-1 bg-dark-800 text-gray-300 border border-dark-600 rounded hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-colors"
              >
                Parent
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('coach')}
                className="text-xs px-2 py-1 bg-dark-800 text-gray-300 border border-dark-600 rounded hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-colors"
              >
                Coach
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('photographer')}
                className="text-xs px-2 py-1 bg-dark-800 text-gray-300 border border-dark-600 rounded hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-colors"
              >
                Photographer
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="text-xs px-2 py-1 bg-dark-800 text-gray-300 border border-dark-600 rounded hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-body text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 text-gray-100 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 text-gray-100 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-sm font-body text-cyan-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-800 font-body text-gray-500">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="font-body text-sm text-gray-400 mb-2">
              Don't have an account yet?
            </p>
            <Link href="/signup" className="btn-ghost inline-block">
              Create Account
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-center font-body text-sm text-gray-400">
          CAP protects your data. We never share your information without your consent.
        </p>
      </div>
    </div>
  );
}