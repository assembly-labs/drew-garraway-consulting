# Netlify → Cloudflare Migration Guide

## Migration Overview

| Project | Current Host | Serverless Functions | Migration Complexity |
|---------|--------------|---------------------|----------------------|
| CAP | Netlify | 2 functions (auth) | High - Next.js + Workers |
| Scout | Netlify | 1 function (claude-chat) | Medium - Convert to Worker |
| No FOMO | Netlify | None | Low - Static only |
| Zero Chill | Netlify | None | Low - Static only |
| fuckyougotrain | Netlify | None | Low - Static only |
| _read_out_loud | Netlify | None | Low - Static only |
| Career Chat | **Cloudflare** | Worker (already done) | ✅ Already migrated |
| Accountable | **Cloudflare** | None | ✅ Already migrated |
| BJJJ | Cloudflare (planned) | None | ✅ Ready |
| Franklin Hugh Money | Cloudflare (planned) | None | ✅ Ready |
| Assembly Articles | Manual/TBD | Separate backend | Medium - Frontend only |

---

## Cloudflare Pages vs Netlify Comparison

| Feature | Netlify | Cloudflare Pages |
|---------|---------|------------------|
| Build command | `cd project && npm run build` | Same |
| Publish directory | `project/dist` | `dist` (from project root) |
| Functions | `netlify/functions/` | `functions/` or Workers |
| Environment variables | Dashboard | Dashboard or `wrangler.toml` |
| Config file | `netlify.toml` | `wrangler.toml` |
| Framework support | @netlify/plugin-nextjs | `@cloudflare/next-on-pages` |

---

## Project-Specific Migration Instructions

### 1. CAP (Championship Athletic Prospects)

**Complexity: HIGH** - Next.js requires special handling

#### Current Netlify Setup
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
```

#### Cloudflare Migration Steps

1. **Install Cloudflare adapter:**
```bash
cd CAP
npm install @cloudflare/next-on-pages
```

2. **Update `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Cloudflare Pages
  output: 'standalone',
}
module.exports = nextConfig
```

3. **Create `wrangler.toml`:**
```toml
name = "cap-trading-cards"
compatibility_date = "2024-11-01"
pages_build_output_dir = ".vercel/output/static"

[vars]
NODE_ENV = "production"

# Secrets (set via dashboard or wrangler secret put):
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_KEY
# STRIPE_SECRET_KEY
# etc.
```

4. **Convert Netlify Functions to Cloudflare Workers:**

Create `functions/api/auth-signup.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { email, password, fullName } = await context.request.json();

  if (!email || !password || !fullName) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = createClient(
    context.env.NEXT_PUBLIC_SUPABASE_URL,
    context.env.SUPABASE_SERVICE_KEY
  );

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: { full_name: fullName },
  });

  if (authError) {
    return Response.json({ error: authError.message }, { status: 500 });
  }

  if (authData.user) {
    await supabase.from('users').insert({
      id: authData.user.id,
      email: authData.user.email,
      full_name: fullName,
      age_verified: false,
    });
  }

  return Response.json({
    success: true,
    user: authData.user,
    message: 'Account created successfully',
  });
};
```

5. **Update `package.json` scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "npx @cloudflare/next-on-pages",
    "preview": "wrangler pages dev",
    "deploy": "wrangler pages deploy"
  }
}
```

6. **Cloudflare Dashboard Setup:**
   - Create new Pages project
   - Connect GitHub repository
   - Set build command: `cd CAP && npm install && npm run build`
   - Set build output: `CAP/.vercel/output/static`
   - Add all environment variables

---

### 2. Scout (AI Library Discovery)

**Complexity: MEDIUM** - Single function conversion

#### Current Netlify Function
- `netlify/functions/claude-chat.js` - Claude API proxy with caching

#### Cloudflare Migration Steps

1. **Create `wrangler.toml`:**
```toml
name = "scout-library-assistant"
compatibility_date = "2024-11-01"
pages_build_output_dir = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

2. **Create `functions/api/claude-chat.ts`:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

interface Env {
  CLAUDE_API_KEY: string;
}

// Simple in-memory cache (KV would be better for production)
const responseCache = new Map<string, { response: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  try {
    const { messages, systemPrompt } = await context.request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid request: messages array required' }, {
        status: 400, headers: corsHeaders
      });
    }

    const client = new Anthropic({ apiKey: context.env.CLAUDE_API_KEY });

    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1500,
      temperature: 0.2,
      system: systemPrompt,
      messages: messages,
    });

    const content = response.content[0]?.type === 'text' ? response.content[0].text : '';

    return Response.json({
      content,
      usage: {
        input_tokens: response.usage?.input_tokens || 0,
        output_tokens: response.usage?.output_tokens || 0,
      },
    }, { headers: corsHeaders });

  } catch (error: any) {
    return Response.json({
      error: error.message || 'An unexpected error occurred',
      fallback: true,
    }, { status: 500, headers: corsHeaders });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
};
```

3. **Update frontend API endpoint:**
```typescript
// Before (Netlify)
const API_URL = '/.netlify/functions/claude-chat';

// After (Cloudflare)
const API_URL = '/api/claude-chat';
```

4. **Update `package.json`:**
```json
{
  "scripts": {
    "dev": "vite",
    "dev:cf": "wrangler pages dev -- npm run dev",
    "build": "tsc && vite build",
    "preview": "wrangler pages dev dist",
    "deploy": "npm run build && wrangler pages deploy dist"
  }
}
```

5. **Remove Netlify dependencies:**
```bash
npm uninstall netlify-cli
rm -rf netlify/
```

---

### 3. Static Sites (No FOMO, Zero Chill, fuckyougotrain)

