# 🧪 HABIT TRACKER - LOCAL TESTING GUIDE

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Testing Workflow](#testing-workflow)
- [Testing Commands](#testing-commands)
- [Manual Testing Checklist](#manual-testing-checklist)
- [Mobile Testing](#mobile-testing)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Run preflight check
npm run preflight

# 3. Start development server
npm run dev

# 4. Open browser to http://localhost:5173
```

---

## 🔄 Testing Workflow

### **STAGE 1: Development Testing**
```bash
# Start dev server with hot reload
npm run dev

# In another terminal, run type checking
npm run typecheck

# Check for linting issues
npm run lint
```

### **STAGE 2: Build Testing**
```bash
# Test the build process
npm run build

# Preview the production build
npm run preview
# Opens at http://localhost:4173
```

### **STAGE 3: Production Simulation**
```bash
# Build and serve production version
npm run test:preview

# OR serve existing build
npm run serve:prod
# Opens at http://localhost:3000
```

### **STAGE 4: Final Validation**
```bash
# Run complete preflight check
npm run preflight

# Dry run deployment (no actual deploy)
npm run deploy:dry-run
```

---

## 💻 Testing Commands

| Command | Description | Use When |
|---------|-------------|----------|
| `npm run dev` | Start development server | Active development |
| `npm run build` | Build for production | Testing build process |
| `npm run preview` | Preview production build | Testing built app |
| `npm run typecheck` | Check TypeScript types | Before committing |
| `npm run lint` | Check code quality | Before committing |
| `npm run test:local` | Run all checks + build | Full validation |
| `npm run test:preview` | Build + preview | Test production behavior |
| `npm run serve:prod` | Serve dist folder | Test deployed version |
| `npm run preflight` | Complete validation | Before deployment |
| `npm run clean` | Clean build artifacts | Troubleshooting |
| `npm run clean:full` | Full reset | Major issues |

---

## ✅ Manual Testing Checklist

### **Core Functionality**

#### 1. Dashboard View
- [ ] Page loads without errors
- [ ] Current date displays correctly
- [ ] All 6 habit cards visible (Yoga, Gym, Jiu-jitsu, Meditation, Not yelling, Supplements)
- [ ] Cluster headers show correct counts (0/1, 0/2, etc.)

#### 2. Habit Completion - Swipe Actions
- [ ] **Desktop:** Drag left/right on habit card to toggle
- [ ] **Mobile:** Swipe left/right on habit card to toggle
- [ ] Card changes color when completed (green)
- [ ] Check mark appears when completed
- [ ] "← Swipe →" hint shows for uncompleted items
- [ ] Haptic feedback on mobile (vibration)

#### 3. Cluster Progress
- [ ] PHYSICAL cluster: Requires 1 of 3 (Yoga/Gym/Jiu-jitsu)
- [ ] MENTAL cluster: Requires 2 of 2 (Meditation/Not yelling)
- [ ] DIET/HEALTH cluster: Requires 1 of 1 (Supplements)
- [ ] Cluster header turns blue when complete
- [ ] Overall progress updates (X/3 clusters complete)

#### 4. Data Persistence
- [ ] Complete some habits
- [ ] Refresh page (F5)
- [ ] Completed habits remain marked
- [ ] Progress persists correctly

#### 5. Calendar View
- [ ] "View Calendar" button works
- [ ] Calendar displays current month
- [ ] Previous/next month navigation works
- [ ] Days show correct colors:
  - Gray: No habits completed
  - Yellow: Some clusters complete
  - Green: All clusters complete
- [ ] Back button returns to dashboard

#### 6. Streak Counter
- [ ] Complete all clusters for today
- [ ] Streak shows "1 day streak"
- [ ] Check previous days affect streak

### **Browser Compatibility**

Test on:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### **Performance Checks**

- [ ] Initial load time < 3 seconds
- [ ] Smooth animations (60 fps)
- [ ] No console errors
- [ ] Build size < 500KB gzipped

---

## 📱 Mobile Testing

### **Option 1: Browser DevTools**
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device (iPhone, Pixel, etc.)
4. Test touch/swipe gestures

### **Option 2: Local Network Testing**
```bash
# Start dev server with network access
npm run dev -- --host

# You'll see:
# ➜ Local:   http://localhost:5173/
# ➜ Network: http://192.168.1.100:5173/  <-- Use this on your phone
```

1. Ensure phone is on same WiFi network
2. Open the Network URL on your phone
3. Test actual touch/swipe gestures

### **Mobile Test Points**
- [ ] Swipe gestures work smoothly
- [ ] Touch targets are large enough
- [ ] No horizontal scrolling
- [ ] Keyboard doesn't break layout
- [ ] Haptic feedback works (vibration)

---

## 🛠️ Troubleshooting

### **Build Failures**

```bash
# TypeScript errors
npm run typecheck
# Fix any type errors shown

# Clean and rebuild
npm run clean
npm run build

# Full reset
npm run clean:full
npm install
npm run build
```

### **Module Resolution Issues**

```bash
# Check tsconfig paths
cat tsconfig.app.json | grep -A 3 "paths"

# Verify @ alias works
grep -r "@/" src/ --include="*.ts*"
```

### **Tailwind Not Working**

```bash
# Check Tailwind config
cat tailwind.config.js

# Rebuild CSS
rm -rf dist
npm run build
```

### **Port Already in Use**

```bash
# Find process using port 5173
lsof -i :5173

# Kill process
kill -9 [PID]

# Or use different port
npm run dev -- --port 3001
```

---

## 📊 Performance Monitoring

### **Check Build Size**
```bash
# After building
du -sh dist/
ls -lah dist/assets/
```

### **Analyze Bundle**
```bash
# Install analyzer (one time)
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts, then build
# Check stats.html in project root
```

---

## ✍️ Pre-Commit Checklist

Before committing code:

1. **Code Quality**
   ```bash
   npm run typecheck
   npm run lint
   ```

2. **Build Test**
   ```bash
   npm run build
   ```

3. **Manual Testing**
   - Complete the manual testing checklist above
   - Test on at least 2 browsers
   - Test on mobile (real device or emulator)

4. **Final Check**
   ```bash
   npm run preflight
   ```

---

## 🚨 IMPORTANT NOTES

1. **Always test locally first** - Never deploy untested code
2. **Use preflight check** - Run before any deployment
3. **Test on mobile** - Many users will use phones
4. **Check console** - No errors should appear
5. **Verify persistence** - LocalStorage must work

---

## 📞 Need Help?

If tests are failing:
1. Check the error messages carefully
2. Run `npm run clean:full` and reinstall
3. Verify Node.js version >= 18
4. Check GitHub issues for similar problems

---

**Last Updated:** November 2024
**Version:** 1.0.0