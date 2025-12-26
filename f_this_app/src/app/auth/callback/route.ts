import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user is new (needs onboarding)
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();

        // If no profile exists, they're new - send to onboarding
        if (!profile) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      return NextResponse.redirect(`${origin}/home`);
    }
  }

  // Return to login on error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
