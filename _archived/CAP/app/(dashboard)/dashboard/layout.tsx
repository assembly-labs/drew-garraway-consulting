import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CAPHeader } from '@/components/shared/CAPHeader';
import { CAPFooter } from '@/components/shared/CAPFooter';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check age verification
  const { data: profile } = await supabase
    .from('users')
    .select('age_verified')
    .eq('id', user.id)
    .single() as { data: { age_verified: boolean } | null };

  if (profile && !profile.age_verified) {
    redirect('/verify');
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CAPHeader user={user} />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <CAPFooter />
    </div>
  );
}