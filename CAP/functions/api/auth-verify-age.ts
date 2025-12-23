/// <reference types="@cloudflare/workers-types" />
/**
 * Cloudflare Pages Function: Age Verification
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
    const { userId, birthYear } = await request.json();

    // Validate input
    if (!userId || !birthYear) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Calculate age
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear);

    if (age < 18) {
      return new Response(
        JSON.stringify({
          error: 'You must be 18 or older to use CAP',
          verified: false,
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update user profile
    const { error } = await supabase
      .from('users')
      .update({
        age_verified: true,
        age_verified_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        verified: true,
        message: 'Age verification successful',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Age verification error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to verify age'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
