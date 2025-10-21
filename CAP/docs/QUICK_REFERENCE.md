# CAP Platform - Quick Reference Guide
**Last Updated:** 2024-10-20
**Version:** 1.0.0 MVP Development

## 🚀 Quick Start Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build           # Build for production
npm run type-check      # Check TypeScript
npm run lint            # Run ESLint

# Netlify
netlify dev             # Test functions locally
netlify deploy          # Deploy preview
netlify deploy --prod   # Deploy to production

# Database
npx supabase db push    # Push migrations
npx supabase db reset   # Reset database
```

## 📁 Key Files & Locations

### Configuration
- **Environment:** `.env.local` (copy from `.env.example`)
- **CAP Config:** `/lib/cap-config.ts` (all constants)
- **Netlify:** `/netlify.toml` (deployment settings)
- **Database:** `/supabase/migrations/001_initial_schema.sql`

### Documentation
- **Methodology:** `/docs/UNIFIED_METHODOLOGY.md` (how we build)
- **Progress:** `/docs/CAP_DEVELOPMENT_TRACKER.md` (what's done)
- **Your Tasks:** `/docs/USER_ACTION_ITEMS.md` (what you need to do)
- **Components:** `/docs/COMPONENT_STATUS.md` (component list)
- **APIs:** `/docs/API_INTEGRATION_STATUS.md` (service status)
- **Session Log:** `/docs/DEVELOPMENT_LOG.md` (work history)

### Key Pages
- **Home:** http://localhost:3000/
- **Login:** http://localhost:3000/login
- **Signup:** http://localhost:3000/signup
- **Dashboard:** http://localhost:3000/dashboard
- **Design System:** http://localhost:3000/design-system

## 🎨 Design System

### Colors
```css
Gold: #FFD700       /* Primary - CTAs, highlights */
Navy: #0A1F44       /* Text, headings */
Navy Light: #3D5A80 /* Borders, secondary */
Red: #DC143C        /* Accent, alerts */
Green: #059669      /* Success states */
```

### Fonts
- **Display:** Bebas Neue (headlines)
- **Body:** Inter (UI text)
- **Mono:** Roboto Mono (numbers)
- **Accent:** Graduate (badges)

### Component Usage
```tsx
// Buttons
<Button variant="primary">Gold CTA</Button>
<Button variant="secondary">Navy Button</Button>
<Button variant="ghost">Outline</Button>

// Typography
<Display>Big Headlines</Display>
<H2>Section Headers</H2>
<Body>Paragraph text</Body>
<Stat>123</Stat>
<Badge>CHAMPION</Badge>

// Cards
<Card variant="default">Standard</Card>
<Card variant="premium">Gold border</Card>
<Card variant="dark">Navy background</Card>
```

## 🗄️ Database Tables

```sql
users         -- Parent/coach accounts (18+)
teams         -- Teams owned by users
children      -- Players (minimal data, COPPA)
photos        -- Uploaded photos (auto-delete 30 days)
card_designs  -- Saved card designs
orders        -- Purchase records
consent_log   -- Privacy consent tracking
```

## 🔧 Netlify Functions

### Existing
- `auth-signup.ts` - User registration
- `auth-verify-age.ts` - Age check

### To Create
- `teams-create.ts` - New team
- `players-add.ts` - Add to roster
- `photos-upload.ts` - Upload photos
- `generate-bio.ts` - Claude AI
- `create-checkout.ts` - Stripe

## 🧪 Test Accounts

```javascript
// Parent Account
email: parent@test.com
password: Test123!

// Coach Account
email: coach@test.com
password: Test123!
```

## 🚨 Common Issues & Fixes

### "Cannot find module '@/components/...'"
```bash
# Check tsconfig.json paths
# Restart dev server
npm run dev
```

### "Supabase connection failed"
```bash
# Check .env.local has correct values
# Verify in Supabase dashboard
# Test with: npx supabase status
```

### "Build failed on Netlify"
```bash
# Check Node version is 18+
# Ensure all env vars are in Netlify
# Check build logs for specific error
```

### "Hydration error"
```bash
# Usually from date/time mismatch
# Check for client-only code
# Wrap with useEffect or dynamic import
```

## 📞 Important Links

### Development
- **Repo:** https://github.com/drew-garraway-consulting/CAP
- **Local:** http://localhost:3000
- **Netlify:** [Your Site].netlify.app

### Services
- **Supabase:** https://app.supabase.com
- **Netlify:** https://app.netlify.com
- **Stripe:** https://dashboard.stripe.com
- **Claude:** https://console.anthropic.com

### Documentation
- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **Tailwind:** https://tailwindcss.com/docs
- **Shadcn/ui:** https://ui.shadcn.com

## 🎯 Current Sprint Goals

1. ✅ Set up tracking system
2. 🔄 Get environment variables configured
3. 🔄 Deploy to Netlify
4. ⏳ Complete multi-step signup
5. ⏳ Build team management

## 💡 Pro Tips

1. **Always check existing code first** - Pattern likely exists
2. **Use cap-config.ts** - Don't hardcode values
3. **Follow function pattern** - See auth-signup.ts
4. **Test locally first** - Use `netlify dev`
5. **Check docs folder** - Answer probably there

## 🚦 Status Colors

- ✅ Complete
- 🔄 In Progress
- ⏳ Not Started
- 🚧 Blocked
- 🔴 Critical
- 🟡 Important
- 🟢 Nice to Have

---

**For detailed information, check the specific documentation in `/docs/`**