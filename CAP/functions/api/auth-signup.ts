/// <reference types="@cloudflare/workers-types" />
/**
 * Cloudflare Pages Function: Auth Signup
 * Migrated from Netlify Functions
 */

import { createClient } from '@supabase/supabase-js';

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY
  );

  try {
    const { email, password, fullName } = await request.json();

    // Validate input
    if (!email || !password || !fullName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {
        full_name: fullName,
      },
    });

    if (authError) {
      throw authError;
    }

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          full_name: fullName,
          age_verified: false,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: authData.user,
        message: 'Account created successfully',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to create account'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
