# 📇 Quick Deploy Reference Cards

**✅ UPDATED with PROVEN WORKING SETTINGS (Tested: Librarian LLM SUCCESS)**

**Use these exact settings when deploying each prototype to Netlify**

---

## 📚 PROTOTYPE 1: Librarian LLM

### Netlify Build Settings
```
Base directory: (empty)
Package directory: (empty/locked - doesn't matter)
Build command: cd librarian-llm && npm install && npm run build
Publish directory: librarian-llm/dist
Functions directory: librarian-llm/netlify/functions
```

### Environment Variables
```
VITE_ANTHROPIC_API_KEY = [your-anthropic-key]
```

### Site Name
```
librarian-llm
```

### Deployed URL
```
https://librarian-llm.netlify.app
```

**Status:** ✅ **DEPLOYED & LIVE**

---

## 🏃 PROTOTYPE 2: CantStopWontStop

### Netlify Build Settings
```
Base directory: (empty)
Package directory: (empty/locked - doesn't matter)
Build command: cd cantstopwontstop && npm install && npm run build
Publish directory: cantstopwontstop/dist
Functions directory: cantstopwontstop/netlify/functions
```

### Environment Variables
```
(Check cantstopwontstop/package.json for API usage)
(Add any required keys)
```

### Site Name
```
cantstopwontstop
```

### Expected URL
```
https://cantstopwontstop.netlify.app
```

**Status:** ⏳ Pending

---

## 🎯 PROTOTYPE 3: NoFomo

### Netlify Build Settings
```
Base directory: (empty)
Package directory: (empty/locked - doesn't matter)
Build command: cd nofomo && npm install && npm run build
Publish directory: nofomo/dist
Functions directory: nofomo/netlify/functions
```

### Environment Variables
```
(Check nofomo/package.json for API usage)
(Add any required keys)
```

### Site Name
```
nofomo
```

### Expected URL
```
https://nofomo.netlify.app
```

**Status:** ⏳ Pending

---

## 📰 PROTOTYPE 4: Assembly Agentic Articles

### Netlify Build Settings
```
Base directory: (empty)
Package directory: (empty/locked - doesn't matter)
Build command: cd assembly-agentic-articles/frontend && npm install && npm run build
Publish directory: assembly-agentic-articles/frontend/dist
Functions directory: assembly-agentic-articles/frontend/netlify/functions
```

### Environment Variables
```
VITE_API_URL = [backend-api-url]
VITE_ANTHROPIC_API_KEY = [your-anthropic-key]
(Check assembly-agentic-articles/frontend/.env.example for others)
```

### Site Name
```
assembly-articles
```

### Expected URL
```
https://assembly-articles.netlify.app
```

**Status:** ⏳ Pending

---

## 💪 PROTOTYPE 5: Gym Prototype

### Netlify Build Settings
```
Base directory: (empty)
Package directory: (empty/locked - doesn't matter)
Build command: cd gym/prototype && npm install && npm run build
Publish directory: gym/prototype/dist
Functions directory: gym/prototype/netlify/functions
```

### Environment Variables
```
(Check gym/prototype/package.json for API usage)
(Add any required keys)
```

### Site Name
```
gym-prototype
```

### Expected URL
```
https://gym-prototype.netlify.app
```

**Status:** ⏳ Ready to deploy **NEXT**

---

## 🎯 Deployment Workflow (Copy-Paste)

For each prototype, follow these steps:

### Step 1: Create Site
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import existing project"
3. Choose GitHub → Select `drew-garraway-consulting`
4. Click "Deploy site" (let first deploy fail - expected!)

### Step 2: Configure Settings
1. Go to "Site configuration" → "Build & deploy" → "Build settings"
2. Click "Edit settings"
3. **Copy settings from card above** (EXACT TEXT!)
4. Click "Save"

### Step 3: Add Environment Variables
1. Go to "Site configuration" → "Environment variables"
2. Click "Add a variable"
3. **Add each variable from card above**
4. Click "Save"

### Step 4: Deploy
1. Go to "Deploys" → "Trigger deploy" → "Deploy site"
2. Wait 2-5 minutes
3. Check build logs for success

### Step 5: Rename Site
1. Go to "Site configuration" → "Site details"
2. Click "Change site name"
3. **Enter site name from card above**
4. Click "Save"

### Step 6: Verify
1. Visit the URL from card above
2. Confirm site loads correctly
3. Test functionality

---

## ⚡ Speed Tips

**Deploy multiple prototypes faster:**

1. Open 5 browser tabs (one per prototype)
2. Create all sites in parallel (Step 1)
3. Configure all in parallel (Step 2-3)
4. Deploy all (Step 4)
5. Rename all while deployments run (Step 5)

**Estimated time:**
- Per prototype: ~10 minutes
- All 4 remaining: ~40 minutes sequential, ~20 minutes parallel

---

## 🔑 Key Learnings

### What Works (PROVEN):
✅ `cd <folder> && npm install && npm run build` pattern
✅ Full paths for Publish directory: `<folder>/dist`
✅ Full paths for Functions: `<folder>/netlify/functions`
✅ Leave Base directory EMPTY
✅ Ignore Package directory (empty or locked)

### What Doesn't Work:
❌ Using Base directory alone
❌ Using Package directory alone
❌ Relative paths when Package directory is set
❌ Expecting Package directory to change working dir

---

## 📋 Progress Tracker

**Check off as you complete:**

### Librarian LLM
- [x] Site created
- [x] Settings configured
- [x] Environment variables added
- [x] Deployed successfully
- [x] Site renamed
- [x] Verified working
- [x] URL documented

### CantStopWontStop
- [ ] Site created
- [ ] Settings configured
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Site renamed
- [ ] Verified working
- [ ] URL documented

### NoFomo
- [ ] Site created
- [ ] Settings configured
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Site renamed
- [ ] Verified working
- [ ] URL documented

### Assembly Articles
- [ ] Site created
- [ ] Settings configured
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Site renamed
- [ ] Verified working
- [ ] URL documented

### Gym Prototype
- [ ] Site created
- [ ] Settings configured
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Site renamed
- [ ] Verified working
- [ ] URL documented

---

**Last Updated:** 2025-10-16 (After successful Librarian LLM deployment)
**Pattern Status:** ✅ PROVEN & PRODUCTION-READY
