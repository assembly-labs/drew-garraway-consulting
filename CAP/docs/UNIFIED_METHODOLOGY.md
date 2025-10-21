# CAP Platform - Unified Development Methodology
**Last Updated:** 2024-10-20
**Purpose:** Single source of truth for development patterns and workflows

## 🎯 Core Principles

### 1. Build on Existing Foundation
- **Database:** Already created in `/supabase/migrations/001_initial_schema.sql`
- **Configuration:** Use existing `lib/cap-config.ts` for all constants
- **Environment:** Follow `.env.example` structure exactly
- **Netlify:** Extend existing `netlify.toml` configuration

### 2. File Organization Pattern (Established)

```
/CAP
├── app/                     # Next.js 14 App Router pages
├── components/
│   ├── ui/                 # Shadcn/ui base components (Button, Card, etc.)
│   ├── features/           # Feature-specific components
│   └── shared/             # Shared components (CAPLogo, etc.)
├── lib/
│   ├── supabase/          # Supabase client and utilities
│   ├── auth/              # Auth utilities
│   └── cap-config.ts      # Central configuration
├── netlify/
│   └── functions/         # Serverless functions (*.ts)
├── supabase/
│   └── migrations/        # Database migrations
├── styles/                # CSS and design system
└── docs/                  # Documentation
```

## 📋 Existing Patterns to Follow

### Database Tables (Already Defined)
```sql
- users (extends auth.users)
- teams
- children (athletes)
- photos
- card_designs
- orders
- consent_log
```

### Netlify Functions Pattern
All functions follow this structure (from existing auth-signup.ts):
```typescript
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const handler: Handler = async (event, context) => {
  // 1. Method check
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // 2. Parse body
  const { param1, param2 } = JSON.parse(event.body || '{}');

  // 3. Validation
  if (!param1) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required field' }) };
  }

  // 4. Supabase operation
  const supabase = createClient(/*...*/);
  const { data, error } = await supabase.from('table').insert({/*...*/});

  // 5. Return response
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, data }),
  };
};
```

### Component Pattern (Established)
Using shadcn/ui pattern with CVA:
```typescript
// UI components use CVA for variants (see button.tsx, card.tsx)
// Feature components use standard React patterns
// All components use TypeScript
```

### Styling Approach
1. **Design System:** Variables in `/styles/design-system.css`
2. **Tailwind:** Configuration in `tailwind.config.ts`
3. **Component styles:** Using CVA for variants
4. **Global styles:** In `app/globals.css`

## 🔄 Workflow Rules

### 1. Adding New Features
- ✅ Check if database table exists in migrations
- ✅ Use existing config from `lib/cap-config.ts`
- ✅ Follow existing Netlify function pattern
- ✅ Use existing UI components where possible
- ✅ Add new routes under appropriate app directory

### 2. Environment Variables
- ✅ Add to `.env.example` first
- ✅ Document in `USER_ACTION_ITEMS.md`
- ✅ Never commit actual values
- ✅ Use NEXT_PUBLIC_ prefix for client-side vars

### 3. API Integration Pattern
```typescript
// All external APIs through Netlify Functions
// Never expose API keys to client
// Use environment variables
// Handle errors consistently
```

### 4. Authentication Flow (Existing)
1. Supabase Auth for user management
2. Age verification through `auth-verify-age.ts`
3. Role stored in users table
4. Session managed by Supabase

## 🚫 Avoid These Conflicts

### Database
- ❌ Don't create new migration files - update existing
- ❌ Don't change existing table structures
- ❌ Don't bypass RLS policies

### Configuration
- ❌ Don't create new config files - use `cap-config.ts`
- ❌ Don't hardcode values - use environment variables
- ❌ Don't duplicate color/brand definitions

### Components
- ❌ Don't create new button/card variants - use existing
- ❌ Don't bypass design system - use CSS variables
- ❌ Don't create duplicate shared components

### Netlify
- ❌ Don't modify netlify.toml build commands
- ❌ Don't change function directory structure
- ❌ Don't use different function patterns

## ✅ Safe to Add

### New Pages (app directory)
- `/app/team/*` - Team management pages
- `/app/checkout/*` - Payment flow
- `/app/order/*` - Order management

### New Components (components/features)
- Team management components
- Photo upload components
- Card designer components
- Checkout components

### New Functions (netlify/functions)
- `teams-*.ts` - Team operations
- `photos-*.ts` - Photo operations
- `generate-bio.ts` - Claude integration
- `create-checkout.ts` - Stripe integration

### New Documentation (docs)
- Progress tracking documents
- User action items
- Testing checklists

## 📝 Documentation Standards

### File Naming
- Markdown files: UPPERCASE_WITH_UNDERSCORES.md
- Code files: camelCase.ts or kebab-case.tsx
- Components: PascalCase.tsx

### Documentation Headers
```markdown
# Document Title
**Last Updated:** YYYY-MM-DD
**Status:** Active/Draft/Archived
**Owner:** Development/User/Business
```

### Progress Tracking Format
```markdown
- [ ] Not Started
- [🔄] In Progress (with percentage)
- [✅] Complete
- [🚧] Blocked (with reason)
```

## 🎯 Current Development Phase

**Phase:** MVP Development
**Sprint:** Foundation & Setup
**Priority:** Get core user flow working

### Completed
- ✅ Database schema
- ✅ Basic authentication
- ✅ Design system
- ✅ Netlify configuration

### In Progress
- 🔄 Multi-step signup
- 🔄 Dashboard components
- 🔄 Documentation

### Next Up
1. Team management
2. Photo upload
3. Card designer
4. Checkout flow

## 🔗 Related Documents

- Technical Spec: `/docs/CAP_MASTER_GUIDE.md`
- Getting Started: `/docs/GETTING_STARTED.md`
- UX Spec: `/_ux/cap-ux-implementation-spec.md`
- Design System: `/_ux/cap-design-system.md`
- Progress Tracker: `/docs/CAP_DEVELOPMENT_TRACKER.md`
- User Actions: `/docs/USER_ACTION_ITEMS.md`

---

**This methodology ensures all development follows the same patterns and builds on existing work without conflicts.**