# ✅ HABIT TRACKER - QUICK DEPLOYMENT CHECKLIST

## 🚀 FASTEST PATH TO DEPLOY (Zero Credits)

```bash
# 1. Test
npm run preflight

# 2. Build
npm run build

# 3. Deploy (uses 0 Netlify credits)
netlify deploy --dir=dist --prod
```

---

## 📋 FULL PRE-DEPLOYMENT CHECKLIST

### **1️⃣ CODE QUALITY**
- [ ] TypeScript compiles: `npm run typecheck`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in browser

### **2️⃣ FUNCTIONALITY TEST**
- [ ] Swipe/drag to complete habits works
- [ ] Progress saves after refresh
- [ ] Calendar view works
- [ ] All 6 habits appear
- [ ] Cluster counting is correct

### **3️⃣ BROWSER TEST**
- [ ] Chrome ✓
- [ ] Firefox ✓
- [ ] Safari ✓
- [ ] Mobile browser ✓

### **4️⃣ PERFORMANCE**
- [ ] Page loads < 3 seconds
- [ ] Build size < 500KB gzipped
- [ ] Lighthouse score > 90

### **5️⃣ FINAL CHECKS**
- [ ] Run preflight: `npm run preflight`
- [ ] Test production build: `npm run serve:prod`
- [ ] Version updated in package.json
- [ ] Git committed: `git add . && git commit -m "Ready for deploy"`

---

## 🎯 DEPLOYMENT COMMANDS

### **Option A: CLI Deploy (Recommended - 0 Credits)**
```bash
npm run build
netlify deploy --dir=dist --prod
```

### **Option B: Drag & Drop (0 Credits)**
1. Run: `npm run build`
2. Open: https://app.netlify.com
3. Drag `dist` folder to browser

### **Option C: Automated (Uses Credits)**
```bash
npm run deploy:production
```

---

## 🔥 EMERGENCY ROLLBACK

### **Fastest Method:**
1. Go to https://app.netlify.com
2. Click "Deploys"
3. Find last working deploy
4. Click "..." → "Publish deploy"

### **CLI Method:**
```bash
git checkout [LAST_GOOD_COMMIT]
npm run build
netlify deploy --dir=dist --prod
```

---

## 📊 POST-DEPLOYMENT VERIFICATION

- [ ] Visit production URL
- [ ] Test habit completion
- [ ] Check data persistence
- [ ] Test on mobile device
- [ ] Monitor for 5 minutes

---

## 💡 GOLDEN RULES

1. **NEVER deploy untested code**
2. **ALWAYS run preflight first**
3. **BUILD locally to save credits**
4. **TEST on production URL after deploy**
5. **ROLLBACK immediately if issues found**

---

## 🚨 CREDIT SAVING TIPS

| Action | Credits Used | Alternative |
|--------|--------------|-------------|
| Auto-deploy from GitHub | 3 mins/deploy | Manual deploy |
| Netlify build | 3 mins | Local build |
| Preview deploys | 3 mins each | Local preview |
| Branch deploys | 3 mins each | Don't use |

**Monthly Free Tier: 300 minutes**
**Each Netlify build: ~3 minutes**
**Each local build + deploy: 0 minutes** ← USE THIS!

---

## 📝 QUICK COPY-PASTE COMMANDS

```bash
# Full safe deployment (0 credits)
npm run preflight && npm run build && netlify deploy --dir=dist --prod

# Quick deployment (0 credits, no tests)
npm run build && netlify deploy --dir=dist --prod

# Test everything locally first
npm run test:local && npm run serve:prod

# Emergency rollback
netlify deploy:restore

# Check what will be deployed
npm run deploy:dry-run
```

---

**⏱️ Time Required:**
- Local testing: 2-5 minutes
- Build: 30 seconds
- Deploy: 30 seconds
- **Total: ~5 minutes**

**💰 Cost:**
- Local testing: $0
- Local build: $0
- Deploy dist/: $0
- **Total: $0**

---

Last Updated: November 2024 | Version: 1.0.0