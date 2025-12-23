# Cloudflare Migration - TODO

**Date:** 2025-12-23

## Work Completed Today

### Migration Preparation
- Created `wrangler.toml` configs for all 5 Netlify projects
- Converted Netlify Functions to Cloudflare Pages Functions format
- Added `_headers` and `_redirects` files for security and SPA routing
- Updated package.json files with Cloudflare scripts and dependencies

### Projects Migrated

| Project | Status | Notes |
|---------|--------|-------|
| **scout** | ✅ Ready | Builds and runs, function converted |
| **fuckyougotrain** | ✅ Ready | Builds successfully |
| **nofomo** | ✅ Ready | Fixed index.html, builds successfully |
| **_read_out_loud** | ✅ Ready | Static site, no build needed |
| **CAP** | ⚠️ Blocked | Has pre-existing TS errors (missing `@/lib/auth-context`) |

### Issues Fixed
- Removed `netlify-cli` from Scout (caused install failures)
- Fixed nofomo's `index.html` (was pre-built instead of source)
- Moved `_headers`/`_redirects` to `public/` folder for Vite projects
- Added TypeScript reference directives to Cloudflare functions

---

## PENDING: API Keys & Environment Variables

### Scout - Claude API Key
**Priority: HIGH**

Set in Cloudflare Dashboard → Workers & Pages → scout → Settings → Environment Variables:

```
CLAUDE_API_KEY = sk-ant-api03-...
```

**Where to get it:** https://console.anthropic.com/settings/keys

### CAP - Supabase Keys
**Priority: After fixing TS errors**

```
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_KEY = eyJhbGc...
```

---

## Next Steps

1. [ ] **Set CLAUDE_API_KEY** in Cloudflare for Scout project
2. [ ] **Deploy Scout** to Cloudflare Pages (`npm run deploy:cloudflare`)
3. [ ] **Test Scout** API endpoint at `https://<your-domain>/api/claude-chat`
4. [ ] **Fix CAP** TypeScript errors (missing auth-context module)
5. [ ] **Set Supabase keys** for CAP once fixed
6. [ ] **Deploy remaining projects** to Cloudflare
7. [ ] **Update DNS** if using custom domains
8. [ ] **Remove old Netlify sites** after verification

---

## Documentation

- Full migration guide: [CLOUDFLARE_MIGRATION.md](./CLOUDFLARE_MIGRATION.md)
- Deployed sites reference: [DEPLOYED_SITES.md](./DEPLOYED_SITES.md)

---

**Branch:** `claude/netlify-project-audit-Lzdgf`
