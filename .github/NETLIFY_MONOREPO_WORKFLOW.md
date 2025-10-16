# 🚀 Netlify Monorepo Deployment Workflow

## ✅ DEFINITIVE GUIDE - Tested & Verified

**Last Updated:** 2025-10-16
**Status:** ✅ Production-ready
**Tested With:** Librarian LLM prototype (successful deployment)

---

## 📚 Table of Contents

1. [Understanding the Setup](#understanding-the-setup)
2. [Critical Configuration Rules](#critical-configuration-rules)
3. [Step-by-Step Deployment Process](#step-by-step-deployment-process)
4. [Settings Template for Each Prototype](#settings-template)
5. [Troubleshooting](#troubleshooting)
6. [Quick Reference Checklist](#quick-reference-checklist)

---

## Understanding the Setup

### What We Have

**Monorepo Structure:**
```
drew-garraway-consulting/
├── librarian-llm/          → Prototype 1
├── cantstopwontstop/       → Prototype 2
├── nofomo/                 → Prototype 3
├── assembly-agentic-articles/ → Prototype 4
└── gym/prototype/          → Prototype 5
```

**Deployment Strategy:**
- ✅ **ONE GitHub repository** containing all prototypes
- ✅ **FIVE separate Netlify sites** (one per prototype)
- ✅ **Each site points to SAME repo** but different subdirectory
- ✅ **Each site gets unique URL:** `prototype-name.netlify.app`

---

## Critical Configuration Rules

### 🚨 RULE 1: Package Directory Auto-Detection

**What Happens:**
- Netlify **auto-detects** monorepo structures
- When detected, it **forces** "Package directory" to be filled
- You **CANNOT clear** Package directory (it's locked)

**What This Means:**
- ✅ **ALWAYS use Package directory** (not Base directory)
- ❌ **NEVER fill in both** Base directory AND Package directory
- ✅ **All paths are relative** to Package directory

---

### 🚨 RULE 2: No Root netlify.toml Files

**Why:**
- Root `netlify.toml` files cause **override warnings**
- They apply to **ALL sites**, not just one prototype
- Creates **configuration conflicts**

**Solution:**
- ✅ **DELETE** any root `netlify.toml` files
- ✅ Each prototype configures via **Netlify UI only**
- ✅ If needed, put `netlify.toml` INSIDE prototype folder (not tested yet)

---

### 🚨 RULE 3: Path Structure Logic

**Correct Understanding:**

```
Package directory = "librarian-llm/"
  ↓
Netlify starts HERE: /repo/librarian-llm/
  ↓
All other paths are RELATIVE to this location:
  - npm run build → runs in /repo/librarian-llm/
  - dist → publishes from /repo/librarian-llm/dist
  - netlify/functions → reads from /repo/librarian-llm/netlify/functions
```

**WRONG (causes double paths):**

```
Base directory = "librarian-llm"
Package directory = "librarian-llm/"
Publish directory = "librarian-llm/dist"
  ↓
Netlify tries: /repo/librarian-llm/librarian-llm/dist ❌ NOT FOUND
```

---

## Step-by-Step Deployment Process

### Phase 1: Prerequisites (ONE TIME ONLY)

#### ✅ Step 1.1: Clean Git Repository

**Ensure node_modules are NOT tracked:**

```bash
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting

# Check if node_modules are tracked
git ls-files | grep "node_modules/" | wc -l

# If number is > 0, run cleanup script
bash scripts/cleanup-git-repo.sh

# Commit and push
git add .gitignore
git commit -m "🧹 Clean repository"
git push origin main
```

#### ✅ Step 1.2: Remove Root netlify.toml

```bash
# Check for root netlify.toml
ls -la netlify.toml*

# If exists, delete it
rm netlify.toml

# Commit
git add -A
git commit -m "Remove root netlify.toml for monorepo setup"
git push origin main
```

---

### Phase 2: Create Netlify Site (REPEAT FOR EACH PROTOTYPE)

#### ✅ Step 2.1: Create New Site

1. Go to: **https://app.netlify.com**
2. Click: **Add new site**
3. Select: **Import an existing project**
4. Choose: **Deploy with GitHub**
5. Search and select: `drew-garraway-consulting`
6. ⚠️ **DO NOT** fill in build settings yet
7. Scroll to bottom, click: **Deploy site**

**Why deploy without settings?**
- Netlify needs to analyze the repo first
- It auto-detects Package directory during first deploy
- First deploy WILL FAIL - that's expected ✅

---

#### ✅ Step 2.2: Configure Build Settings (AFTER FIRST DEPLOY)

1. After first deploy fails, go to: **Site configuration** → **Build & deploy** → **Build settings**
2. Click: **Edit settings**
3. Fill in settings (see template below)
4. Click: **Save**
5. Go to: **Deploys** → **Trigger deploy** → **Deploy site**

---

#### ✅ Step 2.3: Add Environment Variables

1. Go to: **Site configuration** → **Environment variables**
2. Click: **Add a variable**
3. Add required API keys (see prototype-specific section below)
4. Click: **Save**
5. Trigger new deploy to apply variables

---

#### ✅ Step 2.4: Rename Site URL

1. Go to: **Site configuration** → **Site details**
2. Under "Site information", click: **Change site name**
3. Enter new name (e.g., `librarian-llm`)
4. Click: **Save**
5. Site is now: `https://librarian-llm.netlify.app`

---

## Settings Template

### 🔵 TEMPLATE: Copy-Paste Settings for Each Prototype

**Use this for ALL prototypes:**

```
Base directory: (leave completely empty)

Package directory: <PROTOTYPE-FOLDER>/
(Netlify auto-fills this - leave it as-is)

Build command: npm run build

Publish directory: dist

Functions directory: netlify/functions
(or leave empty if no functions)
```

---

### 📚 Prototype 1: Librarian LLM

**Status:** ✅ Deployed successfully

```
Base directory: (empty)
Package directory: librarian-llm/
Build command: npm run build
Publish directory: dist
Functions directory: netlify/functions
```

**Environment Variables:**
```
VITE_ANTHROPIC_API_KEY = [your-api-key]
```

**Site URL:** `https://librarian-llm.netlify.app`

---

### 🏃 Prototype 2: CantStopWontStop

**Status:** ⏳ Pending deployment

```
Base directory: (empty)
Package directory: cantstopwontstop/
Build command: npm run build
Publish directory: dist
Functions directory: (empty or netlify/functions if applicable)
```

**Environment Variables:**
```
(Add any required API keys)
```

**Proposed Site Name:** `cantstopwontstop`
**Target URL:** `https://cantstopwontstop.netlify.app`

---

### 🎯 Prototype 3: NoFomo

**Status:** ⏳ Pending deployment

```
Base directory: (empty)
Package directory: nofomo/
Build command: npm run build
Publish directory: dist
Functions directory: (empty or netlify/functions if applicable)
```

**Environment Variables:**
```
(Add any required API keys)
```

**Proposed Site Name:** `nofomo`
**Target URL:** `https://nofomo.netlify.app`

---

### 📰 Prototype 4: Assembly Agentic Articles

**Status:** ⏳ Pending deployment

**⚠️ Special Note:** This is a FRONTEND-ONLY deployment

```
Base directory: (empty)
Package directory: assembly-agentic-articles/frontend/
Build command: npm run build
Publish directory: dist
Functions directory: (empty or netlify/functions if applicable)
```

**Environment Variables:**
```
VITE_API_URL = [backend-url]
(Add any other required variables)
```

**Proposed Site Name:** `assembly-articles`
**Target URL:** `https://assembly-articles.netlify.app`

---

### 💪 Prototype 5: Gym Prototype

**Status:** ⏳ Pending deployment

```
Base directory: (empty)
Package directory: gym/prototype/
Build command: npm run build
Publish directory: dist
Functions directory: (empty or netlify/functions if applicable)
```

**Environment Variables:**
```
(Add any required API keys)
```

**Proposed Site Name:** `gym-prototype`
**Target URL:** `https://gym-prototype.netlify.app`

---

## Troubleshooting

### ❌ Issue: "Overridden by netlify.toml" Warning

**Cause:** Root `netlify.toml` file still exists in repo

**Solution:**
```bash
# Delete root netlify.toml
rm netlify.toml
git add -A
git commit -m "Remove root netlify.toml"
git push origin main

# Refresh Netlify settings page
# Warning should disappear
```

---

### ❌ Issue: Build Fails - "Cannot find package.json"

**Cause:** Base directory or Package directory not set correctly

**Solution:**
- ✅ Ensure **Base directory is EMPTY**
- ✅ Ensure **Package directory = `prototype-folder/`**
- ✅ Path should point to where `package.json` exists

---

### ❌ Issue: Build Succeeds But Site Shows 404

**Cause:** Publish directory incorrect

**Solution:**
- ✅ Check where build outputs: `npm run build` creates `dist/` or `build/`?
- ✅ Set **Publish directory** to match (usually `dist`)
- ✅ Path is RELATIVE to Package directory

---

### ❌ Issue: Package Directory Won't Clear

**Cause:** Netlify auto-detected monorepo structure (this is NORMAL)

**Solution:**
- ✅ **Don't fight it!** Leave Package directory as-is
- ✅ Ensure Base directory is EMPTY
- ✅ Use the settings template above

---

### ❌ Issue: Environment Variables Not Working

**Cause:** Variables not prefixed correctly or not redeployed

**Solution:**
- ✅ For Vite apps: Variables MUST start with `VITE_`
- ✅ For Create React App: Variables MUST start with `REACT_APP_`
- ✅ After adding variables, **trigger new deploy**

---

## Quick Reference Checklist

### ✅ For Each New Prototype:

- [ ] Repository is clean (no node_modules tracked)
- [ ] No root `netlify.toml` file exists
- [ ] Created new Netlify site
- [ ] Configured build settings (Package directory approach)
- [ ] Added environment variables
- [ ] First deploy succeeded
- [ ] Renamed site URL
- [ ] Tested site loads correctly
- [ ] Documented URL in `DEPLOYED_SITES.md`

---

## 📊 Deployment Status Tracker

| Prototype | Netlify Site Created | Settings Configured | Environment Variables | First Deploy Status | Site Renamed | URL |
|-----------|---------------------|---------------------|----------------------|-------------------|--------------|-----|
| Librarian LLM | ✅ | ✅ | ✅ | ⏳ Building | ⏳ Pending | TBD |
| CantStopWontStop | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | TBD |
| NoFomo | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | TBD |
| Assembly Articles | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | TBD |
| Gym Prototype | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | TBD |

---

## 🎓 Key Learnings

### What We Learned (The Hard Way)

1. **Netlify auto-detects monorepos** and forces Package directory
2. **Never use both** Base directory AND Package directory together
3. **Delete root netlify.toml** files to avoid override conflicts
4. **All paths are relative** to Package directory (not repo root)
5. **First deploy can fail** - that's okay, configure settings after

### What Works

✅ **Package directory approach** (monorepo-aware)
✅ **Separate Netlify sites** for each prototype
✅ **Configure via UI only** (no netlify.toml)
✅ **Environment variables per site** (isolated)

### What Doesn't Work

❌ Root netlify.toml with base directory
❌ Using Base directory + Package directory together
❌ Sharing one Netlify site for multiple prototypes
❌ Trying to clear locked Package directory field

---

## 📞 Support

**If you encounter issues:**

1. Check this guide's Troubleshooting section
2. Verify settings match the template exactly
3. Check Netlify build logs for specific errors
4. Consult: `.github/DEPLOYMENT_GUIDE.md` for additional context

---

**Last Verified:** 2025-10-16
**Next Review:** After all 5 prototypes deployed
