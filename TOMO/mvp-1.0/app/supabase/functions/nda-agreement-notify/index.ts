/**
 * TOMO — NDA Agreement Notification Edge Function
 *
 * Called when a tester taps "I Agree" on the agreement page.
 * 1. Inserts into nda_agreements table (legal log)
 * 2. Updates beta_signups status to 'agreed'
 * 3. Sends Drew a notification that the tester is ready for TestFlight
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DREW_EMAIL = 'drew@assemblylabs.co';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function sendGmail(to: string, subject: string, htmlBody: string) {
  const password = Deno.env.get('GMAIL_APP_PASSWORD');
  if (!password) {
    console.error('GMAIL_APP_PASSWORD not set, skipping email');
    return false;
  }

  try {
    const conn = await Deno.connectTls({
      hostname: 'smtp.gmail.com',
      port: 465,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    async function readResponse(): Promise<string> {
      const buf = new Uint8Array(4096);
      const n = await conn.read(buf);
      return decoder.decode(buf.subarray(0, n || 0));
    }

    async function sendCommand(cmd: string): Promise<string> {
      await conn.write(encoder.encode(cmd + '\r\n'));
      return await readResponse();
    }

    await readResponse();
    await sendCommand('EHLO assemblylabs.co');
    await sendCommand('AUTH LOGIN');
    await sendCommand(btoa(DREW_EMAIL));
    const authResult = await sendCommand(btoa(password));

    if (!authResult.startsWith('235')) {
      console.error('SMTP auth failed:', authResult);
      conn.close();
      return false;
    }

    await sendCommand(`MAIL FROM:<${DREW_EMAIL}>`);
    await sendCommand(`RCPT TO:<${to}>`);
    await sendCommand('DATA');

    const boundary = 'boundary_' + Date.now();
    const message = [
      `From: Drew Garraway <${DREW_EMAIL}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      htmlBody,
      '',
      `--${boundary}--`,
      '',
      '.',
    ].join('\r\n');

    const dataResult = await sendCommand(message);
    await sendCommand('QUIT');
    conn.close();

    return dataResult.startsWith('250');
  } catch (err) {
    console.error('SMTP error:', err);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { name, email, user_agent } = await req.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: 'Name and email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check for duplicate
    const { data: existing } = await supabase
      .from('nda_agreements')
      .select('id')
      .eq('email', cleanEmail)
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'You have already agreed. Drew will be in touch with your TestFlight invite.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('cf-connecting-ip')
      || 'unknown';

    // Insert NDA agreement
    const { error: ndaError } = await supabase
      .from('nda_agreements')
      .insert({
        name: name.trim(),
        email: cleanEmail,
        user_agent: user_agent || null,
        ip_address: ip,
        agreement_version: '2026-03-28',
      });

    if (ndaError) throw ndaError;

    // Update beta_signups status
    await supabase
      .from('beta_signups')
      .update({ status: 'agreed' })
      .eq('email', cleanEmail);

    // Look up belt for email
    const { data: signupData } = await supabase
      .from('beta_signups')
      .select('belt, iphone_model')
      .eq('email', cleanEmail)
      .single();

    // Email Drew
    await sendGmail(
      DREW_EMAIL,
      `TOMO NDA Signed: ${name.trim()} is ready for TestFlight`,
      `<div style="font-family: monospace; padding: 20px; color: #333;">
        <h3 style="margin: 0 0 8px 0; color: #22c55e;">NDA Agreement Signed</h3>
        <p style="margin: 0 0 16px 0; font-size: 14px;">This tester is ready for a TestFlight invite.</p>
        <table style="font-size: 14px; line-height: 1.8;">
          <tr><td style="padding-right: 16px; color: #888;">Name</td><td><strong>${name.trim()}</strong></td></tr>
          <tr><td style="padding-right: 16px; color: #888;">Email</td><td>${cleanEmail}</td></tr>
          <tr><td style="padding-right: 16px; color: #888;">Belt</td><td>${signupData?.belt || 'Unknown'}</td></tr>
          <tr><td style="padding-right: 16px; color: #888;">iPhone</td><td>${signupData?.iphone_model || 'Not provided'}</td></tr>
          <tr><td style="padding-right: 16px; color: #888;">Agreed at</td><td>${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</td></tr>
        </table>
        <p style="margin-top: 20px; font-size: 14px;">
          <strong>Next step:</strong> Add ${cleanEmail} to TestFlight in App Store Connect.
        </p>
      </div>`
    );

    return new Response(
      JSON.stringify({ success: true, message: 'Agreement signed. Drew will send your TestFlight invite shortly.' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('nda-agreement-notify error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
