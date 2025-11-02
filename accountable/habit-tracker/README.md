# 🎯 Habit Tracker

A modular habit tracking application with swipe gestures, cluster requirements, and persistent local storage.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 💰 Zero-Cost Testing & Deployment Strategy

**IMPORTANT:** This project is configured to minimize Netlify build credits by testing everything locally first.

### Local Testing (FREE)

```bash
# Run complete test suite locally (costs $0)
npm run preflight

# Build and preview production version locally
npm run test:preview
```

### Deployment (Manual Only)

```bash
# Build locally, deploy only the dist/ folder (uses 0 Netlify credits)
npm run build && netlify deploy --dir=dist --prod
```

## 📁 Project Structure

```
habit-tracker/
├── src/
│   ├── config/         # Module registry & cluster definitions
│   ├── core/           # Dashboard, Calendar, Header components
│   ├── data/           # Models & repository layer
│   ├── modules/        # Individual habit modules (extensible)
│   ├── router/         # React Router configuration
│   ├── shared/         # Reusable components
│   ├── store/          # Zustand state management
│   └── types/          # TypeScript definitions
├── scripts/            # Testing & deployment scripts
├── CHECKLIST.md        # Quick deployment checklist
├── TEST_GUIDE.md       # Comprehensive testing guide
└── DEPLOYMENT.md       # Deployment procedures
```

## 🧪 Available Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | Start development server | Daily development |
| `npm run build` | Build for production | Before deployment |
| `npm run preview` | Preview production build | Test built app |
| `npm run test:local` | Run all checks + build | Full validation |
| `npm run preflight` | Complete validation check | Before deployment |
| `npm run serve:prod` | Serve production locally | Final testing |

## ✨ Features

### Core Functionality
- **6 Habit Modules**: Yoga, Gym, Jiu-jitsu, Meditation, Not yelling, Supplements
- **Swipe to Complete**: Touch-friendly gesture controls
- **Cluster Requirements**:
  - PHYSICAL: 1 of 3 required
  - MENTAL: 2 of 2 required
  - DIET/HEALTH: 1 of 1 required
- **Data Persistence**: LocalStorage for offline functionality
- **Calendar View**: Monthly overview with color coding
- **Streak Tracking**: Consecutive days counter

### Technical Features
- **Modular Architecture**: Easy to add new habits
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Zustand**: Lightweight state management
- **Vite**: Lightning-fast builds

## 📱 Testing

### Local Device Testing

```bash
# Start dev server with network access
npm run dev -- --host

# Access from your phone using the Network URL
# Example: http://192.168.1.100:5173
```

### Browser Testing
- Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
- Test swipe gestures with mouse drag
- Verify haptic feedback on mobile

## 🚀 Deployment Workflow

### 1. Local Testing First (ALWAYS)

```bash
npm run preflight  # Must pass before deployment
```

### 2. GitHub (Version Control)

```bash
git add .
git commit -m "Description of changes"
git push
```

### 3. Deploy to Netlify (Manual)

```bash
# Option A: CLI (Recommended - 0 credits)
npm run build
netlify deploy --dir=dist --prod

# Option B: Drag & Drop (0 credits)
# 1. Run: npm run build
# 2. Drag dist/ folder to Netlify UI
```

## 📋 Documentation

- **[TEST_GUIDE.md](TEST_GUIDE.md)** - Comprehensive testing procedures
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed deployment guide
- **[CHECKLIST.md](CHECKLIST.md)** - Quick pre-deployment checklist

## 🛠️ Extending the App

### Adding New Habits

1. Create new module in `src/modules/[habit-name]/`
2. Extend `BaseHabitModule` class
3. Register in `src/config/modules.ts`
4. Add to appropriate cluster in `src/config/clusters.ts`

### Custom Components

Habits can have custom dashboard cards by implementing their own `DashboardCard` component instead of using `SimpleHabitCard`.

## 🐛 Troubleshooting

### Build Failures

```bash
# Clean and rebuild
npm run clean
npm run build

# Full reset
npm run clean:full
npm install
```

### Port Already in Use

```bash
# Use different port
npm run dev -- --port 3001
```

## 📊 Performance

- **Build Size**: ~420KB (134KB gzipped)
- **Load Time**: <3 seconds
- **Lighthouse Score**: >90 all categories

## 🔒 Security

- No external API calls
- All data stored locally
- No tracking or analytics
- No authentication required

## 📄 License

Private project - All rights reserved

## 🙏 Credits

Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Zustand.

---

**Version:** 1.0.0
**Last Updated:** November 2024
**Status:** ✅ Production Ready