# 🚀 Pre-Deployment Checklist

Run through this checklist BEFORE deploying to prevent common issues.

## 📦 Local Testing Phase
- [ ] Run `npm run build` locally - does it complete without errors?
- [ ] Run `npm run dev:netlify` - does the app work locally with Netlify functions?
- [ ] Test API calls locally - do they return expected responses?
- [ ] Check browser console - any errors or warnings?

## 🔍 Configuration Verification
- [ ] API endpoint in frontend matches deployment:
  - Netlify: `/.netlify/functions/claude-chat`
  - NOT: `/api/claude-chat`
- [ ] Function uses correct ES module syntax:
  - `export async function handler()` ✅
  - NOT: `export const handler = async()` ❌
- [ ] Model name is valid:
  - `claude-3-haiku-20240307` ✅
  - Check Anthropic docs for current models
- [ ] Environment variables set in Netlify:
  - `CLAUDE_API_KEY` or `claude_api_key`

## 📁 File Structure Check
- [ ] NO active netlify.toml in root or project directory
- [ ] If netlify.toml exists, it's renamed to .backup
- [ ] package.json has `"type": "module"`
- [ ] Function file uses .js extension (not .mjs)

## 🧪 Test Commands
Run these commands before pushing:
```bash
# Build test
npm run build

# Type check
npm run lint

# Local Netlify test
npm run dev:netlify
```

## 🚢 Deployment Steps
1. [ ] All tests pass locally
2. [ ] Commit with clear message
3. [ ] Push to GitHub
4. [ ] Monitor Netlify deployment logs
5. [ ] Test live site immediately after deployment