# Environment Variables Reference

All the secrets and config values needed for TOMO MVP, and where each one goes.

## In the App (.env file)

These get embedded in the app. Only put PUBLIC identifiers here.

| Variable | Where to get it | Example |
|----------|----------------|---------|
| `SUPABASE_URL` | Supabase dashboard > Settings > API | `https://abcdefg.supabase.co` |
| `SUPABASE_ANON_KEY` | Same page, "anon public" key | `eyJhbGci...` (long JWT) |
| `SENTRY_DSN` | Sentry dashboard > Project Settings > Client Keys | `https://abc@sentry.io/123` |
| `EAS_PROJECT_ID` | Auto-generated when you run `eas init` | UUID |

**NEVER put these in the app .env:**
- ANTHROPIC_API_KEY
- ASSEMBLYAI_API_KEY
- SUPABASE_SERVICE_ROLE_KEY

## In Supabase Edge Functions (server-side secrets)

Set these with: `supabase secrets set KEY=value`

| Variable | Where to get it | Used by |
|----------|----------------|---------|
| `ANTHROPIC_API_KEY` | console.anthropic.com > API Keys | extract-session function |
| `ASSEMBLYAI_API_KEY` | assemblyai.com > Account | transcribe-audio function |

Note: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are automatically available inside Edge Functions — you don't need to set them manually.

## Account Signup Checklist

| Account | URL | Cost | Activation Time |
|---------|-----|------|----------------|
| Apple Developer | developer.apple.com | $99/year | Up to 48 hours |
| Supabase | supabase.com | Free | Instant |
| AssemblyAI | assemblyai.com | $50 free credit | Instant |
| Anthropic | console.anthropic.com | Pay-as-you-go (~$2-5 during dev) | Instant |
| Expo | expo.dev | Free | Instant |
| Sentry | sentry.io | Free tier | Instant |
