# Beta Launch - Claude Context

## What This Is

Automated beta tester onboarding for TOMO at Alliance Paoli BJJ gym. Static HTML pages hosted on assemblylabs.co + Supabase backend for signup, NDA agreement, and email notifications via Gmail SMTP.

## Status: LIVE (Mar 28, 2026)

Full flow tested and verified. All infrastructure deployed. Only remaining step: send text message to Alliance Paoli.

## Session Start

1. Read this file
2. Read `docs/beta-launch/README.md` for full status
3. Ask Drew what to work on

## Locked Files (Do Not Modify)

- `assembly-labs/alliance/tomo/index.html` (one-pager, approved + deployed)
- `assembly-labs/alliance/tomo/agreement.html` (NDA, approved + deployed)

## Live URLs

- **One-pager + signup:** https://assemblylabs.co/alliance/tomo/
- **Agreement:** https://assemblylabs.co/alliance/tomo/agreement.html

## Key Files

| File | Purpose |
|------|---------|
| `docs/beta-launch/README.md` | Project status, architecture, test results |
| `docs/legal/ALLIANCE_PAOLI_GYM_MESSAGE.html` | Text + email message templates (copy/paste) |
| `tomo/supabase/functions/beta-signup-notify/index.ts` | Signup edge function (v2, native SMTP) |
| `tomo/supabase/functions/nda-agreement-notify/index.ts` | NDA edge function (v2, native SMTP) |
| `tomo/supabase/config.toml` | Edge function config (8 functions total) |
| `tomo/supabase/migrations/20260328100000_beta_signup_tables.sql` | DB migration (applied) |

## Infrastructure (All Deployed)

- **Supabase Project:** `whzycopfjvwmsgzfqvig`
- **Tables:** `beta_signups`, `nda_agreements` (created, RLS active)
- **Edge Functions:** `beta-signup-notify`, `nda-agreement-notify` (deployed, --no-verify-jwt)
- **Gmail SMTP:** `GMAIL_APP_PASSWORD` secret set, sending from drew@assemblylabs.co
- **Cloudflare Pages:** Pages deployed via assembly-labs repo, auto-deploys on push to main

## Edge Function Notes

- v1 used `deno.land/x/smtp` library which is incompatible with Supabase Edge Runtime
- v2 uses native `Deno.connectTls` for direct SMTP to smtp.gmail.com:465
- Both functions handle CORS preflight (OPTIONS) for cross-origin requests from assemblylabs.co

## Design Rules

- Mobile-first, dark theme only (#111111 bg, #F5A623 gold)
- No emojis, no em dashes
- Body text min 16px, inputs min 17px
- Touch targets min 44px, primary actions 56px

## To Redeploy Pages After Local Edits

```
cp docs/legal/ALLIANCE_PAOLI_BETA_ONEPAGER.html ~/Documents/GitHub/assembly-labs/alliance/tomo/index.html
cp docs/legal/ALLIANCE_PAOLI_BETA_AGREEMENT.html ~/Documents/GitHub/assembly-labs/alliance/tomo/agreement.html
cd ~/Documents/GitHub/assembly-labs
git add alliance/tomo/
git commit -m "Update TOMO beta pages"
git push origin main
```

## Do NOT

- Modify the locked HTML files without Drew's approval
- Deploy anything without Drew's approval
- Commit to main branch directly on assembly-labs (use PRs)
- Use em dashes in any content
