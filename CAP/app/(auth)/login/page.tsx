import { Metadata } from 'next';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { CAPLogo } from '@/components/shared/CAPLogo';

export const metadata: Metadata = {
  title: 'Sign In | CAP',
  description: 'Sign in to your CAP account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gold-50 to-white p-4">
      <div className="mb-8">
        <CAPLogo size="lg" />
      </div>
      <LoginForm />
      <p className="mt-8 text-sm font-body text-navy-700 text-center max-w-md">
        CAP protects your data. We never share your information without your consent.
      </p>
    </div>
  );
}