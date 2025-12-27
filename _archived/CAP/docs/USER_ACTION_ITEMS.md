# User Action Items for CAP Platform
**Last Updated:** 2024-10-20
**Status:** Active
**Critical Items:** 3

## 🔴 Critical Actions (Blocking Development)

### 1. Configure Environment Variables
**File:** Copy `.env.example` to `.env.local` and fill in:

```bash
# 1. Supabase (Required NOW)
NEXT_PUBLIC_SUPABASE_URL=         # Get from: https://app.supabase.com/project/[YOUR_PROJECT]/settings/api
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Get from: Same page, "anon/public" key
SUPABASE_SERVICE_KEY=              # Get from: Same page, "service_role" key (keep secret!)

# 2. Test the connection
npm run dev
# Visit http://localhost:3000 - should load without errors
```

### 2. Deploy to Netlify
```bash
# Option A: Via Netlify CLI
npm install -g netlify-cli
netlify init
netlify deploy

# Option B: Via Web UI
1. Go to https://app.netlify.com
2. Click "Add new site" > "Import existing project"
3. Connect GitHub account
4. Select "drew-garraway-consulting/CAP" repository
5. Deploy settings are already in netlify.toml
6. Click "Deploy site"
```

### 3. Verify Database Tables
```sql
-- Go to Supabase SQL Editor and run:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Should see: users, teams, children, photos, card_designs, orders, consent_log
```

## 🟡 Important Actions (Needed Soon)

### 4. Get Claude API Key
**When:** Before implementing bio generation (Phase 3)
```bash
1. Go to: https://console.anthropic.com
2. Sign up/Login
3. Go to API Keys section
4. Create new key
5. Add to .env.local: ANTHROPIC_API_KEY=sk-ant-...
```

### 5. Set Up Stripe Account
**When:** Before implementing checkout (Phase 4)
```bash
1. Go to: https://dashboard.stripe.com/register
2. Complete business information
3. Get API keys from Developers > API Keys
4. Add to .env.local:
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
5. Create webhook endpoint for order confirmation
```

### 6. Configure Netlify Environment Variables
**After deployment:**
```bash
1. Go to Netlify dashboard
2. Site settings > Environment variables
3. Add all variables from .env.local
4. Deploy again to apply
```

## 🟢 Optional Actions (Can Wait)

### 7. Set Up Email Service
**Options:**
- **Resend** (Recommended - easier)
  - Sign up at: https://resend.com
  - Get API key
  - Add: RESEND_API_KEY=re_...

- **SendGrid**
  - Sign up at: https://sendgrid.com
  - More complex setup
  - Add: SENDGRID_API_KEY=SG...

### 8. Custom Domain
```bash
1. Buy domain (e.g., capplatform.com)
2. In Netlify: Domain settings > Add custom domain
3. Follow DNS configuration steps
```

### 9. Analytics Setup
**Options:**
- Vercel Analytics (if migrating from Netlify)
- Google Analytics
- Posthog (privacy-focused)

### 10. Print Partner Setup (GotPrint)
```bash
# Contact GotPrint for API access
# Usually requires business account
# Add credentials when received:
GOTPRINT_API_KEY=
GOTPRINT_FTP_HOST=
GOTPRINT_FTP_USER=
GOTPRINT_FTP_PASSWORD=
```

## ✅ Completed Actions

- [x] Created GitHub repository
- [x] Initialized Next.js project
- [x] Set up basic project structure
- [x] Created Supabase project (partial - needs credentials)

## 📋 Quick Setup Checklist

For fastest development start:
1. [ ] Copy `.env.example` to `.env.local`
2. [ ] Add Supabase credentials
3. [ ] Run `npm run dev` and verify it works
4. [ ] Deploy to Netlify
5. [ ] Add env vars to Netlify

Everything else can wait until needed!

## 🆘 Troubleshooting

### "Invalid Supabase credentials"
- Check URL format: https://[project-ref].supabase.co
- Ensure anon key is the public one, not service key
- Try regenerating keys in Supabase dashboard

### "Build failed on Netlify"
- Check Node version is 18+ in netlify.toml
- Ensure all env variables are set in Netlify
- Check build logs for specific errors

### "Database tables not found"
- Run migration manually in Supabase SQL editor
- Check RLS policies aren't blocking access
- Verify service key is correct

## 📞 Getting Help

- **Supabase Issues:** https://supabase.com/docs
- **Netlify Issues:** https://docs.netlify.com
- **Stripe Setup:** https://stripe.com/docs/development/quickstart
- **Project Issues:** Create issue in GitHub repo

---

**Note:** Complete items in order of priority (🔴 → 🟡 → 🟢) for smoothest development flow.