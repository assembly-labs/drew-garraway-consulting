# 🚀 Deployment Guide - Monorepo Setup

## Overview

This repository is a **monorepo** containing multiple prototypes. Each prototype:
- Lives in its own subdirectory
- Has its own Netlify site
- Deploys independently when changes are pushed to GitHub

## 📂 Project Structure

```
drew-garraway-consulting/
├── librarian-llm/           → Librarian LLM app
├── fuckyougotrain/          → Fuck You Go Train app
├── nofomo/                  → NoFomo app
├── assembly-agentic-articles/ → Assembly Articles app
├── gym/prototype/           → Gym Prototype app
├── scripts/                 → Deployment automation scripts
└── .github/                 → Documentation
```

## 🌐 Sites & Domains

| Prototype | Directory | Netlify Site | Custom Domain |
|-----------|-----------|--------------|---------------|
| **Librarian LLM** | `librarian-llm/` | https://librarian-llm.netlify.app | librarian.drewgarraway.com |
| **Fuck You Go Train** | `fuckyougotrain/` | https://fuckyougotrain.netlify.app | fuckyougotrain.netlify.app |
| **NoFomo** | `nofomo/` | [Add URL here] | nofomo.drewgarraway.com |
| **Assembly Articles** | `assembly-agentic-articles/frontend/` | [Add URL here] | assembly.drewgarraway.com |
| **Gym Prototype** | `gym/prototype/` | [Add URL here] | gym.drewgarraway.com |

## 🛠️ How Deployment Works

### Netlify Monorepo Configuration

Each Netlify site is configured with:

1. **Same GitHub repository**: `assembly-labs/drew-garraway-consulting`
2. **Different base directory**: Points to specific prototype folder
3. **Independent build settings**: Each site builds only its subdirectory
4. **Separate environment variables**: API keys isolated per site

### What Happens When You Push?

```bash
git push origin main
```

**Netlify behavior:**
- Detects changes in the repository
- Each site checks if files in ITS base directory changed
- Only sites with changes rebuild and redeploy
- Other sites remain unchanged

**Example:**
- You edit `librarian-llm/src/App.tsx`
- Push to GitHub
- Only **Librarian LLM site** rebuilds
- Other 4 sites: No deployment triggered ✅

## 📋 Deployment Checklist

### Before Deploying

- [ ] Changes are in the correct prototype directory
- [ ] Tested locally: `npm run dev`
- [ ] Build succeeds: `npm run build`
- [ ] No secrets in code (check for API keys, .env files)
- [ ] node_modules NOT included in commit
- [ ] Commit message clearly states which prototype

### Deployment Steps

```bash
# 1. Navigate to project root
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting

# 2. Check what changed
git status

# 3. Add changes (ONLY the prototype you're working on)
git add librarian-llm/

# 4. Commit with clear message
git commit -m "Update Librarian LLM: Add new feature"

# 5. Push to trigger deployment
git push origin main

# 6. Monitor deployment
# Go to Netlify dashboard and watch the build
```

## 🚨 Common Issues & Solutions

### Issue 1: Wrong Site Deploys

**Problem:** You update Prototype A, but Prototype B deploys instead.

**Cause:** Incorrect base directory in Netlify site settings.

**Solution:**
1. Go to Netlify site → Site configuration → Build & deploy
2. Verify **Base directory** matches prototype folder
3. Trigger manual redeploy

---

### Issue 2: Build Fails - "Cannot find module"

**Problem:** Build fails with missing dependencies.

**Cause:** `package.json` not in base directory, or dependencies not installed.

**Solution:**
1. Ensure `package.json` exists in prototype folder
2. In Netlify, check **Build command** is: `npm install && npm run build`
3. Or set build command to: `npm ci && npm run build` (faster, uses lockfile)

---

### Issue 3: Environment Variables Not Working

**Problem:** API calls fail, app can't access `process.env.VITE_API_KEY`

**Cause:** Environment variables not set in Netlify site.

**Solution:**
1. Go to Netlify site → Site configuration → Environment variables
2. Add variables (e.g., `VITE_ANTHROPIC_API_KEY`)
3. Redeploy site
4. **For Vite apps:** Variables MUST start with `VITE_`

---

### Issue 4: Multiple Sites Deploy at Once

**Problem:** All sites redeploy even though you only changed one.

**Cause:** Changes in root directory files (like root `netlify.toml`)

**Solution:**
1. Avoid editing root-level config files
2. Keep configurations in prototype subdirectories
3. If needed, use `.gitignore` to prevent committing shared files

---

## 🧪 Testing Before Deploy

### Local Testing

```bash
# Navigate to prototype
cd librarian-llm

# Install dependencies
npm install

# Run development server
npm run dev

# Test build process
npm run build

# Preview production build
npm run preview
```

### Pre-Deploy Validation Script

Run the automated checker:

```bash
bash scripts/pre-deploy-check.sh
```

This will:
- ✅ Verify which files changed
- ✅ Check you're not committing node_modules
- ✅ Ensure no .env files included
- ✅ Test that build succeeds
- ✅ Confirm you're ready to push

---

## 📦 Adding a New Prototype

### Step 1: Create Project Structure

```bash
# Create new directory
mkdir my-new-prototype
cd my-new-prototype

# Initialize project (example with Vite + React)
npm create vite@latest . -- --template react-ts
npm install

# Test it works
npm run dev
```

### Step 2: Create Netlify Configuration

Create `my-new-prototype/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 3: Configure Netlify Site

1. Go to Netlify → **Add new site** → **Import existing project**
2. Connect to `drew-garraway-consulting` repo
3. Configure:
   ```
   Base directory: my-new-prototype
   Build command: npm run build
   Publish directory: my-new-prototype/dist
   ```
4. Add environment variables
5. Deploy!

### Step 4: Set Up Custom Domain

1. In Bluehost DNS, add CNAME:
   ```
   Host: mynewapp
   Points to: [netlify-site-url].netlify.app
   ```
2. In Netlify, add custom domain: `mynewapp.drewgarraway.com`
3. Enable HTTPS

---

## 🔒 Security Best Practices

### API Keys

- ❌ **NEVER** commit `.env` files
- ❌ **NEVER** hardcode API keys in source code
- ✅ **ALWAYS** use Netlify environment variables
- ✅ For frontend apps, prefix with `VITE_`, `REACT_APP_`, etc.

### .gitignore Rules

Ensure these are in `.gitignore`:

```
node_modules/
.env
.env.local
.env.*.local
dist/
build/
.DS_Store
```

---

## 🆘 Getting Help

### Check Deployment Status

- **Netlify Dashboard**: See build logs, errors
- **GitHub Actions**: Check if CI/CD is configured
- **Browser DevTools**: Check console for frontend errors

### Debugging Build Failures

1. Look at Netlify build log
2. Find the first error message
3. Common fixes:
   - Missing dependency: Add to `package.json`
   - Wrong Node version: Set in `netlify.toml`
   - Path issues: Use relative paths, not absolute

### Rollback a Deployment

1. Go to Netlify site → **Deploys**
2. Find previous successful deploy
3. Click **...** → **Publish deploy**

---

## 📚 Additional Resources

- [Netlify Monorepo Guide](https://docs.netlify.com/configure-builds/monorepos/)
- [Vite Deployment Docs](https://vitejs.dev/guide/static-deploy.html#netlify)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/#netlify)

---

**Last Updated:** 2025-10-16
**Maintained By:** Drew Garraway
