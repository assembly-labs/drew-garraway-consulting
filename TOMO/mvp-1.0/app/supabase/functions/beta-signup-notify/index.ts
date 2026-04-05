/**
 * TOMO — Beta Signup Notification Edge Function
 *
 * Called when someone submits the signup form on the one-pager.
 * 1. Inserts into beta_signups table
 * 2. Sends the tester an email with a link to the NDA agreement page
 * 3. Sends Drew a notification email about the new signup
 *
 * EMAIL: Uses Gmail SMTP via fetch to a simple email relay,
 * falling back to DB-only if email fails.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DREW_EMAIL = 'drew@assemblylabs.co';
const AGREEMENT_BASE_URL = 'https://traintomo.com/agreement.html';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Send email via Gmail SMTP using base64-encoded AUTH PLAIN over TLS
async function sendGmail(to: string, subject: string, htmlBody: string) {
  const password = Deno.env.get('GMAIL_APP_PASSWORD');
  if (!password) {
    console.error('GMAIL_APP_PASSWORD not set, skipping email');
    return false;
  }

  try {
    // Use Deno's built-in SMTP via connectTls
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

    // Read greeting
    await readResponse();

    // EHLO
    await sendCommand('EHLO assemblylabs.co');

    // AUTH LOGIN
    await sendCommand('AUTH LOGIN');
    await sendCommand(btoa(DREW_EMAIL));
    const authResult = await sendCommand(btoa(password));

    if (!authResult.startsWith('235')) {
      console.error('SMTP auth failed:', authResult);
      conn.close();
      return false;
    }

    // MAIL FROM
    await sendCommand(`MAIL FROM:<${DREW_EMAIL}>`);

    // RCPT TO
    await sendCommand(`RCPT TO:<${to}>`);

    // DATA
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

    // QUIT
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
    const { name, email, belt, iphone_model } = await req.json();

    if (!name || !email || !belt) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and belt are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    const { error: dbError } = await supabase
      .from('beta_signups')
      .insert({
        name: cleanName,
        email: cleanEmail,
        belt,
        iphone_model: iphone_model?.trim() || null,
        source: 'alliance_paoli',
        status: 'nda_sent',
      });

    if (dbError) {
      if (dbError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'This email has already signed up.' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw dbError;
    }

    // Send emails (non-blocking, don't fail the signup if email fails)
    const agreementUrl = `${AGREEMENT_BASE_URL}?email=${encodeURIComponent(cleanEmail)}&name=${encodeURIComponent(cleanName)}`;

    // Email tester
    await sendGmail(
      cleanEmail,
      'TOMO Beta | Review and Sign the Agreement',
      `<div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; color: #333;">
        <h2 style="margin: 0 0 16px 0; font-size: 22px;">Hey ${cleanName.split(' ')[0]},</h2>
        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px 0;">
          Thanks for signing up to beta test TOMO. Before I can send you the app, I need you to review and agree to a short beta tester agreement.
        </p>
        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
          It covers the basics: keep things between us during the beta, your feedback helps improve the product, and the app is provided as-is. Takes about 2 minutes to read.
        </p>
        <a href="${agreementUrl}" style="display: inline-block; background: #F5A623; color: #111; font-weight: 700; font-size: 17px; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
          Review Agreement
        </a>
        <p style="font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; color: #888;">
          Once you agree, I'll send you the TestFlight invite to download the app.
        </p>
        <p style="font-size: 16px; line-height: 1.7; margin: 24px 0 0 0;">
          See you on the mats,<br>Drew
        </p>
      </div>`
    );

    // Email Drew
    await sendGmail(
      DREW_EMAIL,
      `TOMO Beta Signup: ${cleanName} (${belt} belt)`,
      `<div style="font-family: monospace; padding: 20px; color: #333;">
        <h3 style="margin: 0 0 16px 0;">New Beta Signup</h3>
        <table style="font-size: 14px; line-height: 1.8;">
          <tr><td style="padding-right: 16px; color: #888;">Name</td><td><strong>${cleanName}</strong></td></tr>
          <tr><td style="padding-right: 16px; color: #888;">Email</td><td>${cleanEmail}</td></tr>
          <tr><td style="padding-right: 16px; color: #888;">Belt</td><td>${belt}</td></tr>
          <tr><td style="padding-right: 16px; color: #888;">iPhone</td><td>${iphone_model || 'Not provided'}</td></tr>
          <tr><td style="padding-right: 16px; color: #888;">Source</td><td>Alliance Paoli</td></tr>
        </table>
        <p style="margin-top: 16px; font-size: 13px; color: #888;">Agreement link was auto-sent to the tester.</p>
      </div>`
    );

    return new Response(
      JSON.stringify({ success: true, message: 'Signed up. Check your email for next steps.' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('beta-signup-notify error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
