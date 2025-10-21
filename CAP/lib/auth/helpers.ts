import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Create user profile
  if (data.user) {
    const { error: profileError } = await (supabase as any)
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        age_verified: false,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }
  }

  return { data };
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function verifyAge(userId: string) {
  const supabase = createClient();

  const { error } = await (supabase as any)
    .from('users')
    .update({
      age_verified: true,
      age_verified_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function resetPassword(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function getUser() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get full user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    ...user,
    profile,
  };
}