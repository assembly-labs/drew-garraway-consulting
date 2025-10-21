import { Metadata } from 'next';
import { SignupForm } from '@/components/features/auth/SignupForm';
import { CAPLogo } from '@/components/shared/CAPLogo';

export const metadata: Metadata = {
  title: 'Sign Up | CAP',
  description: 'Create your CAP account and start making championship cards',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gold-50 to-white p-4">
      <div className="mb-8">
        <CAPLogo size="lg" />
      </div>
      <SignupForm />
      <div className="mt-8 max-w-md text-center">
        <p className="text-sm font-body text-navy-700 mb-2">
          Join thousands of parents creating amazing cards for their champions
        </p>
        <div className="flex justify-center gap-8 text-sm font-body text-navy-800">
          <span className="text-green-500">✓</span><span>5-minute setup</span>
          <span className="text-green-500">✓</span><span>No design skills needed</span>
          <span className="text-green-500">✓</span><span>100% safe</span>
        </div>
      </div>
    </div>
  );
}