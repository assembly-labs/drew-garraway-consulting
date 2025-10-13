# Can't Stop Won't Stop 💪

A no-nonsense workout app that pushes you through timed workouts with motivational messaging.

## Quick Start

### Local Development
```bash
cd prototype
npm install
npm run dev
```

Open http://localhost:3000

### Test on Mobile Device (Same WiFi Required)
```bash
cd prototype
npm run dev:mobile
```
Then visit the displayed IP address on your phone (e.g., `http://192.168.1.100:3000`)

### Build for Production
```bash
cd prototype
npm run build
```
Creates optimized files in `prototype/dist/`

## Project Structure
- `/prototype` - Main React app (Vite + React + TypeScript)
- `/docs-private` - Strategy & planning docs (not public)
- `/docs` - Public documentation

## Tech Stack
- React 18 + TypeScript
- Vite 5 (build tool)
- Local Storage (data persistence)
- Netlify (hosting)

## Features
✅ Challenge Mode & Beast Mode
✅ Timed workouts with rest periods
✅ Workout plan management
✅ Exercise library with search
✅ Workout history tracking
✅ Push messaging system

## Deployment
See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Netlify deployment instructions.

## Current Status
🟡 **Prototype Phase** (~70% MVP complete)

Next up: Settings screen, stagnation detection, advanced analytics
