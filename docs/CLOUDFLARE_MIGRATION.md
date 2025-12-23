# Cloudflare Pages Migration Guide

This document outlines the migration from Netlify to Cloudflare Pages for all projects in this repository.

## Migration Status

| Project | Type | Netlify Config | Cloudflare Config | Build Status |
|---------|------|----------------|-------------------|--------------|
| **CAP** | Next.js + Functions | `netlify.toml` | `wrangler.toml` + `functions/` | ⚠️ Has TS errors |
| **fuckyougotrain** | Vite SPA | `netlify.toml` | `wrangler.toml` | ✅ Builds |
| **_read_out_loud** | Static | `netlify.toml` | `wrangler.toml` | ✅ Static |
| **nofomo** | Vite SPA | (pending) | `wrangler.toml` | ✅ Builds |
| **scout** | Vite + Functions | `netlify.toml.example` | `wrangler.toml` + `functions/` | ✅ Ready |

### Known Issues

- **CAP**: Has pre-existing TypeScript errors (missing `@/lib/auth-context` module). Fix the codebase before deploying.
- **Vite projects**: `_headers` and `_redirects` files are in `public/` folder to be included in build output.

---

## Quick Start

### Prerequisites

1. Install Wrangler CLI globally (optional, npx works too):
   ```bash
   npm install -g wrangler
   ```

2. Authenticate with Cloudflare:
   ```bash
   wrangler login
   ```

### Deploy a Project

```bash
cd <project-directory>
npm install
npm run build
npm run deploy:cloudflare
```

---

## Project-Specific Instructions

### CAP (Next.js + Supabase)

**Build Command:** `npm run build:cloudflare`
**Output Directory:** `.vercel/output/static`

**Environment Variables (set in Cloudflare Dashboard):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

**Functions:**
- `/api/auth-signup` → `functions/api/auth-signup.ts`
- `/api/auth-verify-age` → `functions/api/auth-verify-age.ts`

```bash
cd CAP
npm install
npm run build:cloudflare
npm run deploy:cloudflare
```

### fuckyougotrain (Vite SPA)

**Build Command:** `npm run build`
**Output Directory:** `dist`

```bash
cd fuckyougotrain
npm install
npm run build
npm run deploy:cloudflare
```

### _read_out_loud (Static Site)

**Build Command:** None (static files)
**Output Directory:** `.` (root)

```bash
cd _read_out_loud
npx wrangler pages deploy .
```

### nofomo (Vite SPA)

**Build Command:** `npm run build`
**Output Directory:** `dist`

```bash
cd nofomo
npm install
npm run build
npm run deploy:cloudflare
```

### scout (Vite + Claude API)

**Build Command:** `npm run build`
**Output Directory:** `dist`

**Environment Variables (set in Cloudflare Dashboard):**
- `CLAUDE_API_KEY`

**Functions:**
- `/api/claude-chat` → `functions/api/claude-chat.ts`

```bash
cd scout
npm install
npm run build
npm run deploy:cloudflare
```

---

## Configuration Files

### wrangler.toml

Each project has a `wrangler.toml` file that configures:
- Project name
- Compatibility date and flags
- Output directory
- Environment variables

### _headers

Security and caching headers for static assets. Cloudflare Pages reads this file automatically.

### _redirects

URL redirects and rewrites. For SPAs, this typically contains:
```
/*    /index.html   200
```

### functions/ Directory

Cloudflare Pages Functions use a file-based routing system:
- `functions/api/hello.ts` → `/api/hello`
- `functions/api/auth/login.ts` → `/api/auth/login`

---

## Netlify to Cloudflare Mapping

| Netlify Feature | Cloudflare Equivalent |
|-----------------|----------------------|
| `netlify.toml` | `wrangler.toml` |
| `netlify/functions/` | `functions/` |
| `[[redirects]]` | `_redirects` file |
| `[[headers]]` | `_headers` file |
| Environment Variables | Cloudflare Dashboard → Settings → Variables |
| Deploy Previews | Branch Deployments |
| `@netlify/functions` handler | `PagesFunction` export |

### Function Migration

**Netlify Function:**
```typescript
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello' }),
  };
};
```

**Cloudflare Pages Function:**
```typescript
interface Env {
  MY_VAR: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  return new Response(
    JSON.stringify({ message: 'Hello' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
```

---

## Cloudflare Dashboard Setup

### Creating a New Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **Workers & Pages** → **Create application** → **Pages**
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command:** See project-specific instructions above
   - **Build output directory:** See project-specific instructions above
   - **Root directory:** The project subdirectory (e.g., `CAP`, `scout`)

### Environment Variables

1. Go to your Pages project → **Settings** → **Environment variables**
2. Add variables for both **Production** and **Preview** environments
3. Redeploy after adding variables

### Custom Domains

1. Go to your Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Follow DNS configuration instructions

---

## Local Development

### Preview with Wrangler

```bash
# Build first
npm run build

# Run local preview
npm run preview:cloudflare
```

### With Functions (Node.js compatibility)

```bash
npx wrangler pages dev dist --compatibility-flags=nodejs_compat
```

---

## Cleanup After Migration

Once Cloudflare deployment is verified, you can optionally:

1. Remove Netlify-specific files:
   - `netlify.toml`
   - `netlify/` directory

2. Remove Netlify dependencies:
   ```bash
   npm uninstall @netlify/functions netlify-cli
   ```

3. Update CI/CD pipelines to deploy to Cloudflare instead

---

## Troubleshooting

### Build Failures

- Check Node.js version compatibility (use `NODE_VERSION` in wrangler.toml)
- Ensure all dependencies are installed
- Check build logs in Cloudflare Dashboard

### Function Errors

- Verify `nodejs_compat` flag is enabled
- Check environment variables are set
- Review function logs in Cloudflare Dashboard → Functions → Logs

### SPA Routing Issues

- Ensure `_redirects` file is in the build output directory
- For Vite, copy `_redirects` to `public/` folder

---

**Last Updated:** 2025-12-23
**Maintained By:** Drew Garraway
