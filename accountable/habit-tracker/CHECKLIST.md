# ✅ HABIT TRACKER - QUICK DEPLOYMENT CHECKLIST

## 🚀 FASTEST PATH TO DEPLOY (Cloudflare Pages)

```bash
# 1. Test
npm run preflight

# 2. Build
npm run build

# 3. Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=accountable-habit-tracker --branch=main

# OR simply push to GitHub (auto-deploys)
git push
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

### **Option A: Auto-Deploy via GitHub (Recommended)**
```bash
# Simply push to GitHub - Cloudflare auto-deploys
git add .
git commit -m "Your changes"
git push
```

### **Option B: Manual CLI Deploy**
```bash
npm run build
wrangler pages deploy dist --project-name=accountable-habit-tracker --branch=main
```

### **Option C: Using npm scripts**
```bash
npm run deploy:production
```

---

## 🔥 EMERGENCY ROLLBACK

### **Fastest Method:**
1. Go to https://dash.cloudflare.com
2. Navigate to Pages → Your project
3. Click "View builds"
4. Find last working deployment
5. Click "..." → "Rollback to this deployment"

### **CLI Method:**
```bash
git checkout [LAST_GOOD_COMMIT]
npm run build
wrangler pages deploy dist --project-name=accountable-habit-tracker --branch=main
```

---

## 📊 POST-DEPLOYMENT VERIFICATION

- [ ] Visit production URL: https://accountable.pages.dev
- [ ] Test habit completion
- [ ] Check data persistence
- [ ] Test on mobile device
- [ ] Monitor for 5 minutes

---

## 💡 GOLDEN RULES

1. **NEVER deploy untested code**
2. **ALWAYS run preflight first**
3. **LEVERAGE auto-deploy from GitHub**
4. **TEST on production URL after deploy**
5. **ROLLBACK immediately if issues found**

---

## 🚨 CLOUDFLARE ADVANTAGES

| Feature | Cloudflare Pages | Previous Platform |
|---------|------------------|-------------------|
| Build limit | 500/month | 300 minutes |
| Bandwidth | Unlimited | 100GB |
| Global CDN | ✅ 200+ locations | Limited |
| Auto SSL | ✅ Free | ✅ Free |
| Preview URLs | ✅ Every PR | Limited |

**Monthly Free Tier: 500 builds**
**Bandwidth: Unlimited**
**Cost: $0**

---

## 📝 QUICK COPY-PASTE COMMANDS

```bash
# Full safe deployment
npm run preflight && npm run build && git push

# Manual deployment
npm run build && wrangler pages deploy dist --project-name=accountable-habit-tracker

# Test everything locally first
npm run test:local && npm run serve:prod

# Check build status
wrangler pages deployment list --project-name=accountable-habit-tracker

# Check what will be deployed
npm run deploy:dry-run
```

---

**⏱️ Time Required:**
- Local testing: 2-5 minutes
- Build: 30 seconds
- Deploy: 30 seconds (auto via GitHub)
- **Total: ~5 minutes**

**💰 Cost:**
- Cloudflare Pages: $0
- Bandwidth: $0
- SSL: $0
- **Total: $0**

---

Last Updated: November 2024 | Version: 2.0.0 | Platform: Cloudflare Pages