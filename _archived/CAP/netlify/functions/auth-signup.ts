import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const handler: Handler = async (event, context) => {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email, password, fullName } = JSON.parse(event.body!);

    // Validate input
    if (!email || !password || !fullName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
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
        // Don't fail the whole signup if profile creation fails
        // User can be fixed manually
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: authData.user,
        message: 'Account created successfully',
      }),
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Failed to create account'
      }),
    };
  }
};