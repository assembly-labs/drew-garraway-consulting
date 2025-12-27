import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CAPLogo } from '@/components/shared/CAPLogo';

export const metadata: Metadata = {
  title: 'Verify Email | CAP',
  description: 'Verify your email address',
};

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-cap-gold/10 to-white p-4">
      <div className="mb-8">
        <CAPLogo size="lg" />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a verification link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="text-6xl">📧</div>
            <p className="text-gray-600">
              We&apos;ve sent a verification email to your inbox. Please click the link in the email to verify your account.
            </p>
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or request a new verification email.
            </p>
          </div>
          <div className="space-y-3 pt-4">
            <Link href="/login" className="block">
              <Button variant="cap" className="w-full">
                Back to Sign In
              </Button>
            </Link>
            <Button variant="outline" className="w-full">
              Resend Verification Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}