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
    const { userId, birthYear } = JSON.parse(event.body!);

    // Validate input
    if (!userId || !birthYear) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Calculate age
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear);

    if (age < 18) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: 'You must be 18 or older to use CAP',
          verified: false,
        }),
      };
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        verified: true,
        message: 'Age verification successful',
      }),
    };
  } catch (error: any) {
    console.error('Age verification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Failed to verify age'
      }),
    };
  }
};