# TOMO Beta Launch: Alliance Paoli

## Overview

Automated beta tester onboarding flow for Alliance Paoli BJJ gym. Goal: 5-30+ testers signed up with minimal manual effort from Drew.

## Live URLs (after PR merge)

- **One-pager + signup:** `https://traintomo.com/`
- **Beta agreement:** `https://traintomo.com/agreement.html`
- **PR:** https://github.com/assembly-labs/assembly-labs/pull/1

## Tester Flow

```
1. Gym sends text to members with link to traintomo.com/
2. Tester reads one-pager, fills out signup form (name, email, belt, iPhone model)
3. [AUTO] Edge function inserts into beta_signups table
4. [AUTO] Edge function emails tester with link to agreement page
5. [AUTO] Edge function emails Drew notification of new signup
6. Tester clicks link in email, reads agreement, taps "I Agree"
7. [AUTO] Edge function inserts into nda_agreements table
8. [AUTO] Edge function emails Drew that tester agreed, ready for TestFlight
9. [MANUAL] Drew sends TestFlight invite via App Store Connect
```

Only one manual step: sending the TestFlight invite after NDA is signed.

## Status

### Completed (Locked)

| Deliverable | File | Hosted URL |
|-------------|------|------------|
| One-pager + signup form | `assembly-labs/alliance/tomo/index.html` | `traintomo.com/` |
| Beta tester agreement | `assembly-labs/alliance/tomo/agreement.html` | `traintomo.com/agreement.html` |
| Danaher GIF overlay | `assembly-labs/alliance/tomo/john-danaher-golf-clap.gif` | (loaded by index.html) |
| Gym text message | `TOMO/docs/legal/ALLIANCE_PAOLI_GYM_MESSAGE.html` | Local only (copy/paste) |
| DB migration | `tomo/supabase/migrations/20260328100000_beta_signup_tables.sql` | Run via `supabase db push` |
| Signup edge function | `tomo/supabase/functions/beta-signup-notify/index.ts` | Deploy via CLI |
| NDA edge function | `tomo/supabase/functions/nda-agreement-notify/index.ts` | Deploy via CLI |
| Supabase config | `tomo/supabase/config.toml` (2 new functions added) | Deploy via CLI |

### Infrastructure Status

| Step | What | Status |
|------|------|--------|
| 1 | Merge PR #1 on assembly-labs repo | Done (Mar 28) |
| 2 | Generate Gmail App Password for drew@assemblylabs.co | Done (Mar 28) |
| 3 | Run `supabase db push` (creates tables) | Done (Mar 28, via SQL editor) |
| 4 | Run `supabase secrets set GMAIL_APP_PASSWORD=xxxx` | Done (Mar 28) |
| 5 | Deploy edge functions (2 commands) | Done (Mar 28, v2 with native SMTP) |
| 6 | Test the full flow end-to-end | Done (Mar 28, verified signup + NDA + emails) |
| 7 | Send text message to Alliance Paoli | Ready to send |

### End-to-End Test Results (Mar 28, 2026)

Full flow verified with drew@assemblylabs.co:
1. Signup form on live page: submitted successfully, Danaher GIF displayed
2. Edge function inserted into beta_signups (status: nda_sent)
3. Auto-email sent to tester with personalized agreement link
4. Auto-email sent to Drew with signup notification
5. Tester clicked agreement link, tapped "I Agree"
6. Edge function inserted into nda_agreements (with IP, user agent, timestamp)
7. beta_signups status updated to "agreed"
8. Auto-email sent to Drew: "ready for TestFlight"

All emails delivered via Gmail SMTP (drew@assemblylabs.co).
Edge functions use native Deno.connectTls for SMTP (v1 SmtpClient library was incompatible with Supabase Edge Runtime).

## Architecture

- **Frontend:** Static HTML on Cloudflare Pages (assemblylabs.co)
- **Backend:** Supabase (existing TOMO project: `whzycopfjvwmsgzfqvig`)
- **Email:** Gmail SMTP via drew@assemblylabs.co (App Password)
- **Tables:** `beta_signups`, `nda_agreements` (insert-only RLS for anon)
- **Edge Functions:** `beta-signup-notify`, `nda-agreement-notify` (no JWT required)

## Database Tables

### beta_signups
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | TEXT | Required |
| email | TEXT | Required, unique (lowercase) |
| belt | TEXT | Required |
| iphone_model | TEXT | Optional |
| source | TEXT | Default: 'alliance_paoli' |
| status | TEXT | interested, nda_sent, agreed, testflight_sent, active, declined |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |

### nda_agreements
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | TEXT | Required |
| email | TEXT | Required |
| agreed_at | TIMESTAMPTZ | Auto |
| user_agent | TEXT | Browser info |
| ip_address | TEXT | From request headers |
| agreement_version | TEXT | Default: '2026-03-28' |

## Brand/Design Notes

- Dark theme: #111111 background, #F5A623 gold accents
- Fonts: Unbounded (headings), Inter (body)
- Mobile-first: base styles target phones, tablet+ via min-width: 640px
- No emojis. No em dashes. First-person voice from Drew.
- Coach Andrew and Marco referenced by name (Alliance Paoli specific)
- "Built by Assembly Labs, LLC" in footer

## Text Message (52 words)

> Hey Alliance Paoli family, Drew Garraway, blue belt from class, is offering his BJJ training journal app TOMO to our team for testing. Completely free to use. It helps you track your training, remember what you drilled, and stay consistent on your journey. Check out the details and sign up here: [LINK]

Replace [LINK] with `https://traintomo.com/`
