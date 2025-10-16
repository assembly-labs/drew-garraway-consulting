# 📇 Quick Deploy Reference Cards

**Use these when deploying each prototype to Netlify**

---

## 📚 PROTOTYPE 1: Librarian LLM

### Netlify Build Settings
```
Base directory: (empty)
Package directory: librarian-llm/
Build command: npm run build
Publish directory: dist
Functions directory: netlify/functions
```

### Environment Variables
```
VITE_ANTHROPIC_API_KEY = [your-anthropic-key]
```

### Site Name
```
librarian-llm
```

### Expected URL
```
https://librarian-llm.netlify.app
```

**Status:** ✅ Configured, deploying now

---

## 🏃 PROTOTYPE 2: CantStopWontStop

### Netlify Build Settings
```
Base directory: (empty)
Package directory: cantstopwontstop/
Build command: npm run build
Publish directory: dist
Functions directory: (empty)
```

### Environment Variables
```
(Add if needed - check cantstopwontstop/package.json for API usage)
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
Package directory: nofomo/
Build command: npm run build
Publish directory: dist
Functions directory: (empty)
```

### Environment Variables
```
(Add if needed - check nofomo/package.json for API usage)
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
Package directory: assembly-agentic-articles/frontend/
Build command: npm run build
Publish directory: dist
Functions directory: (empty)
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
Package directory: gym/prototype/
Build command: npm run build
Publish directory: dist
Functions directory: (empty)
```

### Environment Variables
```
(Add if needed - check gym/prototype/package.json for API usage)
```

### Site Name
```
gym-prototype
```

### Expected URL
```
https://gym-prototype.netlify.app
```

**Status:** ⏳ Pending

---

## 🎯 Deployment Workflow (Copy-Paste)

For each prototype, follow these steps:

### Step 1: Create Site
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import existing project"
3. Choose GitHub → Select `drew-garraway-consulting`
4. Click "Deploy site" (let first deploy fail)

### Step 2: Configure Settings
1. Go to "Site configuration" → "Build & deploy" → "Build settings"
2. Click "Edit settings"
3. **Copy settings from card above**
4. Click "Save"

### Step 3: Add Environment Variables
1. Go to "Site configuration" → "Environment variables"
2. Click "Add a variable"
3. **Add each variable from card above**
4. Click "Save"

### Step 4: Deploy
1. Go to "Deploys" → "Trigger deploy" → "Deploy site"
2. Wait 2-5 minutes
3. Check build logs for errors

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
2. Create all 5 sites in parallel (Step 1)
3. Configure all 5 in parallel (Step 2-3)
4. Deploy all 5 (Step 4)
5. Rename all 5 while deployments run (Step 5)

**Estimated time:**
- Sequential: ~1 hour (12 min per prototype)
- Parallel: ~20 minutes total

---

## 📋 Progress Tracker

**Check off as you complete:**

### Librarian LLM
- [x] Site created
- [x] Settings configured
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Site renamed
- [ ] Verified working
- [ ] URL documented

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

**Last Updated:** 2025-10-16