**Complexity: LOW** - Just change hosting

#### Create `wrangler.toml` for each:

**no-fomo/wrangler.toml:**
```toml
name = "nofomo-investment"
compatibility_date = "2024-11-01"
pages_build_output_dir = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"
```

**zero-chill-tracker/wrangler.toml:**
```toml
name = "zero-chill-tracker"
compatibility_date = "2024-11-01"
pages_build_output_dir = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"

# PWA service worker
[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache"
```

**fuckyougotrain/wrangler.toml:**
```toml
name = "fuckyougotrain"
compatibility_date = "2024-11-01"
pages_build_output_dir = "dist"
```

#### Cloudflare Dashboard Setup (for each):
1. Create new Pages project
2. Connect GitHub repository
3. Set root directory: `<project-folder>`
4. Build command: `npm install && npm run build`
5. Build output: `dist`
6. Deploy

---

### 4. Franklin Hugh Money (Static HTML)

**Complexity: LOW** - Already planned for Cloudflare

```toml
# wrangler.toml
name = "franklin-hugh-money"
compatibility_date = "2024-11-01"
pages_build_output_dir = "public"

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

No build step needed - just deploy `public/` directory.

---

## Environment Variables Migration

### Netlify → Cloudflare Secret Mapping

| Project | Netlify Variable | Cloudflare Secret |
|---------|------------------|-------------------|
| CAP | `NEXT_PUBLIC_SUPABASE_URL` | Same (set in dashboard) |
| CAP | `SUPABASE_SERVICE_KEY` | `wrangler secret put SUPABASE_SERVICE_KEY` |
| CAP | `STRIPE_SECRET_KEY` | `wrangler secret put STRIPE_SECRET_KEY` |
| Scout | `CLAUDE_API_KEY` | `wrangler secret put CLAUDE_API_KEY` |
| No FOMO | `VITE_POLYGON_API_KEY` | Same (public, in wrangler.toml) |

### Setting Secrets via CLI
```bash
# For each project
cd <project>
wrangler secret put SECRET_NAME
# Enter secret value when prompted
```

### Setting Secrets via Dashboard
1. Go to Cloudflare Dashboard → Pages → Project → Settings
2. Navigate to Environment Variables
3. Add Production/Preview secrets

---

## Monorepo Deployment Strategy

### Option A: Separate Pages Projects (Recommended)
Each project is a separate Cloudflare Pages project, similar to current Netlify setup.

**Pros:**
- Independent deployments
- Isolated environment variables
- Clear separation of concerns

**Setup per project:**
```bash
# In Cloudflare Dashboard
Project name: <project-name>
Build command: cd <project-folder> && npm install && npm run build
Build output: <project-folder>/dist
Root directory: /
```

### Option B: Monorepo with Turborepo
Use Turborepo for build orchestration, single Pages project with routing.

**Not recommended** for this portfolio - projects are too different.

---

## Local Development After Migration

### Before (Netlify)
```bash
netlify dev  # Runs functions locally
```

### After (Cloudflare)
```bash
wrangler pages dev dist  # Static + functions
wrangler pages dev -- npm run dev  # With Vite HMR
```

### Update package.json scripts
```json
{
  "scripts": {
    "dev": "vite",
    "dev:local": "wrangler pages dev -- npm run dev",
    "build": "tsc && vite build",
    "preview": "wrangler pages dev dist",
    "deploy": "wrangler pages deploy dist",
    "deploy:production": "wrangler pages deploy dist --branch main"
  }
}
```

---

## Migration Checklist

### Per-Project Checklist

- [ ] Create `wrangler.toml`
- [ ] Convert Netlify Functions to `functions/` directory (if any)
- [ ] Update API endpoint paths in frontend code
- [ ] Remove `netlify.toml` (if exists)
- [ ] Remove `netlify-cli` from devDependencies
- [ ] Update `package.json` scripts
- [ ] Test locally with `wrangler pages dev`
- [ ] Create Cloudflare Pages project in dashboard
- [ ] Configure build settings
- [ ] Add environment variables/secrets
- [ ] Deploy and verify
- [ ] Update DNS (if custom domain)
- [ ] Delete Netlify site

### Repository Cleanup

```bash
# After all projects migrated
rm -rf .github/NETLIFY_MONOREPO_WORKFLOW.md
rm -rf .github/DEPLOYMENT_GUIDE.md
rm -rf .github/QUICK_DEPLOY_CARDS.md
rm scripts/pre-deploy-check.sh  # Or update for Cloudflare

# Update .gitignore
echo ".wrangler" >> .gitignore
```

---

## Cost Comparison

| Feature | Netlify Free | Cloudflare Free |
|---------|--------------|-----------------|
| Bandwidth | 100GB/month | Unlimited |
| Build minutes | 300/month | 500/month |
| Serverless invocations | 125k/month | 100k/day |
| Sites | Unlimited | Unlimited |
| Custom domains | Yes | Yes |

**Cloudflare advantages:**
- Unlimited bandwidth
- Faster global edge network
- Better DDoS protection
- Integrated Workers/KV/R2

---

## Rollback Plan

If issues arise during migration:

1. Keep Netlify sites active until Cloudflare verified
2. Use Cloudflare preview URLs for testing
3. Only update DNS after full verification
4. Netlify sites can remain as backup for 30 days

---

## Timeline Recommendation

| Week | Tasks |
|------|-------|
| 1 | Migrate static sites (No FOMO, Zero Chill, fuckyougotrain) |
| 2 | Migrate Scout (convert Netlify Function) |
| 3 | Migrate CAP (Next.js + Workers) |
| 4 | Cleanup and documentation |

---

## Support Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Pages Functions](https://developers.cloudflare.com/pages/functions/)
